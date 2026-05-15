// src/engine/renderer.ts
import { layerGrid, viewport } from './scene'
import { state } from '../state/globalState'

export function drawGrid(baseSize: number, scale: number) {
    layerGrid.visible = state.showGrid

    if (!state.showGrid) return

    layerGrid.clear()
    layerGrid.setStrokeStyle({ width: 1, color: 0xffffff, alpha: 0.15 })

    const cellSize = baseSize * scale
    const bounds = viewport.getVisibleBounds()

    const startX = Math.floor(bounds.x / cellSize) * cellSize
    const startY = Math.floor(bounds.y / cellSize) * cellSize

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