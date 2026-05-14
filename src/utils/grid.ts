// src/utils/grid.ts
import { BASE_GRID_SIZE, FEET_PER_CELL } from '../data/constants'

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSÃO
// ─────────────────────────────────────────────────────────────────────────────

export function pixelsToFeet(pixels: number): number {
    return (pixels / BASE_GRID_SIZE) * FEET_PER_CELL
}

export function feetToPixels(feet: number): number {
    return (feet / FEET_PER_CELL) * BASE_GRID_SIZE
}

// Snapa uma coordenada do mundo para o centro da célula mais próxima
// Útil para posicionar tokens no grid ao soltar o drag
export function snapToGrid(x: number, y: number): { x: number; y: number } {
    return {
        x: Math.round(x / BASE_GRID_SIZE) * BASE_GRID_SIZE + BASE_GRID_SIZE / 2,
        y: Math.round(y / BASE_GRID_SIZE) * BASE_GRID_SIZE + BASE_GRID_SIZE / 2,
    }
}

// Retorna a célula (coluna, linha) em que uma coordenada do mundo está
export function worldToCell(x: number, y: number): { col: number; row: number } {
    return {
        col: Math.floor(x / BASE_GRID_SIZE),
        row: Math.floor(y / BASE_GRID_SIZE),
    }
}

// Centro em pixels de uma célula
export function cellToWorld(col: number, row: number): { x: number; y: number } {
    return {
        x: col * BASE_GRID_SIZE + BASE_GRID_SIZE / 2,
        y: row * BASE_GRID_SIZE + BASE_GRID_SIZE / 2,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// DISTÂNCIA
// ─────────────────────────────────────────────────────────────────────────────

// D&D 5e padrão — diagonal custa 1 célula (Chebyshev)
export function distanceChebyshev(
    a: { x: number; y: number },
    b: { x: number; y: number }
) {
    const dx    = Math.abs(a.x - b.x)
    const dy    = Math.abs(a.y - b.y)
    const cells = Math.max(dx, dy) / BASE_GRID_SIZE
    return { cells, feet: cells * FEET_PER_CELL }
}

// Variante DMG — diagonal alterna 5/10 pés
export function distanceDMG(
    a: { x: number; y: number },
    b: { x: number; y: number }
) {
    const dcol  = Math.abs(Math.floor(a.x / BASE_GRID_SIZE) - Math.floor(b.x / BASE_GRID_SIZE))
    const drow  = Math.abs(Math.floor(a.y / BASE_GRID_SIZE) - Math.floor(b.y / BASE_GRID_SIZE))
    const straight = Math.abs(dcol - drow)
    const diagonal = Math.min(dcol, drow)
    // Cada par de diagonais = 15 pés (5+10), ímpares = 5 pés extras
    const feet  = straight * FEET_PER_CELL + Math.floor(diagonal / 2) * 15 + (diagonal % 2) * 5
    return { cells: (straight + diagonal), feet }
}

// Euclidiana — para spells que usam distância real (sem grid)
export function distanceEuclidean(
    a: { x: number; y: number },
    b: { x: number; y: number }
) {
    const cells = Math.hypot(a.x - b.x, a.y - b.y) / BASE_GRID_SIZE
    return { cells, feet: cells * FEET_PER_CELL }
}

// ─────────────────────────────────────────────────────────────────────────────
// ALCANCE E ÁREA
// ─────────────────────────────────────────────────────────────────────────────

// Retorna true se b está dentro do alcance em pés de a
export function isInRange(
    a: { x: number; y: number },
    b: { x: number; y: number },
    rangeFeet: number
): boolean {
    return distanceChebyshev(a, b).feet <= rangeFeet
}

// Lista todos os tokens dentro do alcance de um ponto
export function getTokensInRange<T extends { x: number; y: number; id: string }>(
    origin: { x: number; y: number },
    tokens: T[],
    rangeFeet: number,
    excludeId?: string  // geralmente o próprio atacante
): T[] {
    return tokens.filter(t =>
        t.id !== excludeId &&
        isInRange(origin, t, rangeFeet)
    )
}

// Retorna os pontos que formam um cone saindo de `origin` na direção de `target`
// angleDeg = abertura do cone (ex: 53° para Burning Hands)
// lengthFeet = comprimento (ex: 15 pés)
export function getConePoints(
    origin: { x: number; y: number },
    target: { x: number; y: number },
    lengthFeet: number,
    angleDeg: number
): { x: number; y: number }[] {
    const lengthPx  = feetToPixels(lengthFeet)
    const angleRad  = (angleDeg / 2) * (Math.PI / 180)
    const direction = Math.atan2(target.y - origin.y, target.x - origin.x)

    return [
        origin,
        {
            x: origin.x + Math.cos(direction - angleRad) * lengthPx,
            y: origin.y + Math.sin(direction - angleRad) * lengthPx,
        },
        {
            x: origin.x + Math.cos(direction + angleRad) * lengthPx,
            y: origin.y + Math.sin(direction + angleRad) * lengthPx,
        },
    ]
}

// Retorna os pontos de uma linha (ex: Lightning Bolt — 100 pés, 5 pés de largura)
export function getLinePoints(
    origin: { x: number; y: number },
    target: { x: number; y: number },
    lengthFeet: number,
    widthFeet: number
): { x: number; y: number }[] {
    const lengthPx = feetToPixels(lengthFeet)
    const widthPx  = feetToPixels(widthFeet) / 2
    const angle    = Math.atan2(target.y - origin.y, target.x - origin.x)
    const perpAngle = angle + Math.PI / 2

    const tip = {
        x: origin.x + Math.cos(angle) * lengthPx,
        y: origin.y + Math.sin(angle) * lengthPx,
    }

    return [
        { x: origin.x + Math.cos(perpAngle) * widthPx, y: origin.y + Math.sin(perpAngle) * widthPx },
        { x: origin.x - Math.cos(perpAngle) * widthPx, y: origin.y - Math.sin(perpAngle) * widthPx },
        { x: tip.x    - Math.cos(perpAngle) * widthPx, y: tip.y    - Math.sin(perpAngle) * widthPx },
        { x: tip.x    + Math.cos(perpAngle) * widthPx, y: tip.y    + Math.sin(perpAngle) * widthPx },
    ]
}

// Verifica se um ponto está dentro de um polígono (ray casting)
// Útil para saber se um token foi atingido por cone ou linha
export function isPointInPolygon(
    point: { x: number; y: number },
    polygon: { x: number; y: number }[]
): boolean {
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y
        const xj = polygon[j].x, yj = polygon[j].y
        const intersect = ((yi > point.y) !== (yj > point.y)) &&
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)
        if (intersect) inside = !inside
    }
    return inside
}

// Retorna todos os tokens atingidos por uma área de efeito (cone, linha, polígono)
export function getTokensInArea<T extends { x: number; y: number }>(
    tokens: T[],
    area: { x: number; y: number }[]
): T[] {
    return tokens.filter(t => isPointInPolygon(t, area))
}