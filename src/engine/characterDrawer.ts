// src/engine/characterDrawer.ts
import * as PIXI from 'pixi.js'
import { layerTokens } from './scene'

const tokenMap = new Map<string, PIXI.Container>()

// Cache de texturas para não recarregar a cada frame
const textureCache = new Map<string, PIXI.Texture>()

export function syncTokens(characters: any[], tokenScale: number, selectedId: string | null) {
    const activeIds = new Set(characters.map(c => c.id))

    // Remove tokens que saíram do array
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
        updateToken(tokenMap.get(char.id)!, char, tokenScale, selectedId)
    })
}

// ─────────────────────────────────────────────
// CRIAÇÃO
// ─────────────────────────────────────────────
function createToken(char: any): PIXI.Container {
    const container = new PIXI.Container()
    container.label = char.id

    // 1. Corpo (círculo colorido ou imagem)
    const circle = new PIXI.Graphics()
    circle.label = 'body'
    container.addChild(circle)

    // 2. Sprite de imagem (token_img) — começa invisível
    const imgSprite = new PIXI.Sprite(PIXI.Texture.EMPTY)
    imgSprite.label  = 'avatar'
    imgSprite.anchor.set(0.5)
    imgSprite.visible = false
    container.addChild(imgSprite)

    // Máscara circular para o avatar
    const avatarMask = new PIXI.Graphics()
    avatarMask.label = 'avatarMask'
    container.addChild(avatarMask)

    // 3. Anel de HP
    const ring = new PIXI.Graphics()
    ring.label = 'ring'
    container.addChild(ring)

    // 4. Nome
    const nameText = new PIXI.Text({
        text: char.name,
        style: {
            fontFamily: 'Cinzel, serif',
            fontSize: 14,
            fill: 0xffffff,
            stroke: { color: 0x000000, width: 4 },
        }
    })
    nameText.label  = 'name'
    nameText.anchor.set(0.5, 1)
    container.addChild(nameText)

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
    selectedId: string | null
) {
    const r        = char.radius * tokenScale
    const hpRatio  = char.maxHp > 0 ? Math.max(0, char.hp) / char.maxHp : 0
    const ringColor = hpRatio > 0.6 ? 0x4bdc7b : hpRatio > 0.3 ? 0xe6c84f : 0xd94b4b
    const baseColor = colorToNumber(char.color)
    const isSelected = selectedId === char.id

    container.x = char.x
    container.y = char.y

    // ── Corpo ──
    const circle = container.getChildByLabel('body') as PIXI.Graphics
    if (circle) {
        circle.clear()
        circle.circle(0, 0, r).fill({ color: baseColor })
        if (isSelected) {
            circle.circle(0, 0, r + 3).stroke({ color: 0xffd700, width: 3 })
        } else {
            circle.circle(0, 0, r).stroke({ color: 0x000000, width: 2 })
        }
    }

    // ── Avatar (token_img) ──
    const imgUrl   = char.visuals?.token_img || char.avatar || ''
    const imgSprite = container.getChildByLabel('avatar') as PIXI.Sprite
    const avatarMask = container.getChildByLabel('avatarMask') as PIXI.Graphics

    if (imgUrl && imgSprite) {
        applyTokenImage(imgSprite, avatarMask, imgUrl, r)
    } else if (imgSprite) {
        imgSprite.visible    = false
        avatarMask.visible   = false
    }

    // ── Anel de HP ──
    const ring = container.getChildByLabel('ring') as PIXI.Graphics
    if (ring) {
        ring.clear()
        const ringR = r + 6
        // Fundo do anel (arco completo)
        ring.arc(0, 0, ringR, -Math.PI / 2, Math.PI * 1.5)
        ring.stroke({ color: 0x333333, width: 4 })

        // HP atual
        if (hpRatio > 0) {
            const endAngle = -Math.PI / 2 + Math.PI * 2 * hpRatio
            ring.arc(0, 0, ringR, -Math.PI / 2, endAngle)
            ring.stroke({ color: ringColor, width: 4 })
        }
    }

    // ── Nome ──
    const nameText = container.getChildByLabel('name') as PIXI.Text
    if (nameText) {
        nameText.text  = char.name
        nameText.y     = -(r + 14)
        // Garantia: fill precisa ser number no Pixi v8
        nameText.style.fill = 0xffffff
    }

    container.alpha = isSelected ? 1 : 0.85
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Carrega (ou usa o cache) de uma URL de imagem e aplica ao sprite
 * com máscara circular de raio r.
 */
function applyTokenImage(
    sprite: PIXI.Sprite,
    maskGfx: PIXI.Graphics,
    url: string,
    r: number
) {
    // Atualiza a máscara sempre (raio pode mudar)
    maskGfx.clear()
    maskGfx.circle(0, 0, r).fill({ color: 0xffffff })
    maskGfx.visible = true
    sprite.mask     = maskGfx

    // Se já temos a textura no cache, aplica direto
    if (textureCache.has(url)) {
        const tex = textureCache.get(url)!
        sprite.texture  = tex
        sprite.width    = r * 2
        sprite.height   = r * 2
        sprite.visible  = true
        return
    }

    // Carrega de forma assíncrona
    PIXI.Assets.load(url)
        .then((tex: PIXI.Texture) => {
            textureCache.set(url, tex)
            sprite.texture = tex
            sprite.width   = r * 2
            sprite.height  = r * 2
            sprite.visible = true
        })
        .catch(() => {
            // URL inválida — mostra só o círculo colorido
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