// src/engine/effectDrawer.ts
import * as PIXI from 'pixi.js'
import { layerEffects } from './scene'

interface ZoneEntry {
    container: PIXI.Container
    maskGfx:   PIXI.Graphics
}

const zoneMap    = new Map<string, ZoneEntry>()
const assetCache = new Map<string, PIXI.Texture>()

export function syncEffects(activeZones: any[], editingZone: any) {
    const activeIds = new Set(activeZones.map((z: any) => z.id))

    for (const [id, entry] of zoneMap) {
        if (!activeIds.has(id)) {
            layerEffects.removeChild(entry.container)
            layerEffects.removeChild(entry.maskGfx)
            entry.container.destroy({ children: true })
            entry.maskGfx.destroy()
            zoneMap.delete(id)
        }
    }

    activeZones.forEach((zone: any) => {
        if (!zone.id) zone.id = `zone_${Date.now()}_${Math.random()}`

        let entry = zoneMap.get(zone.id)

        const newAssetUrl = zone.videoPath || zone.imagePath || null
        if (entry && (entry.container as any).__assetUrl !== newAssetUrl) {
            if (zone.type !== 'text') {
                layerEffects.removeChild(entry.container)
                layerEffects.removeChild(entry.maskGfx)
                entry.container.destroy({ children: true })
                entry.maskGfx.destroy()
                zoneMap.delete(zone.id)
                entry = undefined as any
            }
        }

        if (!entry) {
            entry = createZoneEntry(zone)
            zoneMap.set(zone.id, entry)
        }

        updateZone(entry, zone, editingZone === zone)
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// CRIAÇÃO
// ─────────────────────────────────────────────────────────────────────────────
function createZoneEntry(zone: any): ZoneEntry {
    const maskGfx = new PIXI.Graphics()
    maskGfx.label = `mask_${zone.id}`
    layerEffects.addChild(maskGfx)

    const container = new PIXI.Container()
    container.label = zone.id
    container.mask  = maskGfx
    layerEffects.addChild(container)

    if (zone.type === 'text') {
        container.mask = null
        const fallback = new PIXI.Graphics()
        fallback.label = 'fallback'
        container.addChild(fallback)
        const border = new PIXI.Graphics()
        border.label = 'border'
        container.addChild(border)
        ;(container as any).__assetUrl = null
        return { container, maskGfx }
    }

    const assetUrl: string | null = zone.videoPath || zone.imagePath || null
    ;(container as any).__assetUrl = assetUrl

    if (assetUrl) {
        const sprite = new PIXI.Sprite(PIXI.Texture.EMPTY)
        sprite.label  = 'content'
        sprite.anchor.set(0.5)
        sprite.visible = false
        container.addChild(sprite)

        loadAsset(assetUrl, sprite)
    }

    const fallback = new PIXI.Graphics()
    fallback.label = 'fallback'
    container.addChild(fallback)

    const border = new PIXI.Graphics()
    border.label = 'border'
    container.addChild(border)

    return { container, maskGfx }
}

function loadAsset(url: string, sprite: PIXI.Sprite) {
    if (assetCache.has(url)) {
        applyTexture(sprite, assetCache.get(url)!, url)
        return
    }
    PIXI.Assets.load(url)
        .then((tex: PIXI.Texture) => {
            assetCache.set(url, tex)
            applyTexture(sprite, tex, url)
        })
        .catch(() => console.warn('[effectDrawer] Falha ao carregar:', url))
}

function applyTexture(sprite: PIXI.Sprite, tex: PIXI.Texture, url: string) {
    sprite.texture = tex
    sprite.visible = true

    const src   = tex.source as any
    const video = src?.resource instanceof HTMLVideoElement
        ? src.resource as HTMLVideoElement
        : null

    if (video) {
        video.muted = true
        video.loop  = true
        video.play().catch(() => {})

        // Vídeos de magia têm fundo preto — 'screen' faz o preto desaparecer,
        // mantendo apenas as cores claras do efeito (chamas, névoa, etc.)
        sprite.blendMode = 'screen'
    } else {
        // Texturas de imagem (pedra, grama, madeira) usam blend normal
        sprite.blendMode = 'normal'
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// ATUALIZAÇÃO (todo frame)
// ─────────────────────────────────────────────────────────────────────────────
function updateZone(entry: ZoneEntry, zone: any, isEditing: boolean) {
    const { container, maskGfx } = entry

    const sprite   = container.getChildByLabel('content')  as PIXI.Sprite   | null
    const fallback = container.getChildByLabel('fallback') as PIXI.Graphics
    const border   = container.getChildByLabel('border')   as PIXI.Graphics

    maskGfx.clear()
    fallback.clear()
    border.clear()

    // ── Texto ──────────────────────────────────────────────────────────────
    if (zone.type === 'text') {
        container.mask = null

        let textObj = container.getChildByLabel('pixi-text') as PIXI.Text | null

        if (!textObj) {
            textObj = new PIXI.Text({
                text: zone.text || '',
                style: {
                    fontFamily: zone.fontFamily || "'Cinzel', serif",
                    fontSize:   zone.fontSize   || 24,
                    fill:       0xf0b030,
                    stroke:     { color: 0x000000, width: 4 },
                    dropShadow: {
                        color:    0x000000,
                        blur:     4,
                        distance: 2,
                        alpha:    0.8,
                    },
                }
            })
            textObj.label = 'pixi-text'
            textObj.anchor.set(0.5)
            container.addChild(textObj)
        }

        textObj.text           = zone.text || ''
        textObj.x              = zone.x    || 0
        textObj.y              = zone.y    || 0
        textObj.rotation       = zone.rotation || 0
        textObj.style.fontSize = zone.fontSize || 24
        container.x = 0
        container.y = 0
        return
    }

    // ── spell_object ───────────────────────────────────────────────────────
    if (zone.type === 'spell_object') {
        const cx = zone.x ?? 0
        const cy = zone.y ?? 0
        const r  = zone.radius ?? 80

        maskGfx.circle(cx, cy, r).fill({ color: 0xffffff })
        container.x = 0
        container.y = 0

        if (sprite && sprite.visible) {
            sprite.x     = cx
            sprite.y     = cy
            const side   = r * 2
            const texW   = sprite.texture.width
            const texH   = sprite.texture.height
            sprite.scale.set(side / Math.max(texW, texH))
            sprite.alpha = zone.opacity ?? 0.8
            if (zone.rotateSpeed) sprite.rotation += zone.rotateSpeed
        } else {
            const col = colorToNumber(zone.color) ?? 0x8855ff
            fallback.circle(cx, cy, r).fill({ color: col, alpha: zone.opacity ?? 0.6 })
        }

        if (isEditing) {
            border.circle(cx, cy, r + 4).stroke({ color: 0xffffff, alpha: 0.9, width: 2 })
        }
        return
    }

    // ── Zonas com path (brush / shapes) ───────────────────────────────────
    if (!zone.path || zone.path.length < 2) return

    container.x = 0
    container.y = 0

    const bb = getBoundingBox(zone.path)

    applyPath(maskGfx, zone.path)
    maskGfx.fill({ color: 0xffffff })

    if (sprite && sprite.visible) {
        sprite.x      = bb.minX + bb.width  / 2
        sprite.y      = bb.minY + bb.height / 2
        sprite.width  = bb.width
        sprite.height = bb.height
        sprite.alpha  = zone.opacity ?? 0.85
    } else {
        applyPath(fallback, zone.path)
        const col   = colorToNumber(zone.color) ?? 0xff6600
        const alpha = opacityFromRgba(zone.color) ?? zone.opacity ?? 0.5
        fallback.fill({ color: col, alpha })
    }

    if (isEditing) {
        applyPath(border, zone.path)
        border.stroke({ color: 0xffffff, alpha: 0.9, width: 2 })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function applyPath(gfx: PIXI.Graphics, path: {x:number,y:number}[]) {
    if (!path || path.length < 2) return
    gfx.moveTo(path[0].x, path[0].y)
    for (let i = 1; i < path.length; i++) gfx.lineTo(path[i].x, path[i].y)
    gfx.closePath()
}

function getBoundingBox(path: {x:number,y:number}[]) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    path.forEach(p => {
        if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x
        if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y
    })
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY }
}

function colorToNumber(color: any): number | null {
    if (color == null) return null
    if (typeof color === 'number') return color
    if (typeof color === 'string') {
        const rgba = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (rgba) return (parseInt(rgba[1]) << 16) | (parseInt(rgba[2]) << 8) | parseInt(rgba[3])
        const hex = color.replace('#', '')
        const exp = hex.length === 3 ? hex.split('').map((c:string) => c+c).join('') : hex
        const num = parseInt(exp, 16)
        return isNaN(num) ? null : num
    }
    return null
}

function opacityFromRgba(color: any): number | null {
    if (typeof color !== 'string') return null
    const m = color.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/)
    return m ? parseFloat(m[1]) : null
}