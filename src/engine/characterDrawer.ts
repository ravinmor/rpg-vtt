// src/engine/characterDrawer.ts
import * as PIXI from 'pixi.js'
import { layerTokens } from './scene'
import { TOKEN_SIZE } from '../data/constants'
import { statusTextures } from '../utils/images'

const tokenMap     = new Map<string, PIXI.Container>()
const textureCache = new Map<string, PIXI.Texture>()
const loadingUrls  = new Set<string>()

export function syncTokens(characters: any[], tokenScale: number, selectedId: string | null, pulse: number = 0) {
    const activeIds = new Set(characters.map(c => c.id))

    for (const [id, container] of tokenMap) {
        if (!activeIds.has(id)) {
            layerTokens.removeChild(container)
            container.destroy({ children: true })
            tokenMap.delete(id)
        }
    }

    characters.forEach(char => {
        if (!tokenMap.has(char.id)) {
            tokenMap.set(char.id, createToken(char))
        }
        updateToken(tokenMap.get(char.id)!, char, tokenScale, selectedId, pulse)
    })
}

// ─────────────────────────────────────────────
// CRIAÇÃO
// ─────────────────────────────────────────────
function createToken(char: any): PIXI.Container {
    const container = new PIXI.Container()
    container.label = char.id

    const circle = new PIXI.Graphics()
    circle.label = 'body'
    container.addChild(circle)

    const imgSprite = new PIXI.Sprite(PIXI.Texture.EMPTY)
    imgSprite.label   = 'avatar'
    imgSprite.anchor.set(0.5)
    imgSprite.visible = false
    container.addChild(imgSprite)

    const avatarMask = new PIXI.Graphics()
    avatarMask.label = 'avatarMask'
    container.addChild(avatarMask)

    const ring = new PIXI.Graphics()
    ring.label = 'ring'
    container.addChild(ring)

    const nameText = new PIXI.Text({
        text: char.name,
        style: {
            fontFamily: 'Cinzel, serif',
            fontSize: 14,
            fill: 0xffffff,
            stroke: { color: 0x000000, width: 4 },
        }
    })
    nameText.label = 'name'
    nameText.anchor.set(0.5, 1)
    container.addChild(nameText)

    // ← ISSO ESTAVA FALTANDO
    const statusContainer = new PIXI.Container()
    statusContainer.label = 'statuses'
    container.addChild(statusContainer)

    container.eventMode = 'static'
    container.cursor    = 'pointer'

    layerTokens.addChild(container)
    return container
}

