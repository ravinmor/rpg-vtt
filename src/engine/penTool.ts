// src/engine/penTool.ts
// Ferramenta Caneta estilo Figma.
// Clique → adiciona ponto âncora.
// Clique + arrastar → cria curva de Bézier (handles).
// Duplo-clique ou Enter → fecha o caminho e abre o menu de rituais.
// Escape → cancela.

import * as PIXI from 'pixi.js'
import { viewport } from './scene'

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────
export interface AnchorPoint {
    x:  number      // posição no mundo
    y:  number
    cpIn?:  { x: number; y: number }  // handle de entrada (Bézier)
    cpOut?: { x: number; y: number }  // handle de saída
}

export interface PenState {
    active:       boolean
    anchors:      AnchorPoint[]
    previewPoint: { x: number; y: number } | null  // posição do mouse
    dragging:     boolean                           // true enquanto arrasta handle
    dragAnchorIdx: number                           // índice do âncora sendo arrastado
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTADO INTERNO
// ─────────────────────────────────────────────────────────────────────────────
export const penState: PenState = {
    active:       false,
    anchors:      [],
    previewPoint: null,
    dragging:     false,
    dragAnchorIdx: -1,
}

// Layer PixiJS onde o preview é desenhado
let previewGfx: PIXI.Graphics | null = null

export function initPenPreview(layer: PIXI.Container) {
    if (previewGfx) return
    previewGfx = new PIXI.Graphics()
    previewGfx.label = 'pen-preview'
    previewGfx.zIndex = 9999
    layer.addChild(previewGfx)
}

// ─────────────────────────────────────────────────────────────────────────────
// RESET
// ─────────────────────────────────────────────────────────────────────────────
export function resetPen() {
    penState.active        = false
    penState.anchors       = []
    penState.previewPoint  = null
    penState.dragging      = false
    penState.dragAnchorIdx = -1
    if (previewGfx) previewGfx.clear()
}

// ─────────────────────────────────────────────────────────────────────────────
// VERIFICAR CLIQUE NO PRIMEIRO PONTO (fechar caminho)
// ─────────────────────────────────────────────────────────────────────────────
export function isNearFirstAnchor(x: number, y: number, threshold = 12): boolean {
    if (penState.anchors.length < 3) return false
    const first = penState.anchors[0]
    return Math.hypot(x - first.x, y - first.y) <= threshold
}

// ─────────────────────────────────────────────────────────────────────────────
// ADICIONAR PONTO
// ─────────────────────────────────────────────────────────────────────────────
export function addAnchor(x: number, y: number) {
    penState.anchors.push({ x, y })
}

// ─────────────────────────────────────────────────────────────────────────────
// EXTRAIR PATH FINAL (amostras ao longo das curvas)
// ─────────────────────────────────────────────────────────────────────────────
export function buildFinalPath(closed = true): { x: number; y: number }[] {
    const anchors = penState.anchors
    if (anchors.length < 2) return anchors.map(a => ({ x: a.x, y: a.y }))

    const pts: { x: number; y: number }[] = []
    const segments = closed ? anchors.length : anchors.length - 1

    for (let i = 0; i < segments; i++) {
        const a = anchors[i]
        const b = anchors[(i + 1) % anchors.length]

        const p0 = { x: a.x, y: a.y }
        const p3 = { x: b.x, y: b.y }
        const p1 = a.cpOut  ?? p0
        const p2 = b.cpIn   ?? p3

        // Amostrar a curva cúbica de Bézier
        const steps = hasCurve(p0, p1, p2, p3) ? 20 : 1
        for (let t = 0; t <= steps; t++) {
            const tt = t / steps
            pts.push(cubicBezier(p0, p1, p2, p3, tt))
        }
    }

    return pts
}

function hasCurve(
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number }
): boolean {
    return !(p1.x === p0.x && p1.y === p0.y && p2.x === p3.x && p2.y === p3.y)
}

function cubicBezier(
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    t: number
): { x: number; y: number } {
    const mt = 1 - t
    return {
        x: mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x,
        y: mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// DESENHO DO PREVIEW (chamado a cada frame enquanto pen está ativo)
// ─────────────────────────────────────────────────────────────────────────────
export function drawPenPreview() {
    if (!previewGfx || !penState.active) return
    previewGfx.clear()

    const anchors = penState.anchors
    const preview = penState.previewPoint

    // ── Linha / curva já traçada ──────────────────────────────────────────
    if (anchors.length >= 2) {
        previewGfx.setStrokeStyle({ width: 1.5, color: 0xf0b030, alpha: 0.9 })
        previewGfx.moveTo(anchors[0].x, anchors[0].y)

        for (let i = 1; i < anchors.length; i++) {
            const a = anchors[i - 1]
            const b = anchors[i]
            drawSegment(previewGfx, a, b)
        }
        previewGfx.stroke()
    }

    // ── Segmento "fantasma" até o mouse ───────────────────────────────────
    if (anchors.length >= 1 && preview) {
        const last = anchors[anchors.length - 1]
        previewGfx.setStrokeStyle({ width: 1, color: 0xf0b030, alpha: 0.45 })
        previewGfx.moveTo(last.x, last.y)
        const cpOut = last.cpOut ?? { x: last.x, y: last.y }
        previewGfx.bezierCurveTo(cpOut.x, cpOut.y, preview.x, preview.y, preview.x, preview.y)
        previewGfx.stroke()
    }

    // ── Handles das âncoras ───────────────────────────────────────────────
    anchors.forEach((a, idx) => {
        const isFirst = idx === 0
        const nearFirst = preview && isNearFirstAnchor(preview.x, preview.y)

        // Círculo âncora
        const color  = (isFirst && nearFirst) ? 0x00ff88 : 0xf0b030
        const radius = (isFirst && nearFirst) ? 8 : 5
        previewGfx.circle(a.x, a.y, radius)
            .fill({ color, alpha: 0.9 })
            .stroke({ color: 0x000000, width: 1, alpha: 0.5 })

        // Handles de Bézier
        if (a.cpOut) drawHandle(previewGfx, a, a.cpOut)
        if (a.cpIn)  drawHandle(previewGfx, a, a.cpIn)
    })

    // ── Ponto de preview (cursor) ─────────────────────────────────────────
    if (preview) {
        const near = isNearFirstAnchor(preview.x, preview.y)
        previewGfx.circle(preview.x, preview.y, near ? 8 : 4)
            .fill({ color: near ? 0x00ff88 : 0xffffff, alpha: 0.6 })
    }
}

function drawSegment(gfx: PIXI.Graphics, a: AnchorPoint, b: AnchorPoint) {
    const cpOut = a.cpOut ?? { x: a.x, y: a.y }
    const cpIn  = b.cpIn  ?? { x: b.x, y: b.y }
    gfx.bezierCurveTo(cpOut.x, cpOut.y, cpIn.x, cpIn.y, b.x, b.y)
}

function drawHandle(gfx: PIXI.Graphics, anchor: AnchorPoint, handle: { x: number; y: number }) {
    gfx.setStrokeStyle({ width: 1, color: 0xaaaaaa, alpha: 0.7 })
    gfx.moveTo(anchor.x, anchor.y)
    gfx.lineTo(handle.x, handle.y)
    gfx.stroke()
    gfx.circle(handle.x, handle.y, 3)
        .fill({ color: 0xffffff, alpha: 0.8 })
}