// src/engine/transformGizmo.ts
//
// Substitui completamente o sistema manual de handles do uiDrawer + mouseHandlers.
// Usa containers e eventos nativos do PixiJS v8 para resize e rotação,
// eliminando a necessidade de editHandles, isResizing, isRotating, etc. no estado global.
//
// ARQUITETURA:
//   layerUI
//     └─ TransformGizmo (Container)
//          ├─ selectionGraphic   (borda de seleção — Graphics)
//          ├─ resizeHandle       (Container interativo — canto/borda direita)
//          └─ rotateHandle       (Container interativo — acima do centro)
//
// O Gizmo escuta eventos do Pixi (pointerdown / pointermove / pointerup)
// diretamente nos handles, sem passar pelo mouseHandlers.ts.

import * as PIXI from 'pixi.js'
import { layerUI, viewport } from './scene'
import { getBoundingBox } from '../utils/math'

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────
interface Point { x: number; y: number }

type Zone = {
    id: string
    type: string
    path?: Point[]
    x?: number
    y?: number
    radius?: number
    fontSize?: number
    rotation?: number
    text?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// GIZMO
// ─────────────────────────────────────────────────────────────────────────────
class TransformGizmo {
    private root:             PIXI.Container
    private selectionGfx:     PIXI.Graphics
    private resizeHandle:     PIXI.Container
    private rotateHandle:     PIXI.Container
    private connectorGfx:     PIXI.Graphics

    private zone:             Zone | null = null

    // Estado de drag do resize
    private _resizeDragging   = false
    private _resizeStart:     Point | null = null
    private _originalPath:    Point[] | null = null
    private _originalRadius   = 0
    private _originalFontSize = 0

    // Estado de drag do rotate
    private _rotateDragging     = false
    private _rotateCenter:      Point | null = null
    private _rotateStartAngle   = 0
    private _rotateOriginalPath: Point[] | null = null

    // Posição dos handles (coords do mundo) para o hit-test externo
    resizePos: Point | null = null
    rotatePos: Point | null = null

    constructor() {
        this.root         = new PIXI.Container()
        this.root.label   = 'TransformGizmo'
        this.selectionGfx = new PIXI.Graphics()
        this.connectorGfx = new PIXI.Graphics()
        this.resizeHandle = this._makeHandle(0xffffff, '↔')
        this.rotateHandle = this._makeHandle(0xffffff, '↻')

        this.root.addChild(this.selectionGfx)
        this.root.addChild(this.connectorGfx)
        this.root.addChild(this.resizeHandle)
        this.root.addChild(this.rotateHandle)

        layerUI.addChild(this.root)

        this._bindHandle(this.resizeHandle, 'resize')
        this._bindHandle(this.rotateHandle, 'rotate')
    }

    // ── API pública ──────────────────────────────────────────────────────────

    /** Mostra o gizmo em torno da zona fornecida */
    attach(zone: Zone) {
        this.zone        = zone
        this.root.visible = true
        this._draw()
    }

    /** Esconde o gizmo */
    detach() {
        this.zone         = null
        this.root.visible = false
        this.resizePos    = null
        this.rotatePos    = null
    }

    /** Chamado todo frame para redesenhar (a zona pode ter sido movida) */
    tick() {
        if (!this.zone || !this.root.visible) return
        this._draw()
    }

    // ── Desenho ──────────────────────────────────────────────────────────────

    private _draw() {
        const zone = this.zone!
        this.selectionGfx.clear()
        this.connectorGfx.clear()

        if (zone.type === 'spell_object') {
            this._drawForSpell(zone)
        } else if (zone.path && zone.path.length > 1) {
            this._drawForPath(zone)
        } else if (zone.type === 'text') {
            this._drawForText(zone)
        }
    }

    private _drawForSpell(zone: Zone) {
        const cx = zone.x!
        const cy = zone.y!
        const r  = zone.radius!

        this.selectionGfx
            .circle(cx, cy, r + 4)
            .stroke({ color: 0xffffff, alpha: 0.9, width: 2 })

        // Handle de resize: mantém
        const rx = cx + r
        const ry = cy
        this._placeHandle(this.resizeHandle, rx, ry)
        this.resizePos = { x: rx, y: ry }

        // REMOVIDO: rotateHandle, rotatePos e connectorGfx
        // O rotate handle simplesmente não é posicionado para spell_object
        this.rotateHandle.visible = false  // ← esconde sem destruir
        this.rotatePos = null              // ← anula o hit-test
    }

    private _drawForPath(zone: Zone) {
        this.rotateHandle.visible = true;
        const bb = getBoundingBox(zone.path!)

        // Borda de seleção
        this.selectionGfx
            .rect(bb.minX - 4, bb.minY - 4, bb.width + 8, bb.height + 8)
            .stroke({ color: 0xffffff, alpha: 0.7, width: 1 })

        // Handle de resize: canto inferior-direito
        const rx = bb.maxX + 4
        const ry = bb.maxY + 4
        this._placeHandle(this.resizeHandle, rx, ry)
        this.resizePos = { x: rx, y: ry }

        // Handle de rotate: centro-topo
        const rotX = bb.minX + bb.width / 2
        const rotY = bb.minY - 30
        this._placeHandle(this.rotateHandle, rotX, rotY)
        this.rotatePos = { x: rotX, y: rotY }

        this.connectorGfx
            .moveTo(rotX, bb.minY - 4)
            .lineTo(rotX, rotY + HANDLE_R)
            .stroke({ color: 0xffffff, alpha: 0.4, width: 1 })
    }

    private _drawForText(zone: Zone) {
        const cx  = zone.x!
        const cy  = zone.y!
        const w   = (zone.text!.length * (zone.fontSize || 24)) * 0.6
        const h   = zone.fontSize || 24
        const rot = zone.rotation || 0

        // Os 4 cantos do retângulo sem rotação, centrados em (cx, cy)
        const corners = [
            { x: -w / 2, y: -h / 2 },
            { x:  w / 2, y: -h / 2 },
            { x:  w / 2, y:  h / 2 },
            { x: -w / 2, y:  h / 2 },
        ]

        // Rotaciona cada canto em torno do centro
        const cos = Math.cos(rot)
        const sin = Math.sin(rot)
        const rotated = corners.map(p => ({
            x: cx + p.x * cos - p.y * sin,
            y: cy + p.x * sin + p.y * cos,
        }))

        // Desenha o retângulo rotacionado
        this.selectionGfx.moveTo(rotated[0].x, rotated[0].y)
        this.selectionGfx.lineTo(rotated[1].x, rotated[1].y)
        this.selectionGfx.lineTo(rotated[2].x, rotated[2].y)
        this.selectionGfx.lineTo(rotated[3].x, rotated[3].y)
        this.selectionGfx.closePath()
        this.selectionGfx.stroke({ color: 0xffffff, alpha: 0.7, width: 1 })

        // Handle de resize no canto inferior-direito rotacionado
        const rx = rotated[2].x
        const ry = rotated[2].y
        this._placeHandle(this.resizeHandle, rx, ry)
        this.resizePos = { x: rx, y: ry }

        // Handle de rotate acima do centro-topo rotacionado
        const topMidX = (rotated[0].x + rotated[1].x) / 2
        const topMidY = (rotated[0].y + rotated[1].y) / 2
        const rotX = topMidX + sin * 30
        const rotY = topMidY - cos * 30
        this._placeHandle(this.rotateHandle, rotX, rotY)
        this.rotatePos = { x: rotX, y: rotY }

        this.connectorGfx
            .moveTo(topMidX, topMidY)
            .lineTo(rotX, rotY)
            .stroke({ color: 0xffffff, alpha: 0.4, width: 1 })
    }

    // ── Fábrica de handle ────────────────────────────────────────────────────

    private _makeHandle(color: number, _symbol: string): PIXI.Container {
        const c       = new PIXI.Container()
        c.eventMode   = 'static'
        c.cursor      = 'pointer'

        const gfx = new PIXI.Graphics()
        gfx.label = 'gfx'
        c.addChild(gfx)

        gfx.circle(0, 0, HANDLE_R)
            .fill({ color, alpha: 0.6 })
            .stroke({ color: 0xffffff, alpha: 0.8, width: 2 })

        return c
    }

    private _placeHandle(handle: PIXI.Container, wx: number, wy: number) {
        handle.x = wx
        handle.y = wy
    }

    // ── Binding de eventos Pixi ──────────────────────────────────────────────

    private _bindHandle(handle: PIXI.Container, mode: 'resize' | 'rotate') {
        handle.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            e.stopPropagation()

            // Desabilita pan do viewport enquanto arrasta
            viewport.plugins.pause('drag')

            const world = viewport.toWorld(e.clientX, e.clientY)
            const zone  = this.zone
            if (!zone) return

            if (mode === 'resize') {
                this._resizeDragging    = true
                this._resizeStart       = { x: world.x, y: world.y }
                this._originalRadius    = zone.radius   ?? 80
                this._originalFontSize  = zone.fontSize ?? 24
                this._originalPath      = zone.path
                    ? JSON.parse(JSON.stringify(zone.path))
                    : null

            } else {
                this._rotateDragging = true

                if (zone.path && zone.path.length > 1) {
                    this._rotateCenter       = getBoundingBoxCenter(zone.path)
                    this._rotateOriginalPath = JSON.parse(JSON.stringify(zone.path))
                } else {
                    this._rotateCenter       = { x: zone.x!, y: zone.y! }
                    this._rotateOriginalPath = null
                }
                this._rotateStartAngle = Math.atan2(
                    world.y - this._rotateCenter.y,
                    world.x - this._rotateCenter.x
                )
            }

            // Escuta move/up na janela para não perder o drag
            window.addEventListener('pointermove', this._onPointerMove)
            window.addEventListener('pointerup',   this._onPointerUp, { once: true })
        })
    }

    // ── Handlers de move e up (lambdas para manter o `this`) ────────────────

    private _onPointerMove = (e: PointerEvent) => {
        const zone = this.zone
        if (!zone) return

        const world = viewport.toWorld(e.clientX, e.clientY)

        if (this._resizeDragging) {
            this._applyResize(zone, world)
        } else if (this._rotateDragging) {
            this._applyRotate(zone, world)
        }
    }

    private _onPointerUp = () => {
        this._resizeDragging = false
        this._rotateDragging = false
        this._resizeStart    = null
        this._originalPath   = null
        this._rotateOriginalPath = null

        // Reabilita pan
        viewport.plugins.resume('drag')

        window.removeEventListener('pointermove', this._onPointerMove)
    }

    // ── Lógica de resize ─────────────────────────────────────────────────────

    private _applyResize(zone: Zone, world: Point) {
        if (!this._resizeStart) return

        if (zone.type === 'spell_object') {
            zone.radius = Math.max(20, Math.hypot(world.x - zone.x!, world.y - zone.y!))

        } else if (zone.path && this._originalPath) {
            const bb      = getBoundingBox(this._originalPath)
            const center  = { x: bb.minX + bb.width / 2, y: bb.minY + bb.height / 2 }
            const oldDist = Math.hypot(this._resizeStart.x - center.x, this._resizeStart.y - center.y)
            const newDist = Math.max(10, Math.hypot(world.x - center.x, world.y - center.y))
            const scale   = newDist / Math.max(1, oldDist)

            zone.path = this._originalPath.map(p => ({
                x: center.x + (p.x - center.x) * scale,
                y: center.y + (p.y - center.y) * scale,
            }))

        } else if (zone.type === 'text') {
            const dx      = world.x - zone.x!
            const dy      = world.y - zone.y!
            const angle   = -(zone.rotation || 0)
            const localX  = dx * Math.cos(angle) - dy * Math.sin(angle)
            const localY  = dx * Math.sin(angle) + dy * Math.cos(angle)
            const oldDist = Math.hypot(this._resizeStart.x - zone.x!, this._resizeStart.y - zone.y!)
            const newDist = Math.max(10, Math.hypot(localX, localY))
            zone.fontSize = clamp(this._originalFontSize * (newDist / Math.max(1, oldDist)), 10, 150)
        }
    }

    // ── Lógica de rotate ─────────────────────────────────────────────────────

    private _applyRotate(zone: Zone, world: Point) {
        if (!this._rotateCenter) return

        const currentAngle = Math.atan2(
            world.y - this._rotateCenter.y,
            world.x - this._rotateCenter.x
        )
        const delta = currentAngle - this._rotateStartAngle

        if (zone.type === 'text') {
            zone.rotation = Math.atan2(world.y - zone.y!, world.x - zone.x!) + Math.PI / 2

        } else if (zone.path && this._rotateOriginalPath) {
            const { x: cx, y: cy } = this._rotateCenter
            const cos = Math.cos(delta)
            const sin = Math.sin(delta)

            zone.path = this._rotateOriginalPath.map(p => ({
                x: cx + (p.x - cx) * cos - (p.y - cy) * sin,
                y: cy + (p.x - cx) * sin + (p.y - cy) * cos,
            }))
        }
    }

    /** Retorna true se um ponto do mundo está sobre um dos handles */
    hitsHandle(wx: number, wy: number): boolean {
        if (!this.root.visible) return false
        const hitR = HANDLE_R * 1.5
        if (this.resizePos && Math.hypot(wx - this.resizePos.x, wy - this.resizePos.y) <= hitR) return true
        if (this.rotatePos && Math.hypot(wx - this.rotatePos.x, wy - this.rotatePos.y) <= hitR) return true
        return false
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES / UTILS
// ─────────────────────────────────────────────────────────────────────────────
const HANDLE_R = 6

function clamp(v: number, min: number, max: number) {
    return Math.min(Math.max(v, min), max)
}

function getBoundingBoxCenter(path: Point[]): Point {
    const bb = getBoundingBox(path)
    return { x: bb.minX + bb.width / 2, y: bb.minY + bb.height / 2 }
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLETON — uma instância compartilhada por toda a aplicação
// ─────────────────────────────────────────────────────────────────────────────
export let gizmo: TransformGizmo

export function initGizmo() {
    gizmo = new TransformGizmo()
    gizmo.detach() // começa invisível
}