// src/engine/renderer.ts
import * as PIXI from 'pixi.js'
import { layerBackground, layerGrid, viewport } from './scene'
import { backgroundDefinitions } from '../data/background' // Importe as definições aqui

export function drawBackground(type: string) {
    const config = (backgroundDefinitions as any)[type];
    
    // Se mudar para "none" ou não existir, limpa
    if (!config || type === 'none') {
        layerBackground.removeChildren();
        return;
    }

    // Só cria o sprite se a layer estiver vazia ou se o fundo mudou
    if (layerBackground.children.length === 0 || (layerBackground.children[0] as any).label !== type) {
        layerBackground.removeChildren();
        
        const texture = PIXI.Texture.from(config.path);
        const backgroundSprite = new PIXI.Sprite(texture);
        backgroundSprite.label = type;

        // Cobre o mundo
        backgroundSprite.width = 4000;
        backgroundSprite.height = 4000;

        layerBackground.addChild(backgroundSprite);
    }
}

export function drawGrid(baseSize: number, scale: number) {
    layerGrid.clear()
    layerGrid.setStrokeStyle({ width: 1, color: 0xffffff, alpha: 0.15 })

    const cellSize = baseSize * scale

    // Região do mundo atualmente visível
    const bounds = viewport.getVisibleBounds()  // retorna { x, y, width, height }

    // Primeira linha à esquerda/acima do que está visível
    const startX = Math.floor(bounds.x / cellSize) * cellSize
    const startY = Math.floor(bounds.y / cellSize) * cellSize

    // Desenha só as linhas que aparecem na tela + 1 de margem
    for (let x = startX; x <= bounds.x + bounds.width + cellSize; x += cellSize) {
        layerGrid.moveTo(x, bounds.y - cellSize)
        layerGrid.lineTo(x, bounds.y + bounds.height + cellSize)
    }
    for (let y = startY; y <= bounds.y + bounds.height + cellSize; y += cellSize) {
        layerGrid.moveTo(bounds.x - cellSize, y)
        layerGrid.lineTo(bounds.x + bounds.width + cellSize, y)
    }

    layerGrid.stroke()
}