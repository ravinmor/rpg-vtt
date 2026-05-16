// src/engine/fogOfWar.ts
import * as PIXI from 'pixi.js'
import { app, layerFog } from './scene'

interface FogZone {
    id:          string
    polygon:     { x: number; y: number }[]
    erased:      { x: number; y: number; r: number }[]
    fogSprite:   PIXI.Sprite         | null
    maskSprite:  PIXI.Sprite         | null
    maskTexture: PIXI.RenderTexture  | null
}

// ── Blob de névoa roxa ────────────────────────────────────────────────────────
interface MistBlob {
    x:           number
    y:           number
    vx:          number
    vy:          number
    size:        number
    alpha:       number
    pulseOffset: number
    pulseSpeed:  number
}

const WORLD_W = 4000
const WORLD_H = 4000

let fogSprite:   PIXI.Sprite        | null = null
let maskSprite:  PIXI.Sprite        | null = null
let maskTexture: PIXI.RenderTexture | null = null
let eraseGfx:    PIXI.Graphics      | null = null
let initialized  = false

let fogPolygon:    { x: number; y: number }[] = []
let erasedCircles: { x: number; y: number; r: number }[] = []

let fogZones: FogZone[] = []
export let fogActive    = false
export const ERASER_RADIUS = 60

// ── Névoa roxa animada ────────────────────────────────────────────────────────
let mistGfx:    PIXI.Graphics  | null = null   // filho do layerFog — clipado pela máscara
let mistFilter: PIXI.BlurFilter | null = null
let mistBlobs:  MistBlob[]            = []
let mistTime    = 0

const MIST_COUNT  = 120                // mais blobs para acumular mais cor
const MIST_COLOR  = 0x3a0060          // roxo bem escuro

