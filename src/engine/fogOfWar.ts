// src/engine/fogOfWar.ts
import * as PIXI from 'pixi.js'
import { app, layerFog } from './scene'

interface FogZone {
    id:       string
    polygon:  { x: number; y: number }[]
    erased:   { x: number; y: number; r: number }[]
    fogSprite:  PIXI.Sprite        | null
    maskSprite: PIXI.Sprite        | null
    maskTexture: PIXI.RenderTexture | null
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
export let fogActive = false
export const ERASER_RADIUS = 60

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────
export function initFog() {
    if (initialized) return
    initialized = true

    eraseGfx           = new PIXI.Graphics()
    eraseGfx.label     = 'fog-erase-cursor'
    eraseGfx.eventMode = 'none'
    layerFog.addChild(eraseGfx)

    layerFog.visible = false
}

// ─────────────────────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────────────────────
export function toggleFog(enabled: boolean) {
    fogActive        = enabled
    layerFog.visible = enabled && fogPolygon.length >= 3
    updateFogButton(enabled)
}

export function hasPolygon() { return fogZones.length > 0 }
export function isFogActive() { return fogActive }
export function getFogPolygon() { return fogPolygon }

export function setFogPolygon(path: { x: number; y: number }[]) {
    // Mantém compatibilidade — adiciona nova zona
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
    // Destrói anterior se existir
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
    fogGfx.poly(polyPoints).fill({ color: 0x000000, alpha: 1 })
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

    const cursorIdx = layerFog.children.findIndex(c => c.label === 'fog-erase-cursor')
    if (cursorIdx >= 0) {
        layerFog.addChildAt(zone.fogSprite,  cursorIdx)
        layerFog.addChildAt(zone.maskSprite, cursorIdx)
    } else {
        layerFog.addChild(zone.fogSprite)
        layerFog.addChild(zone.maskSprite)
    }
}

export function eraseAt(x: number, y: number, radius = ERASER_RADIUS) {
    if (!fogActive || fogZones.length === 0) return

    // Apaga em todas as zonas que contêm o ponto
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
        .stroke({ color: 0xffffff, alpha: 0.8, width: 2 })
    eraseGfx
        .circle(x, y, ERASER_RADIUS)
        .fill({ color: 0xffffff, alpha: 0.06 })
}

// ─────────────────────────────────────────────────────────────────────────────
// REBUILD — reconstrói fog + máscara do zero
// ─────────────────────────────────────────────────────────────────────────────
function rebuild() {
    // Remove sprites antigos
    if (fogSprite)  { layerFog.removeChild(fogSprite);  fogSprite.destroy()  }
    if (maskSprite) { layerFog.removeChild(maskSprite); maskSprite.destroy() }
    if (maskTexture) maskTexture.destroy()

    // 1. Cria a maskTexture — branca onde a fog deve aparecer
    maskTexture = PIXI.RenderTexture.create({
        width:      WORLD_W,
        height:     WORLD_H,
        resolution: 1,
    })

    // Pinta o polígono de BRANCO na máscara (fog visível dentro do polígono)
    const maskGfx = new PIXI.Graphics()
    const polyPoints = fogPolygon.flatMap(p => [p.x, p.y])
    maskGfx.poly(polyPoints).fill({ color: 0xffffff, alpha: 1 })

    app.renderer.render({
        container: maskGfx,
        target:    maskTexture,
        clear:     true,         // começa transparente fora do polígono
        transform: new PIXI.Matrix(),
    })
    maskGfx.destroy()

    // Reaplica furos salvos (círculos PRETOS)
    if (erasedCircles.length > 0) {
        const holesGfx = new PIXI.Graphics()
        erasedCircles.forEach(c => {
            holesGfx.circle(c.x, c.y, c.r).fill({ color: 0x000000, alpha: 1 })
        })
        app.renderer.render({
            container: holesGfx,
            target:    maskTexture,
            clear:     false,
            transform: new PIXI.Matrix(),
        })
        holesGfx.destroy()
    }

    // 2. Cria o sprite preto da fog (o que o jogador vê como névoa)
    const fogGfx = new PIXI.Graphics()
    fogGfx.poly(polyPoints).fill({ color: 0x000000, alpha: 1 })

    const fogTexture = PIXI.RenderTexture.create({
        width:      WORLD_W,
        height:     WORLD_H,
        resolution: 1,
    })
    app.renderer.render({
        container: fogGfx,
        target:    fogTexture,
        clear:     true,
        transform: new PIXI.Matrix(),
    })
    fogGfx.destroy()

    fogSprite           = new PIXI.Sprite(fogTexture)
    fogSprite.label     = 'fog-sprite'
    fogSprite.eventMode = 'none'
    fogSprite.x         = 0
    fogSprite.y         = 0

    // 3. Cria o sprite da máscara e aplica no fogSprite
    maskSprite           = new PIXI.Sprite(maskTexture)
    maskSprite.label     = 'fog-mask-sprite'
    maskSprite.eventMode = 'none'
    maskSprite.x         = 0
    maskSprite.y         = 0

    // A máscara controla onde o fogSprite aparece
    // Branco na máscara = fog visível, preto = fog transparente (revelado)
    fogSprite.mask = maskSprite

    // Insere antes do cursor
    const cursorIdx = layerFog.children.findIndex(c => c.label === 'fog-erase-cursor')
    if (cursorIdx >= 0) {
        layerFog.addChildAt(fogSprite,  cursorIdx)
        layerFog.addChildAt(maskSprite, cursorIdx)
    } else {
        layerFog.addChild(fogSprite)
        layerFog.addChild(maskSprite)
    }
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

        // Suporte ao formato antigo (polygon único)
        if (data.polygon && data.polygon.length >= 3) {
            const zone: FogZone = {
                id: `fog_legacy`, polygon: data.polygon,
                erased: data.erased || [],
                fogSprite: null, maskSprite: null, maskTexture: null
            }
            fogZones.push(zone)
            rebuildZone(zone)
        }

        // Formato novo (múltiplas zonas)
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
    if (zone.fogSprite)  { layerFog.removeChild(zone.fogSprite);  zone.fogSprite.destroy()  }
    if (zone.maskSprite) { layerFog.removeChild(zone.maskSprite); zone.maskSprite.destroy() }
    if (zone.maskTexture) zone.maskTexture.destroy()
}