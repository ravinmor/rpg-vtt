// src/engine/renderer.ts
import { layerGrid, viewport } from './scene'

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