// ─────────────────────────────────────────────
// ATUALIZAÇÃO
// ─────────────────────────────────────────────
function updateToken(
    container: PIXI.Container,
    char: any,
    tokenScale: number,
    selectedId: string | null,
    pulse: number = 0
) {
    const baseRadius = TOKEN_SIZE[char.size] || char.radius || TOKEN_SIZE.medium
    const r          = baseRadius * tokenScale
    const hpRatio    = char.maxHp > 0 ? Math.max(0, char.hp) / char.maxHp : 0
    const ringColor  = hpRatio > 0.6 ? 0x4bdc7b : hpRatio > 0.3 ? 0xe6c84f : 0xd94b4b
    const baseColor  = colorToNumber(char.color)
    const isSelected = selectedId === char.id
    const isTurn     = !!char.isTurn

    container.x = char.x
    container.y = char.y

    // Corpo
    const circle = container.getChildByLabel('body') as PIXI.Graphics
    if (circle) {
        circle.clear()

        if (isTurn) {
            const glowAlpha = 0.25 + Math.sin(pulse) * 0.1
            circle.circle(0, 0, r + 40).fill({ color: 0xffd700, alpha: glowAlpha * 0.15 })
            circle.circle(0, 0, r + 32).fill({ color: 0xffd700, alpha: glowAlpha * 0.25 })
            circle.circle(0, 0, r + 24).fill({ color: 0xffd700, alpha: glowAlpha * 0.40 })
            circle.circle(0, 0, r + 16).fill({ color: 0xffd700, alpha: glowAlpha * 0.55 })
            circle.circle(0, 0, r + 10).fill({ color: 0xffd700, alpha: glowAlpha * 0.70 })
            circle.circle(0, 0, r + 5).fill({ color: 0xffd700, alpha: glowAlpha * 0.85 })
            circle.circle(0, 0, r + 2).stroke({ color: 0xffd700, width: 2, alpha: 1 })
        }

        circle.circle(0, 0, r).fill({ color: baseColor })

        if (isSelected) {
            circle.circle(0, 0, r + 3).stroke({ color: 0xffd700, width: 3 })
        } else if (!isTurn) {
            circle.circle(0, 0, r).stroke({ color: 0x000000, width: 2 })
        }
    }

    // Avatar
    const imgUrl     = char.visuals?.token_img || char.avatar || ''
    const imgSprite  = container.getChildByLabel('avatar')     as PIXI.Sprite
    const avatarMask = container.getChildByLabel('avatarMask') as PIXI.Graphics

    if (imgUrl && imgSprite) {
        applyTokenImage(imgSprite, avatarMask, imgUrl, r)
    } else if (imgSprite) {
        imgSprite.visible  = false
        avatarMask.visible = false
    }

    // Anel de HP
    const ring = container.getChildByLabel('ring') as PIXI.Graphics
    if (ring) {
        ring.clear()
        const ringR = r + 6
        ring.arc(0, 0, ringR, -Math.PI / 2, Math.PI * 1.5)
        ring.stroke({ color: 0x333333, width: 4 })
        if (hpRatio > 0) {
            ring.arc(0, 0, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * hpRatio)
            ring.stroke({ color: ringColor, width: 4 })
        }
    }

    // Nome
    const nameText = container.getChildByLabel('name') as PIXI.Text
    if (nameText) {
        nameText.text       = char.name
        nameText.y          = -(r + 14)
        nameText.style.fill = 0xffffff
    }

    // Ícones de status
    const statusContainer = container.children.find(
        (c: any) => c.label === 'statuses'
    ) as PIXI.Container

    if (statusContainer) {
        statusContainer.removeChildren()

        const statuses: string[] = char.statuses || []
        if (statuses.length > 0) {
            const iconSize = 18
            const spacing  = iconSize + 3
            const totalW   = statuses.length * spacing - 3
            const startX   = -totalW / 2 + iconSize / 2
            const iconY    = r + iconSize / 2 + 16

            statuses.forEach((key: string, i: number) => {
                const x   = startX + i * spacing
                const tex = statusTextures[key]

                if (tex) {
                    const sprite = new PIXI.Sprite(tex)
                    sprite.anchor.set(0.5)
                    sprite.width  = iconSize
                    sprite.height = iconSize
                    sprite.x = x
                    sprite.y = iconY
                    statusContainer.addChild(sprite)
                } else {
                    const dot = new PIXI.Graphics()
                    dot.circle(0, 0, iconSize / 2).fill({ color: 0xcc3333 })
                    dot.x = x
                    dot.y = iconY
                    statusContainer.addChild(dot)
                }
            })
        }
    }

    container.alpha = isSelected ? 1 : 0.85
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function applyTokenImage(
    sprite: PIXI.Sprite,
    maskGfx: PIXI.Graphics,
    url: string,
    r: number
) {
    maskGfx.clear()
    maskGfx.circle(0, 0, r).fill({ color: 0xffffff })
    maskGfx.visible = true
    sprite.mask     = maskGfx

    const cached = textureCache.get(url)

    if (cached !== undefined) {
        if (cached === PIXI.Texture.EMPTY) {
            sprite.visible  = false
            maskGfx.visible = false
            return
        }
        sprite.texture = cached
        sprite.width   = r * 2
        sprite.height  = r * 2
        sprite.visible = true
        return
    }

    if (loadingUrls.has(url)) return

    loadingUrls.add(url)

    PIXI.Assets.load(url)
        .then((tex: PIXI.Texture) => {
            textureCache.set(url, tex)
            loadingUrls.delete(url)
            sprite.texture = tex
            sprite.width   = r * 2
            sprite.height  = r * 2
            sprite.visible = true
        })
        .catch(() => {
            console.warn('[token] Imagem bloqueada (CORS ou URL inválida):', url)
            textureCache.set(url, PIXI.Texture.EMPTY)
            loadingUrls.delete(url)
            sprite.visible  = false
            maskGfx.visible = false
        })
}

function colorToNumber(color: any): number {
    if (typeof color === 'number') return color
    if (typeof color === 'string') {
        const num = parseInt(color.replace('#', ''), 16)
        return isNaN(num) ? 0xcccccc : num
    }
    return 0xcccccc
}