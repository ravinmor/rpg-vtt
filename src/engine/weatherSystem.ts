// src/engine/weatherSystem.ts
// Sistema de clima com partículas sobre o mapa.
// A layer de partículas fica no app.stage (fixo na tela),
// não no viewport — assim não sofre pan/zoom.

import * as PIXI from 'pixi.js'
import { app } from './scene'

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────
export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog'

interface Particle {
    x:      number
    y:      number
    vx:     number   // velocidade horizontal
    vy:     number   // velocidade vertical
    alpha:  number
    size:   number
    life:   number   // 0-1, para fade
}

interface WeatherConfig {
    label:         string
    count:         number        // quantidade de partículas
    speed:         number        // velocidade base vertical
    wind:          number        // desvio horizontal
    size:          [number, number]  // [min, max]
    alpha:         [number, number]  // [min, max]
    color:         number
    type:          'drop' | 'flake' | 'fog' | 'none'
    // Para névoa: overlay adicional
    fogAlpha?:     number
    fogColor?:     number
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURAÇÃO DE CADA ESTADO
// ─────────────────────────────────────────────────────────────────────────────
const WEATHER_CONFIGS: Record<WeatherType, WeatherConfig> = {
    clear: {
        label: 'Limpo',
        count: 0,
        speed: 0, wind: 0,
        size: [0, 0], alpha: [0, 0],
        color: 0xffffff,
        type: 'none',
    },
    cloudy: {
        label: 'Nublado',
        count: 0,
        speed: 0, wind: 0,
        size: [0, 0], alpha: [0, 0],
        color: 0x5e5eb5,
        type: 'none',
        // Só escurece levemente via overlay
        fogAlpha: 0.40,
        fogColor: 0x303030,
    },
    rain: {
        label: 'Chuva',
        count: 300,
        speed: 14,
        wind: 2,
        size: [1, 2],
        alpha: [0.35, 0.65],
        color: 0x8ab4cc,
        type: 'drop',
    },
    storm: {
        label: 'Tempestade',
        count: 800,
        speed: 26,
        wind: -12,
        size: [1, 2.5],
        alpha: [0.5, 0.85],
        color: 0x6a9ab8,
        type: 'drop',
        fogAlpha: 0.18,
        fogColor: 0x101820,
    },
    snow: {
        label: 'Neve',
        count: 250,
        speed: 2.5,
        wind: 0.8,
        size: [2, 5],
        alpha: [0.5, 0.9],
        color: 0xddeeff,
        type: 'flake',
    },
    fog: {
        label: 'Névoa',
        count: 40,             // 40 nuvens gigantes são suficientes para cobrir a tela sem dar lag
        speed: 0.15,           // Movimento vertical quase parado
        wind: 0.4,             // Vento horizontal bem leve para a névoa flutuar de lado
        size: [150, 300],      // Círculos GIGANTES para parecerem nuvens
        alpha: [0.03, 0.08],   // Opacidade ULTRA BAIXA (entre 3% e 8%) para acumular organicamente
        color: 0xdeeef5,       // Um branco acinzentado/fantasmagórico
        type: 'flake',         // Usaremos o tipo flake porque ele já tem a oscilação natural
        fogAlpha: 0.15,        // Um fundo leve para homogeneizar o ambiente
        fogColor: 0x90a4ae,
    },
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTADO INTERNO
// ─────────────────────────────────────────────────────────────────────────────
let weatherLayer:  PIXI.Container  | null = null
let particleGfx:   PIXI.Graphics   | null = null
let fogOverlay:    PIXI.Graphics   | null = null
let particles:     Particle[]             = []
let currentWeather: WeatherType           = 'clear'

// Controle de fade in/out
let targetAlpha   = 1
let currentAlpha  = 1
const FADE_SPEED  = 0.04

let lightningTimer    = 0
let lightningAlpha    = 0
let lightningFlashing = false

let lightningGfx: PIXI.Graphics | null = null
let weatherTime = 0

let fogBlurFilter: PIXI.BlurFilter | null = null

function scheduleLightning() {
    // Próximo clarão entre 4 e 12 segundos (a 60fps)
    lightningTimer = Math.floor(rand(240, 720))
}

function tickLightning() {
    if (currentWeather !== 'storm') {
        lightningAlpha    = 0
        lightningFlashing = false
        return
    }

    if (lightningTimer > 0) {
        lightningTimer--
        if (lightningAlpha > 0) {
            // Fade out do clarão
            lightningAlpha = Math.max(0, lightningAlpha - 0.08)
            applyLightningOverlay()
        }
        return
    }

    // Dispara o clarão
    if (!lightningFlashing) {
        lightningFlashing = true
        lightningAlpha    = rand(0.55, 0.85)
        applyLightningOverlay()

        // Segundo flash rápido após ~80ms (5 frames)
        setTimeout(() => {
            lightningAlpha = rand(0.3, 0.6)
            applyLightningOverlay()
            setTimeout(() => {
                lightningAlpha    = 0
                lightningFlashing = false
                applyLightningOverlay()
                scheduleLightning()
            }, 120)
        }, 80)
    }

    tickLightning()
}

function applyLightningOverlay() {
    if (!lightningGfx) return
    lightningGfx.alpha = lightningAlpha
}

export function initWeather() {
    // 1. Criamos os containers padrão
    weatherLayer = new PIXI.Container()
    weatherLayer.label     = 'weather-layer'
    weatherLayer.zIndex    = 500   
    weatherLayer.eventMode = 'none'
    app.stage.addChild(weatherLayer)

    fogOverlay = new PIXI.Graphics()
    fogOverlay.label     = 'weather-fog'
    fogOverlay.eventMode = 'none'
    weatherLayer.addChild(fogOverlay)

    particleGfx = new PIXI.Graphics()
    particleGfx.label     = 'weather-particles'
    particleGfx.eventMode = 'none'
    weatherLayer.addChild(particleGfx)

    // CORRIGIDO: Salvamos na variável global para controlar dinamicamente depois
    fogBlurFilter = new PIXI.BlurFilter()
    fogBlurFilter.blur = 32 
    fogBlurFilter.quality = 4

    window.addEventListener('resize', drawFogOverlay)
}

// ─────────────────────────────────────────────────────────────────────────────
// API PÚBLICA
// ─────────────────────────────────────────────────────────────────────────────
export function setWeather(type: WeatherType) {
    if (type === currentWeather) return
    currentWeather = type

    // Fade out → troca → fade in (feito no tick via targetAlpha)
    targetAlpha   = 0
    currentAlpha  = weatherLayer?.alpha ?? 1

    // Após o fade out completo, spawnParticles() é chamado no tick
    updateWeatherButtons(type)
}

export function getCurrentWeather(): WeatherType {
    return currentWeather
}

// ─────────────────────────────────────────────────────────────────────────────
// SPAWN DE PARTÍCULAS
// ─────────────────────────────────────────────────────────────────────────────
function spawnParticles() {
    const cfg = WEATHER_CONFIGS[currentWeather]
    particles  = []

    for (let i = 0; i < cfg.count; i++) {
        particles.push(makeParticle(cfg, true))
    }
}

function makeParticle(cfg: WeatherConfig, randomY = false): Particle {
    const sw = window.innerWidth
    const sh = window.innerHeight

    const size  = rand(cfg.size[0], cfg.size[1])
    const alpha = rand(cfg.alpha[0], cfg.alpha[1])

    // Se for névoa, espalha em X por toda a largura no primeiro spawn
    const xSpawn = currentWeather === 'fog' && randomY ? rand(0, sw) : rand(-sw * 0.1, sw * 1.6);

    return {
        x: xSpawn,
        y: randomY ? rand(-sh, sh) : rand(-size, -5), // Se adapta ao tamanho gigante da nuvem
        vx: currentWeather === 'fog' ? rand(cfg.wind * 0.5, cfg.wind * 1.5) : rand(cfg.wind * 0.85, cfg.wind * 1.15),
        vy: rand(cfg.speed * 0.7, cfg.speed * 1.3),
        alpha,
        size,
        life:  1,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TICK — chamado pelo app.ticker em main.ts
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// TICK — chamado pelo app.ticker em main.ts
// ─────────────────────────────────────────────────────────────────────────────
export function tickWeather() {
    if (!weatherLayer || !particleGfx || !fogOverlay) return

    // Incrementa o tempo interno para criar a ondulação matemática suave da névoa
    weatherTime += 0.02

    const cfg = WEATHER_CONFIGS[currentWeather]

    // ── Fade ─────────────────────────────────────────────────────────────────
    if (currentAlpha < targetAlpha) {
        currentAlpha = Math.min(targetAlpha, currentAlpha + FADE_SPEED)
        weatherLayer.alpha = currentAlpha
    } else if (currentAlpha > targetAlpha) {
        currentAlpha = Math.max(targetAlpha, currentAlpha - FADE_SPEED)
        weatherLayer.alpha = currentAlpha

        // Quando fade out completa, troca para o novo clima
        if (currentAlpha <= 0) {
            spawnParticles()
            drawFogOverlay()
            targetAlpha  = 1
        }
        return
    }

    if (cfg.type === 'none' && !cfg.fogAlpha) {
        particleGfx.clear()
        return
    }

    particleGfx.clear()

    if (currentWeather === 'fog') {
        particleGfx.blendMode = 'screen' 
        
        if (fogBlurFilter) {
            particleGfx.filters = [fogBlurFilter]
        }
    } else {
        particleGfx.blendMode = 'normal' 
        
        particleGfx.filters = null 
    }

    if (cfg.type === 'drop' || cfg.type === 'flake') {
        const sw = window.innerWidth
        const sh = window.innerHeight

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i]

            if (currentWeather === 'fog') {
                // Movimento exclusivo de Névoa: Flutua para a direita, oscilando levemente em Y
                p.x += p.vx;
                // CORRIGIDO: Agora usa weatherTime e balança de forma suave independente do ping
                p.y += Math.sin(weatherTime + p.x * 0.01) * 0.15; 

                // Se a nuvem gigante sair totalmente da tela na direita ou laterais, reseta na esquerda
                if (p.x > sw + p.size || p.y > sh + p.size || p.x < -p.size) {
                    Object.assign(p, makeParticle(cfg, false));
                    p.x = -p.size; // Força a nascer fora da tela na esquerda para reentrar continuamente
                    continue;
                }
            } else {
                // Movimento Normal para Chuva e Neve (Seu código original)
                if (cfg.type === 'flake') {
                    p.vx += rand(-0.08, 0.08)
                    p.vx = clamp(p.vx, -cfg.wind * 2, cfg.wind * 2)
                }
                p.x += p.vx
                p.y += p.vy
                
                if (p.y > sh + 10 || p.x < -20 || p.x > sw * 1.6) {
                    Object.assign(p, makeParticle(cfg, false))
                    continue
                }
            }

            // Desenha
            if (cfg.type === 'drop') {
                drawRaindrop(p, cfg.color)
            } else {
                drawSnowflake(p, cfg.color) // A névoa vai usar essa mesma função, mas com o tamanho gigante + blur
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// DESENHO DAS PARTÍCULAS
// ─────────────────────────────────────────────────────────────────────────────
function drawRaindrop(p: Particle, color: number) {
    if (!particleGfx) return
    const len = p.size * 8
    particleGfx.setStrokeStyle({ width: p.size * 0.6, color, alpha: p.alpha })
    particleGfx.moveTo(p.x, p.y)
    particleGfx.lineTo(p.x - p.vx * 1.5, p.y - len)
    particleGfx.stroke()
}

function drawSnowflake(p: Particle, color: number) {
    if (!particleGfx) return
    // Floco = círculo pequeno suave
    particleGfx
        .circle(p.x, p.y, p.size)
        .fill({ color, alpha: p.alpha })
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERLAY DE NÉVOA / NUBLADO
// ─────────────────────────────────────────────────────────────────────────────
function drawFogOverlay() {
    if (!fogOverlay) return
    fogOverlay.clear()

    const cfg = WEATHER_CONFIGS[currentWeather]
    if (!cfg.fogAlpha || cfg.fogAlpha <= 0) return

    fogOverlay
        .rect(0, 0, window.innerWidth, window.innerHeight)
        .fill({ color: cfg.fogColor ?? 0x000000, alpha: cfg.fogAlpha })
}

// ─────────────────────────────────────────────────────────────────────────────
// ATUALIZA BOTÕES DO PAINEL
// ─────────────────────────────────────────────────────────────────────────────
function updateWeatherButtons(type: WeatherType) {
    document.querySelectorAll('.weather-btn').forEach(btn => {
        btn.classList.toggle('active', (btn as HTMLElement).dataset.weather === type)
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
function rand(min: number, max: number): number {
    return min + Math.random() * (max - min)
}

function clamp(v: number, min: number, max: number): number {
    return Math.min(Math.max(v, min), max)
}