function makeMistBlob(): MistBlob {
    return {
        x:           Math.random() * WORLD_W,
        y:           Math.random() * WORLD_H,
        vx:          (Math.random() - 0.5) * 0.3,
        vy:          (Math.random() - 0.5) * 0.15,
        size:        180 + Math.random() * 280,      // blobs ainda maiores
        alpha:       0.12 + Math.random() * 0.10,    // alpha alto — add não acumula tanto quanto screen
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed:  0.008 + Math.random() * 0.015,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────
export function initFog() {
    if (initialized) return
    initialized = true

    // Cria o filtro PRIMEIRO — rebuildZone pode ser chamado antes do fim do initFog
    mistFilter        = new PIXI.BlurFilter()
    mistFilter.blur   = 60
    mistFilter.quality = 4

    // Spawna os blobs distribuídos pelo mundo
    mistBlobs = Array.from({ length: MIST_COUNT }, makeMistBlob)

    // ── Cursor do borracha ────────────────────────────────────────────────────
    eraseGfx           = new PIXI.Graphics()
    eraseGfx.label     = 'fog-erase-cursor'
    eraseGfx.eventMode = 'none'
    layerFog.addChild(eraseGfx)

    layerFog.visible = false
}

// ─────────────────────────────────────────────────────────────────────────────
// TICK — anima os blobs (chamado pelo app.ticker em main.ts)
// ─────────────────────────────────────────────────────────────────────────────
export function tickFogMist() {
    if (!fogActive || fogZones.length === 0) return

    mistTime += 0.012

    // Atualiza posição dos blobs
    for (const b of mistBlobs) {
        b.x += b.vx + Math.sin(mistTime * 0.7 + b.pulseOffset) * 0.08
        b.y += b.vy + Math.cos(mistTime * 0.5 + b.pulseOffset * 1.3) * 0.05
        if (b.x >  WORLD_W + b.size) b.x = -b.size
        if (b.x < -b.size)           b.x =  WORLD_W + b.size
        if (b.y >  WORLD_H + b.size) b.y = -b.size
        if (b.y < -b.size)           b.y =  WORLD_H + b.size
        b.pulseOffset += b.pulseSpeed
    }

    // Desenha em cada mistGfx de zona
    for (const zone of fogZones) {
        const gfx = (zone as any).mistGfx as PIXI.Graphics | null
        if (!gfx) continue
        gfx.clear()

        for (const b of mistBlobs) {
            const pulse = (Math.sin(b.pulseOffset) + 1) / 2
            const a     = b.alpha * (0.6 + pulse * 0.4)
            gfx.circle(b.x, b.y, b.size).fill({ color: MIST_COLOR, alpha: a })
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────────────────────
export function toggleFog(enabled: boolean) {
    fogActive        = enabled
    layerFog.visible = enabled && fogZones.length > 0
    updateFogButton(enabled)
}

export function hasPolygon()   { return fogZones.length > 0 }
export function isFogActive()  { return fogActive }
export function getFogPolygon(){ return fogPolygon }

export function setFogPolygon(path: { x: number; y: number }[]) {
    addFogPolygon(path)
}

export function addFogPolygon(path: { x: number; y: number }[]) {
    const zone: FogZone = {
        id:          `fog_${Date.now()}_${Math.random()}`,
        polygon:     path,
        erased:      [],
        fogSprite:   null,
        maskSprite:  null,
        maskTexture: null,
    }
    fogZones.push(zone)
    rebuildZone(zone)
    if (fogActive) layerFog.visible = true
}

function rebuildZone(zone: FogZone) {
    destroyZone(zone)

    zone.maskTexture = PIXI.RenderTexture.create({ width: WORLD_W, height: WORLD_H, resolution: 1 })

    const polyPoints = zone.polygon.flatMap(p => [p.x, p.y])

    const maskGfx = new PIXI.Graphics()
    maskGfx.poly(polyPoints).fill({ color: 0xffffff, alpha: 1 })
    app.renderer.render({ container: maskGfx, target: zone.maskTexture, clear: true, transform: new PIXI.Matrix() })
    maskGfx.destroy()

    if (zone.erased.length > 0) {
        const holesGfx = new PIXI.Graphics()
        zone.erased.forEach(c => holesGfx.circle(c.x, c.y, c.r).fill({ color: 0x000000, alpha: 1 }))
        app.renderer.render({ container: holesGfx, target: zone.maskTexture, clear: false, transform: new PIXI.Matrix() })
        holesGfx.destroy()
    }

    const fogGfx = new PIXI.Graphics()
    fogGfx.poly(polyPoints).fill({ color: 0x000808, alpha: 1 })   // preto com leve tom roxo
    const fogTexture = PIXI.RenderTexture.create({ width: WORLD_W, height: WORLD_H, resolution: 1 })
    app.renderer.render({ container: fogGfx, target: fogTexture, clear: true, transform: new PIXI.Matrix() })
    fogGfx.destroy()

    zone.fogSprite           = new PIXI.Sprite(fogTexture)
    zone.fogSprite.label     = `fog-sprite-${zone.id}`
    zone.fogSprite.eventMode = 'none'

    zone.maskSprite           = new PIXI.Sprite(zone.maskTexture)
    zone.maskSprite.label     = `fog-mask-${zone.id}`
    zone.maskSprite.eventMode = 'none'

    zone.fogSprite.mask = zone.maskSprite

    // mistGfx por zona: fica ACIMA do fogSprite, mascarado pelo mesmo maskSprite
    // Assim a névoa roxa só aparece dentro do polígono da fog
    const zoneMistGfx           = new PIXI.Graphics()
    zoneMistGfx.label           = `fog-mist-${zone.id}`
    zoneMistGfx.eventMode       = 'none'
    zoneMistGfx.blendMode       = 'add'
    zoneMistGfx.filters         = mistFilter ? [mistFilter] : []
    zoneMistGfx.mask            = zone.maskSprite   // confinado ao polígono
    ;(zone as any).mistGfx      = zoneMistGfx

    // Ordem: fogSprite (preto) → maskSprite → zoneMistGfx (névoa acima)
    const cursorIdx = layerFog.children.findIndex(c => c.label === 'fog-erase-cursor')
    const insertAt  = cursorIdx >= 0 ? cursorIdx : layerFog.children.length

    layerFog.addChildAt(zone.fogSprite,  insertAt)
    layerFog.addChildAt(zone.maskSprite, insertAt + 1)
    layerFog.addChildAt(zoneMistGfx,     insertAt + 2)
}

export function eraseAt(x: number, y: number, radius = ERASER_RADIUS) {
    if (!fogActive || fogZones.length === 0) return

    fogZones.forEach(zone => {
        if (!zone.maskTexture) return

        const last = zone.erased[zone.erased.length - 1]
        if (last && Math.hypot(last.x - x, last.y - y) < radius * 0.3) return

        zone.erased.push({ x, y, r: radius })

        const gfx = new PIXI.Graphics()
        gfx.circle(x, y, radius).fill({ color: 0x000000, alpha: 1 })
        app.renderer.render({
            container: gfx,
            target:    zone.maskTexture,
            clear:     false,
            transform: new PIXI.Matrix(),
        })
        gfx.destroy()
    })
}

export function drawEraserCursor(x: number, y: number, visible: boolean) {
    if (!eraseGfx) return
    eraseGfx.clear()
    if (!visible || !fogActive) return
    eraseGfx
        .circle(x, y, ERASER_RADIUS)
        .stroke({ color: 0xcc88ff, alpha: 0.9, width: 2 })   // roxo para combinar com a névoa
    eraseGfx
        .circle(x, y, ERASER_RADIUS)
        .fill({ color: 0xcc88ff, alpha: 0.06 })
}

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTÊNCIA
// ─────────────────────────────────────────────────────────────────────────────
const FOG_KEY = 'vtt_fog_state'

export function saveFog() {
    try {
        localStorage.setItem(FOG_KEY, JSON.stringify({
            active: fogActive,
            zones:  fogZones.map(z => ({ id: z.id, polygon: z.polygon, erased: z.erased }))
        }))
    } catch (e) { console.warn('[fog] Erro ao salvar:', e) }
}

export function loadFog() {
    try {
        const raw = localStorage.getItem(FOG_KEY)
        if (!raw) return
        const data = JSON.parse(raw)
        fogActive = data.active ?? false

        if (data.polygon && data.polygon.length >= 3) {
            const zone: FogZone = {
                id: 'fog_legacy', polygon: data.polygon,
                erased: data.erased || [],
                fogSprite: null, maskSprite: null, maskTexture: null
            }
            fogZones.push(zone)
            rebuildZone(zone)
        }

        if (data.zones) {
            data.zones.forEach((z: any) => {
                if (z.polygon?.length >= 3) {
                    const zone: FogZone = {
                        id: z.id, polygon: z.polygon, erased: z.erased || [],
                        fogSprite: null, maskSprite: null, maskTexture: null
                    }
                    fogZones.push(zone)
                    rebuildZone(zone)
                }
            })
        }

        layerFog.visible = fogActive && fogZones.length > 0
        updateFogButton(fogActive)
    } catch (e) { console.warn('[fog] Erro ao carregar:', e) }
}

export function clearFog() {
    fogZones.forEach(zone => destroyZone(zone))
    fogZones = []
    layerFog.visible = false
    saveFog()
}

function updateFogButton(active: boolean) {
    document.getElementById('btn-fog')?.classList.toggle('active', active)
}

function destroyZone(zone: FogZone) {
    const zoneMistGfx = (zone as any).mistGfx as PIXI.Graphics | null
    if (zoneMistGfx) { layerFog.removeChild(zoneMistGfx); zoneMistGfx.destroy(); (zone as any).mistGfx = null }
    if (zone.fogSprite)  { layerFog.removeChild(zone.fogSprite);  zone.fogSprite.destroy()  }
    if (zone.maskSprite) { layerFog.removeChild(zone.maskSprite); zone.maskSprite.destroy() }
    if (zone.maskTexture) zone.maskTexture.destroy()
    zone.fogSprite   = null
    zone.maskSprite  = null
    zone.maskTexture = null
}