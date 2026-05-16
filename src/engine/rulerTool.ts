// src/engine/rulerTool.ts
// Ferramenta Régua — mede distâncias no mapa em pés (D&D 5e).
//
// Comportamento:
//   Clique          → adiciona ponto de medição (segmento acumulado)
//   Mousemove       → preview do segmento atual até o cursor
//   Escape / R      → cancela e limpa a régua
//   Clique direito  → remove o último ponto
//
// Cada segmento mostra sua distância individual.
// O label flutuante final mostra o total acumulado.

import * as PIXI from 'pixi.js'
import { BASE_GRID_SIZE, FEET_PER_CELL, distanceUnit } from '../data/constants'

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES VISUAIS
// ─────────────────────────────────────────────────────────────────────────────
const COLOR_LINE       = 0x00cfff   // azul ciano
const COLOR_LINE_PREV  = 0x00cfff   // mesma cor, alpha menor
const COLOR_DOT        = 0xffffff
const COLOR_DOT_FIRST  = 0x00cfff
const COLOR_LABEL_BG   = 0x000000
const FONT_FAMILY      = "'Cinzel', serif"
const FONT_SIZE        = 13
const LINE_WIDTH       = 2
const DOT_RADIUS       = 5
const LABEL_PADDING    = 6

// ─────────────────────────────────────────────────────────────────────────────
// ESTADO
// ─────────────────────────────────────────────────────────────────────────────
export interface RulerState {
    active:       boolean
    points:       { x: number; y: number }[]   // pontos fixados pelo clique
    previewPoint: { x: number; y: number } | null
}

export const rulerState: RulerState = {
    active:       false,
    points:       [],
    previewPoint: null,
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER
// ─────────────────────────────────────────────────────────────────────────────
let rulerGfx:    PIXI.Graphics   | null = null
let labelPool:   PIXI.Container[]       = []   // pool de labels reutilizáveis
let rulerLayer:  PIXI.Container  | null = null

export function initRuler(layer: PIXI.Container) {
    if (rulerGfx) return
    rulerLayer = layer

    rulerGfx = new PIXI.Graphics()
    rulerGfx.label   = 'ruler-gfx'
    rulerGfx.zIndex  = 10000
    layer.addChild(rulerGfx)
}

// ─────────────────────────────────────────────────────────────────────────────
// RESET
// ─────────────────────────────────────────────────────────────────────────────
export function resetRuler() {
    rulerState.active       = false
    rulerState.points       = []
    rulerState.previewPoint = null
    clearRulerGraphics()
}

function clearRulerGraphics() {
    if (rulerGfx) rulerGfx.clear()
    labelPool.forEach(l => l.visible = false)
}

// ─────────────────────────────────────────────────────────────────────────────
// CÁLCULO DE DISTÂNCIA
// Usa Chebyshev (diagonal = 1 célula = 5 pés) — padrão D&D 5e
// ─────────────────────────────────────────────────────────────────────────────
function segmentDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
    const dx   = Math.abs(a.x - b.x) / BASE_GRID_SIZE
    const dy   = Math.abs(a.y - b.y) / BASE_GRID_SIZE
    const feet = Math.max(dx, dy) * FEET_PER_CELL
    return distanceUnit === 'm' ? feet * 0.3 : feet
}

function totalFeet(points: { x: number; y: number }[], preview?: { x: number; y: number } | null): number {
    let total = 0
    for (let i = 1; i < points.length; i++) {
        total += segmentFeet(points[i - 1], points[i])
    }
    if (preview && points.length > 0) {
        total += segmentFeet(points[points.length - 1], preview)
    }
    return total
}

