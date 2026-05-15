// src/utils/images.ts
import * as PIXI from 'pixi.js'
import { statusDefinitions } from '../data/constants'

export function createImage(src: string): HTMLImageElement {
    const img = new Image()
    img.src = src
    return img
}

// Mapa global de texturas de status — preenchido assincronamente
export const statusTextures: Record<string, PIXI.Texture> = {}

export async function loadStatusIcons(): Promise<void> {
    await Promise.all(
        statusDefinitions.map(async status => {
            try {
                const tex = await PIXI.Assets.load(`/icons/${status.key}.png`)
                statusTextures[status.key] = tex
            } catch {
                console.warn(`[status icon] Não encontrado: /icons/${status.key}.png`)
            }
        })
    )
}