// src/engine/dayNight.ts
// Sistema de iluminação — aplica filtro de cor apenas sobre o viewport
// (mapa + tokens + efeitos), sem afetar o painel lateral HTML.
//
// Estados:
//   day        → sem filtro (iluminação neutra)
//   dusk       → overlay laranja/âmbar quente (crepúsculo)
//   night      → overlay azul escuro (noite)

import * as PIXI from 'pixi.js'
import { viewport } from './scene'

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS E CONFIGURAÇÃO DE CADA ESTADO
// ─────────────────────────────────────────────────────────────────────────────

export type DayPhase = 'day' | 'dusk' | 'night'

interface PhaseConfig {
    // ColorMatrixFilter multiplica cada canal RGBA.
    // Formato: [R, G, B, A, offset] × 4 linhas (uma por canal de saída)
    // Usamos apenas o diagonal principal + offsets para simplicidade.
    matrix:    PIXI.ColorMatrixFilter['matrix'] | null
    // Overlay adicional: cor sólida semitransparente sobre o viewport
    overlayColor:  number
    overlayAlpha:  number
    label:     string
}

const PHASES: Record<DayPhase, PhaseConfig> = {
    day: {
        matrix:       null,   // sem filtro — performance máxima
        overlayColor: 0x000000,
        overlayAlpha: 0,
        label:        'Dia',
    },
    dusk: {
        // Aumenta vermelho/verde levemente, reduz azul — tom âmbar/laranja
        matrix: [
            1.15,  0.05,  0,     0,  0.02,   // R: mais vermelho
            0.05,  1.0,   0,     0,  0.01,   // G: verde neutro
            0,     0,     0.55,  0,  0,      // B: azul reduzido
            0,     0,     0,     1,  0,      // A: sem mudança
        ] as any,
        overlayColor: 0xff6a00,
        overlayAlpha: 0.08,
        label:        'Crepúsculo',
    },
    night: {
        matrix: [
            0.80,  0,     0.10,  0,  0,
            0,     0.82,  0.12,  0,  0,
            0.10,  0.12,  1.0,   0,  0,
            0,     0,     0,     1,  0,
        ] as any,
        overlayColor: 0x001030,
        overlayAlpha: 0.42,
        label: 'Noite',
    },
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTADO INTERNO
// ─────────────────────────────────────────────────────────────────────────────
let currentPhase: DayPhase    = 'day'
let colorFilter:  PIXI.ColorMatrixFilter | null = null
let overlayGfx:   PIXI.Graphics | null          = null

// Controle de transição
let transitioning   = false
let transitionFrom: DayPhase = 'day'
let transitionTo:   DayPhase = 'day'
let transitionT     = 0          // 0 → 1
const TRANSITION_SPEED = 0.025  // ~40 frames para completar (~0.67s a 60fps)

// ─────────────────────────────────────────────────────────────────────────────
// INICIALIZAÇÃO
// ─────────────────────────────────────────────────────────────────────────────
export function initDayNight() {
    // ColorMatrixFilter aplicado ao viewport inteiro
    colorFilter = new PIXI.ColorMatrixFilter()
    colorFilter.enabled = false
    viewport.filters = viewport.filters
        ? [...(viewport.filters as any[]), colorFilter]
        : [colorFilter]

    // Overlay semitransparente que fica na frente de tudo no viewport
    overlayGfx = new PIXI.Graphics()
    overlayGfx.label   = 'day-night-overlay'
    overlayGfx.zIndex  = 99999
    overlayGfx.visible = false
    overlayGfx.eventMode = 'none'
    viewport.addChild(overlayGfx)

    // Garante que a fase inicial (dia) esteja aplicada sem animação
    applyPhaseImmediate('day')
}

// ─────────────────────────────────────────────────────────────────────────────
// API PÚBLICA
// ─────────────────────────────────────────────────────────────────────────────
export function setDayPhase(phase: DayPhase) {
    if (phase === currentPhase && !transitioning) return

    transitionFrom = currentPhase
    transitionTo   = phase
    transitionT    = 0
    transitioning  = true
    currentPhase   = phase

    updateTabButtons(phase)
}

export function getCurrentPhase(): DayPhase {
    return currentPhase
}

// Chamado pelo ticker em main.ts — atualiza a transição frame a frame
export function tickDayNight() {
    if (!transitioning) return

    transitionT = Math.min(1, transitionT + TRANSITION_SPEED)
    applyBlend(transitionFrom, transitionTo, easeInOut(transitionT))

    if (transitionT >= 1) {
        transitioning = false
        applyPhaseImmediate(transitionTo)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// APLICAÇÃO IMEDIATA (sem interpolação)
// ─────────────────────────────────────────────────────────────────────────────
function applyPhaseImmediate(phase: DayPhase) {
    const config = PHASES[phase]

    if (!colorFilter || !overlayGfx) return

    if (config.matrix === null) {
        colorFilter.enabled = false
    } else {
        colorFilter.enabled = true
        colorFilter.matrix  = config.matrix
    }

    if (config.overlayAlpha === 0) {
        overlayGfx.visible = false
    } else {
        overlayGfx.visible = true
        drawOverlay(config.overlayColor, config.overlayAlpha)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERPOLAÇÃO ENTRE DUAS FASES
// ─────────────────────────────────────────────────────────────────────────────
function applyBlend(from: DayPhase, to: DayPhase, t: number) {
    if (!colorFilter || !overlayGfx) return

    const cfgA = PHASES[from]
    const cfgB = PHASES[to]

    // Interpola a matrix
    const matA = cfgA.matrix ?? identityMatrix()
    const matB = cfgB.matrix ?? identityMatrix()
    const blended = matA.map((v: number, i: number) => lerp(v, (matB as any)[i], t)) as any

    colorFilter.enabled = true
    colorFilter.matrix  = blended

    // Interpola o alpha do overlay
    const alphaA = cfgA.overlayAlpha
    const alphaB = cfgB.overlayAlpha
    const alpha  = lerp(alphaA, alphaB, t)

    // Cor do overlay: usa a cor de destino quando t > 0.5, origem antes
    const color = t >= 0.5 ? cfgB.overlayColor : cfgA.overlayColor

    if (alpha <= 0.005) {
        overlayGfx.visible = false
    } else {
        overlayGfx.visible = true
        drawOverlay(color, alpha)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERLAY — retângulo que cobre todo o viewport no espaço do mundo
// ─────────────────────────────────────────────────────────────────────────────
function drawOverlay(color: number, alpha: number) {
    if (!overlayGfx) return
    overlayGfx.clear()

    // Cobre uma área grande no espaço do mundo para garantir que
    // mesmo com zoom/pan o overlay preencha tudo
    const SIZE = 20000
    overlayGfx
        .rect(-SIZE / 2, -SIZE / 2, SIZE, SIZE)
        .fill({ color, alpha })
}

// ─────────────────────────────────────────────────────────────────────────────
// ATUALIZA BOTÕES DO PAINEL (feedback visual)
// ─────────────────────────────────────────────────────────────────────────────
function updateTabButtons(phase: DayPhase) {
    const ids: Record<DayPhase, string> = {
        day:   'btn-phase-day',
        dusk:  'btn-phase-dusk',
        night: 'btn-phase-night',
    }
    Object.entries(ids).forEach(([p, id]) => {
        document.getElementById(id)?.classList.toggle('active', p === phase)
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
}

function easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function identityMatrix(): number[] {
    return [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0,
    ]
}