// ─────────────────────────────────────────────────────────────────────────────
// LABEL — pega do pool ou cria novo
// ─────────────────────────────────────────────────────────────────────────────
function getLabel(index: number): PIXI.Container {
    if (labelPool[index]) {
        labelPool[index].visible = true
        return labelPool[index]
    }

    const container = new PIXI.Container()
    container.zIndex = 10001

    const bg = new PIXI.Graphics()
    bg.label = 'bg'
    container.addChild(bg)

    const text = new PIXI.Text({
        text: '',
        style: {
            fontFamily: FONT_FAMILY,
            fontSize:   FONT_SIZE,
            fill:       0xffffff,
            fontWeight: '600',
        }
    })
    text.label  = 'text'
    text.anchor.set(0.5)
    container.addChild(text)

    rulerLayer?.addChild(container)
    labelPool[index] = container
    return container
}

function setLabelText(container: PIXI.Container, value: string, x: number, y: number) {
    const text = container.getChildByLabel('text') as PIXI.Text
    const bg   = container.getChildByLabel('bg')   as PIXI.Graphics

    text.text = value
    const w   = text.width  + LABEL_PADDING * 2
    const h   = text.height + LABEL_PADDING

    bg.clear()
    bg.roundRect(-w / 2, -h / 2, w, h, 4)
      .fill({ color: COLOR_LABEL_BG, alpha: 0.75 })

    container.x = x
    container.y = y - 18   // levemente acima do ponto
}

// ─────────────────────────────────────────────────────────────────────────────
// DRAW — chamado todo frame
// ─────────────────────────────────────────────────────────────────────────────
export function drawRuler() {
    if (!rulerGfx || !rulerState.active) {
        clearRulerGraphics()
        return
    }

    rulerGfx.clear()
    labelPool.forEach(l => l.visible = false)

    const pts     = rulerState.points
    const preview = rulerState.previewPoint
    let   labelIdx = 0

    if (pts.length === 0) return

    // ── Segmentos fixados ────────────────────────────────────────────────────
    let accumulated = 0

    for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1]
        const b = pts[i]

        // Linha
        rulerGfx
            .moveTo(a.x, a.y)
            .lineTo(b.x, b.y)
        rulerGfx.stroke({ width: LINE_WIDTH, color: COLOR_LINE, alpha: 1 })

        // Distância do segmento
        const segDist = segmentDistance(a, b)
        accumulated += segDist

        // Label no ponto destino
        const label = getLabel(labelIdx++)
        setLabelText(label, `${Math.round(segDist)} ${unitLabel()}`, b.x, b.y)
    }

    // ── Segmento preview (até o mouse) ───────────────────────────────────────
    if (preview && pts.length > 0) {
        const last = pts[pts.length - 1]

        rulerGfx
            .moveTo(last.x, last.y)
            .lineTo(preview.x, preview.y)
        rulerGfx.stroke({ width: LINE_WIDTH, color: COLOR_LINE_PREV, alpha: 0.5 })

        const previewDist = segmentDistance(last, preview)
        const totalDist   = accumulated + previewDist

        // Label flutuante no cursor
        const u = unitLabel()
        const label = getLabel(labelIdx++)
        const displayText = pts.length > 1
            ? `${Math.round(previewDist)} ${u}  (total: ${Math.round(totalDist)} ${u})`
            : `${Math.round(previewDist)} ${u}`
        setLabelText(label, displayText, preview.x, preview.y)
    }

    // ── Pontos (dots) ────────────────────────────────────────────────────────
    pts.forEach((p, i) => {
        const color  = i === 0 ? COLOR_DOT_FIRST : COLOR_DOT
        const radius = i === 0 ? DOT_RADIUS + 2  : DOT_RADIUS
        rulerGfx!
            .circle(p.x, p.y, radius)
            .fill({ color, alpha: 0.9 })
    })

    // Dot no preview
    if (preview) {
        rulerGfx
            .circle(preview.x, preview.y, DOT_RADIUS - 1)
            .fill({ color: COLOR_DOT, alpha: 0.5 })
    }
}

function unitLabel(): string {
    return distanceUnit === 'm' ? 'm' : 'ft'
}