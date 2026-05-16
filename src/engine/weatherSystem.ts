// src/engine/weatherSystem.ts
// Sistema de clima com partículas sobre o mapa.
// A layer de partículas fica no app.stage (fixo na tela),
// não no viewport — assim não sofre pan/zoom.
import * as PIXI from 'pixi.js'
import { app, viewport } from './scene'

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────
export type WeatherType =
    | 'clear' 
    | 'cloudy' 
    | 'rain' 
    | 'storm' 
    | 'snow' 
    | 'fog'
    | 'blizzard' 
    | 'sandstorm'  
    | 'heatwave'
    | 'ashfall' 
    | 'gale'    
    | 'infernal'

interface Particle {
    x:           number
    y:           number
    vx:          number
    vy:          number
    alpha:       number
    size:        number
    life:        number
    ember?:      boolean  // cinza incandescente
    pulseOffset?: number  // fase do pulso (cada brasa tem fase diferente)
    pulseSpeed?:  number  // velocidade do pulso
}

interface WeatherConfig {
    label:         string
    count:         number
    speed:         number
    wind:          number
    size:          [number, number]
    alpha:         [number, number]
    color:         number
    type:          'drop' | 'flake' | 'fog' | 'none'
    fogAlpha?:     number
    fogColor?:     number
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURAÇÃO DE CADA ESTADO
// ─────────────────────────────────────────────────────────────────────────────
const WEATHER_CONFIGS: Record<WeatherType, WeatherConfig> = {
    clear:     { label: 'Limpo',            count: 0,    speed: 0,    wind: 0,   size: [0,0],       alpha: [0,0],       color: 0xffffff, type: 'none' },
    cloudy:    { label: 'Nublado',          count: 0,    speed: 0,    wind: 0,   size: [0,0],       alpha: [0,0],       color: 0x5e5eb5, type: 'none',  fogAlpha: 0.40, fogColor: 0x303030 },
    rain:      { label: 'Chuva',            count: 300,  speed: 14,   wind: 2,   size: [1,2],       alpha: [0.35,0.65], color: 0x8ab4cc, type: 'drop' },
    storm:     { label: 'Tempestade',       count: 800,  speed: 26,   wind: -12, size: [1,2.5],     alpha: [0.5,0.85],  color: 0x6a9ab8, type: 'drop',  fogAlpha: 0.18, fogColor: 0x101820 },
    snow:      { label: 'Neve',             count: 250,  speed: 2.5,  wind: 0.8, size: [2,5],       alpha: [0.5,0.9],   color: 0xddeeff, type: 'flake' },
    fog:       { label: 'Névoa',            count: 40,   speed: 0.15, wind: 0.4, size: [150,300],   alpha: [0.03,0.08], color: 0xdeeef5, type: 'flake', fogAlpha: 0.15, fogColor: 0x90a4ae },
    blizzard:  { label: 'Nevasca',          count: 700,  speed: 9,    wind: -25, size: [1.5,3.5],   alpha: [0.4,0.85],  color: 0xffffff, type: 'flake', fogAlpha: 0.35, fogColor: 0xe0e8f0 },
    sandstorm: { label: 'Temp. de Areia',   count: 1500, speed: 1.5,  wind: -32, size: [1,2.5],     alpha: [0.3,0.7],   color: 0xcca662, type: 'flake', fogAlpha: 0.60, fogColor: 0x8c6f3d },
    heatwave:  { label: 'Calor Extremo',    count: 0,    speed: 0,    wind: 0,   size: [0,0],       alpha: [0,0],       color: 0x000000, type: 'none',  fogAlpha: 0.20, fogColor: 0xe67e22 },
    ashfall:   { label: 'Cinzas',           count: 200,  speed: 1.2,  wind: -1.5,size: [2,5],       alpha: [0.35,0.75], color: 0x595959, type: 'flake', fogAlpha: 0.55, fogColor: 0x1a0f0f },
    gale:      { label: 'Vendaval',         count: 150,  speed: 0.5,  wind: -45, size: [1,1.8],     alpha: [0.15,0.4],  color: 0xffffff, type: 'drop',  fogAlpha: 0.12, fogColor: 0xcfd8dc },
    infernal:  { label: 'Infernal',          count: 200,  speed: 1.2,  wind: -1.5, size: [2,5],      alpha: [0.35,0.75], color: 0x595959, type: 'flake', fogAlpha: 0.45, fogColor: 0x3a0a00 },
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTADO INTERNO
// ─────────────────────────────────────────────────────────────────────────────
let weatherLayer:  PIXI.Container  | null = null
let particleGfx:   PIXI.Graphics   | null = null
let fogOverlay:    PIXI.Graphics   | null = null
let particles:     Particle[]             = []
let currentWeather: WeatherType           = 'clear'

let targetAlpha   = 1
let currentAlpha  = 1
const FADE_SPEED  = 0.04

let lightningTimer    = 0
let lightningAlpha    = 0
let lightningFlashing = false
let lightningGfx: PIXI.Graphics | null = null

let weatherTime = 0
let fogBlurFilter:  PIXI.BlurFilter | null = null
let galeBlobFilter: PIXI.BlurFilter | null = null   // blur para as rajadas do vendaval
let galeGfx:        PIXI.Graphics   | null = null   // layer separada para não misturar blend modes
let galeParticles:  Particle[]             = []      // partículas-bolha do vendaval
let sandGfx:        PIXI.Graphics   | null = null
let sandBlobFilter: PIXI.BlurFilter | null = null
let sandParticles:  Particle[]             = []

// ─────────────────────────────────────────────────────────────────────────────
// HEATWAVE FILTER — Pixi v8 usa GlProgram
// ─────────────────────────────────────────────────────────────────────────────

// Vertex padrão do Pixi v8 — obtido do código fonte oficial
const HEAT_VERT = `
    in vec2 aPosition;
    out vec2 vTextureCoord;

    uniform vec4 uInputSize;
    uniform vec4 uOutputFrame;
    uniform vec4 uOutputTexture;

    void main(void) {
        vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
        position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
        position.y = position.y * (2.0 / uOutputTexture.y) - 1.0;
        position.y = -position.y;
        gl_Position = vec4(position, 0.0, 1.0);
        vTextureCoord = aPosition * (uOutputFrame.zw * uInputSize.zw);
    }
`

// Fragment shader com a distorção senoidal do calor
const HEAT_FRAG = `
    in vec2 vTextureCoord;
    out vec4 finalColor;

    uniform sampler2D uTexture;
    uniform float uTime;

    void main(void) {
        vec2 uv = vTextureCoord;

        // Ondas de calor: distorção senoidal em X e Y
        float dx = sin(uTime * 3.5 + uv.y * 25.0) * 0.0018;
        float dy = cos(uTime * 2.5 + uv.x * 20.0) * 0.0013;

        uv.x += dx;
        uv.y += dy;

        finalColor = texture(uTexture, uv);
    }
`

// Uniforms do heatwave — objeto simples atualizado a cada frame
// No Pixi v8, UniformGroup espera { key: { value, type } }
// O objeto heatUniformData é o que passamos para o grupo.
// Para atualizar uTime a cada frame, acessamos .uniforms.uTime diretamente no grupo.
let heatUniformGroup: PIXI.UniformGroup | null = null
let heatwaveFilter: PIXI.Filter | null = null

function createHeatwaveFilter(): PIXI.Filter {
    const glProgram = new PIXI.GlProgram({
        vertex:   HEAT_VERT,
        fragment: HEAT_FRAG,
    })

    // Pixi v8: UniformGroup recebe descritores { value, type }
    heatUniformGroup = new PIXI.UniformGroup({
        uTime: { value: 0, type: 'f32' },
    })

    const filter = new PIXI.Filter({
        glProgram,
        resources: {
            heatUniforms: heatUniformGroup,
        },
    })

    return filter
}

// ─────────────────────────────────────────────────────────────────────────────
// RAIO
// ─────────────────────────────────────────────────────────────────────────────
function scheduleLightning() {
    lightningTimer = Math.floor(rand(120, 600))
}

function tickLightning() {
    if (currentWeather !== 'storm') {
        lightningAlpha    = 0
        lightningFlashing = false
        applyLightningOverlay()
        return
    }
    if (lightningTimer > 0) {
        lightningTimer--
        if (lightningAlpha > 0) {
            lightningAlpha = Math.max(0, lightningAlpha - 0.15)
            applyLightningOverlay()
        }
        return
    }
    if (!lightningFlashing) {
        lightningFlashing = true
        lightningAlpha    = rand(0.6, 0.9)
        applyLightningOverlay()
        setTimeout(() => {
            lightningAlpha = rand(0.4, 0.7)
            applyLightningOverlay()
            setTimeout(() => {
                lightningFlashing = false
                scheduleLightning()
            }, 80)
        }, 60)
    }
}

function applyLightningOverlay() {
    if (!lightningGfx) return
    lightningGfx.alpha = lightningAlpha
}

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────
export function initWeather() {
    weatherLayer           = new PIXI.Container()
    weatherLayer.label     = 'weather-layer'
    weatherLayer.eventMode = 'none'
    app.stage.addChild(weatherLayer)

    lightningGfx           = new PIXI.Graphics()
    lightningGfx.label     = 'weather-lightning'
    lightningGfx.eventMode = 'none'
    lightningGfx.alpha     = 0
    lightningGfx.rect(0, 0, window.innerWidth, window.innerHeight).fill({ color: 0xffffff })
    weatherLayer.addChild(lightningGfx)

    fogOverlay           = new PIXI.Graphics()
    fogOverlay.label     = 'weather-fog'
    fogOverlay.eventMode = 'none'
    weatherLayer.addChild(fogOverlay)

    particleGfx           = new PIXI.Graphics()
    particleGfx.label     = 'weather-particles'
    particleGfx.eventMode = 'none'
    weatherLayer.addChild(particleGfx)

    // Cria o filtro de heatwave com a API correta do Pixi v8
    heatwaveFilter = createHeatwaveFilter()

    fogBlurFilter         = new PIXI.BlurFilter()
    fogBlurFilter.blur    = 32
    fogBlurFilter.quality = 4

    // Layer de rajadas do vendaval — blur forte, blend screen, igual à névoa
    galeGfx           = new PIXI.Graphics()
    galeGfx.label     = 'weather-gale-blobs'
    galeGfx.eventMode = 'none'
    galeGfx.blendMode = 'screen'
    weatherLayer.addChild(galeGfx)

    galeBlobFilter         = new PIXI.BlurFilter()
    galeBlobFilter.blur    = 40   // blur mais forte que a névoa — rafagas são mais difusas
    galeBlobFilter.quality = 3
    galeGfx.filters        = [galeBlobFilter]

    sandGfx           = new PIXI.Graphics()
    sandGfx.label     = 'weather-sand-blobs'
    sandGfx.eventMode = 'none'
    sandGfx.blendMode = 'screen'
    weatherLayer.addChild(sandGfx)

    sandBlobFilter         = new PIXI.BlurFilter()
    sandBlobFilter.blur    = 28   // blur menor — areia é mais densa e menos etérea
    sandBlobFilter.quality = 3
    sandGfx.filters        = [sandBlobFilter]

    window.addEventListener('resize', () => {
        drawFogOverlay()
        if (lightningGfx) {
            lightningGfx.clear()
            lightningGfx.rect(0, 0, window.innerWidth, window.innerHeight).fill({ color: 0xffffff })
        }
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// API PÚBLICA
// ─────────────────────────────────────────────────────────────────────────────
export function setWeather(type: WeatherType) {
    if (type === currentWeather) return
    currentWeather = type
    targetAlpha    = 0
    currentAlpha   = weatherLayer?.alpha ?? 1
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

    // Spawna as bolhas de rajada do vendaval
    galeParticles = []
    if (currentWeather === 'gale') {
        for (let i = 0; i < 18; i++) {
            galeParticles.push(makeGaleBlob())
        }
    }

    sandParticles = []
    if (currentWeather === 'sandstorm') {
        for (let i = 0; i < 22; i++) {
            sandParticles.push(makeSandBlob())
        }
    }
}

function makeSandBlob(): Particle {
    const sw = window.innerWidth
    const sh = window.innerHeight
    return {
        x:           rand(sw * 0.2, sw * 1.5),
        y:           rand(-sh * 0.1, sh * 1.1),
        vx:          rand(-40, -25),              // mais lento que o vendaval
        vy:          rand(-0.3, 0.3),
        alpha:       rand(0.06, 0.14),            // mais opaco — areia é mais densa
        size:        rand(80, 200),               // bolhas menores que o vendaval
        life:        1,
        ember:       false,
        pulseOffset: rand(0, Math.PI * 2),
        pulseSpeed:  rand(0.02, 0.05),            // pulsa mais rápido — turbulência da areia
    }
}

function makeGaleBlob(): Particle {
    const sw = window.innerWidth
    const sh = window.innerHeight
    return {
        x:    rand(sw * 0.2, sw * 1.5),    // nasce espalhado à direita e fora da tela
        y:    rand(-sh * 0.1, sh * 1.1),   // qualquer altura
        vx:   rand(-55, -35),               // velocidade horizontal brutal para a esquerda
        vy:   rand(-0.5, 0.5),             // quase não se move verticalmente
        alpha: rand(0.04, 0.10),           // ultra transparente como a névoa
        size:  rand(120, 280),             // círculos gigantes como a névoa
        life:  1,
        ember: false,
        pulseOffset: rand(0, Math.PI * 2),
        pulseSpeed:  rand(0.01, 0.03),     // pulsação muito lenta (escala de opacidade)
    }
}

function makeParticle(cfg: WeatherConfig, randomY = false): Particle {
    const sw    = window.innerWidth
    const sh    = window.innerHeight
    const size  = rand(cfg.size[0], cfg.size[1])
    const alpha = rand(cfg.alpha[0], cfg.alpha[1])

    let xSpawn = rand(0, sw)
    if (currentWeather === 'fog') {
        xSpawn = randomY ? rand(0, sw) : rand(-sw * 0.1, sw * 1.6)
    } else if (cfg.wind < 0) {
        xSpawn = randomY ? rand(-sw * 0.2, sw * 1.8) : rand(-sw * 0.1, sw * 1.8)
    } else if (cfg.wind > 0) {
        xSpawn = randomY ? rand(-sw * 0.8, sw * 1.2) : rand(-sw * 0.8, sw * 1.1)
    }

    let ySpawn = randomY ? rand(-sh, sh) : rand(-size, -5)
    if (!randomY && Math.abs(cfg.wind) > 30) {
        ySpawn = rand(0, sh)
    }

    const isEmber = (currentWeather === 'ashfall' || currentWeather === 'infernal') && Math.random() < 0.25

    return {
        x:           xSpawn,
        y:           ySpawn,
        vx:          currentWeather === 'fog' ? rand(cfg.wind * 0.5, cfg.wind * 1.5) : rand(cfg.wind * 0.85, cfg.wind * 1.15),
        vy:          rand(cfg.speed * 0.7, cfg.speed * 1.3),
        alpha,
        size:        isEmber ? rand(1.5, 3.5) : size,   // brasas são menores e mais definidas
        life:        1,
        ember:       isEmber,
        pulseOffset: isEmber ? rand(0, Math.PI * 2) : 0, // fase aleatória para cada brasa
        pulseSpeed:  isEmber ? rand(0.04, 0.10) : 0,     // velocidade de pulsação individual
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TICK
// ─────────────────────────────────────────────────────────────────────────────
export function tickWeather() {
    if (!weatherLayer || !particleGfx || !fogOverlay) return

    tickLightning()
    weatherTime += 0.02
    const cfg = WEATHER_CONFIGS[currentWeather]

    // ── Fade ─────────────────────────────────────────────────────────────────
    if (currentAlpha < targetAlpha) {
        currentAlpha = Math.min(targetAlpha, currentAlpha + FADE_SPEED)
        weatherLayer.alpha = currentAlpha
    } else if (currentAlpha > targetAlpha) {
        currentAlpha = Math.max(targetAlpha, currentAlpha - FADE_SPEED)
        weatherLayer.alpha = currentAlpha

        if (currentAlpha <= 0) {
            spawnParticles()
            drawFogOverlay()
            targetAlpha = 1

            // Ao trocar de clima, remove o filtro do viewport imediatamente
            if (currentWeather !== 'heatwave') {
                viewport.filters = null
            }
        }
        return
    }

    // ── Heatwave: aplica filtro no viewport (não no app.stage) ───────────────
    // Aplicar no viewport garante que só o mapa/tokens distorcem —
    // a UI (menus, barra de ferramentas) fica intacta.
    if (currentWeather === 'heatwave' || currentWeather === 'infernal') {
        if (heatwaveFilter) {
            // Atualiza uTime via o objeto de uniforms diretamente
            // Pixi v8: atualiza via .uniforms no grupo
            if (heatUniformGroup) heatUniformGroup.uniforms.uTime = weatherTime

            // Aplica no viewport se ainda não estiver lá
            if (!viewport.filters || !(viewport.filters as PIXI.Filter[]).includes(heatwaveFilter)) {
                viewport.filters = [heatwaveFilter]
            }
        }
        // heatwave: só distorção, sem partículas → sai cedo
        if (currentWeather === 'heatwave') {
            particleGfx.clear()
            return
        }
        // infernal: continua para desenhar as cinzas abaixo
    }

    // Para qualquer outro clima, garante que o viewport não tem filtros
    if (currentWeather !== 'heatwave' && currentWeather !== 'infernal') {
        if (viewport.filters) viewport.filters = null
    }

    // ── Bolhas de rajada do vendaval ─────────────────────────────────────────
    if (galeGfx) {
        galeGfx.clear()
        galeGfx.visible = currentWeather === 'gale'
    }

    if (currentWeather === 'gale' && galeGfx) {
        const sw = window.innerWidth
        const sh = window.innerHeight

        for (let i = 0; i < galeParticles.length; i++) {
            const p = galeParticles[i]

            // Move a bolha horizontalmente na velocidade do vendaval
            p.x += p.vx
            p.y += p.vy

            // Pulso suave de opacidade — simula a rajada ganhando e perdendo força
            p.pulseOffset! += p.pulseSpeed!
            const pulse = (Math.sin(p.pulseOffset!) + 1) / 2
            const a = p.alpha * (0.5 + pulse * 0.5)

            // Redesenha a bolha
            galeGfx.circle(p.x, p.y, p.size).fill({ color: 0xddeeff, alpha: a })

            // Saiu pela esquerda — renasce pela direita
            if (p.x < -p.size * 2) {
                Object.assign(p, makeGaleBlob())
                p.x = rand(sw * 0.8, sw * 1.6)
            }
        }
    }

    if (sandGfx) {
        sandGfx.clear()
        sandGfx.visible = currentWeather === 'sandstorm'
    }

    if (currentWeather === 'sandstorm' && sandGfx) {
        const sw = window.innerWidth

        for (let i = 0; i < sandParticles.length; i++) {
            const p = sandParticles[i]

            p.x += p.vx
            p.y += p.vy

            p.pulseOffset! += p.pulseSpeed!
            const pulse = (Math.sin(p.pulseOffset!) + 1) / 2
            const a = p.alpha * (0.5 + pulse * 0.5)

            // Cor ocre/areia — diferente do azul-branco do vendaval
            sandGfx.circle(p.x, p.y, p.size).fill({ color: 0xcca662, alpha: a })

            if (p.x < -p.size * 2) {
                Object.assign(p, makeSandBlob())
                p.x = rand(sw * 0.8, sw * 1.6)
            }
        }
    }

    // ── Névoa: blend screen + blur ────────────────────────────────────────────
    if (currentWeather === 'fog') {
        particleGfx.blendMode = 'screen'
        if (fogBlurFilter) particleGfx.filters = [fogBlurFilter]
    } else {
        particleGfx.blendMode = 'normal'
        particleGfx.filters   = null
    }

    if (cfg.type === 'none' && !cfg.fogAlpha) {
        particleGfx.clear()
        return
    }

    particleGfx.clear()

    if (cfg.type === 'drop' || cfg.type === 'flake') {
        const sw = window.innerWidth
        const sh = window.innerHeight

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i]

            if (currentWeather === 'fog') {
                p.x += p.vx
                p.y += Math.sin(weatherTime + p.x * 0.01) * 0.15

                if (p.x > sw + p.size || p.y > sh + p.size || p.x < -p.size) {
                    Object.assign(p, makeParticle(cfg, false))
                    p.x = -p.size
                    continue
                }
            } else {
                if (cfg.type === 'flake') {
                    p.vx += rand(-0.08, 0.08)
                    p.vx = clamp(p.vx, -Math.abs(cfg.wind) * 2, Math.abs(cfg.wind) * 2)
                }
                p.x += p.vx
                p.y += p.vy

                if (p.y > sh + 10 || p.x < -sw * 0.5 || p.x > sw * 1.8) {
                    Object.assign(p, makeParticle(cfg, false))
                    if (cfg.wind < -15) p.x = rand(sw * 0.3, sw * 1.8)
                    else if (cfg.wind > 15) p.x = rand(-sw * 0.8, sw * 0.7)
                    continue
                }
            }

            if (cfg.type === 'drop') {
                drawRaindrop(p, cfg.color)
            } else {
                if ((currentWeather === 'ashfall' || currentWeather === 'infernal') && p.ember) {
                                drawEmber(p)
                            } else {
                                drawSnowflake(p, cfg.color)
                            }
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
    particleGfx
        .circle(p.x, p.y, p.size)
        .fill({ color, alpha: p.alpha })
}

function drawEmber(p: Particle) {
    if (!particleGfx) return

    // Avança o pulso individual da brasa
    p.pulseOffset! += p.pulseSpeed!

    // Pulso entre 0 e 1 — senoide normalizada
    const pulse = (Math.sin(p.pulseOffset!) + 1) / 2

    // A brasa alterna entre laranja escuro e branco-quente
    // pulse=0 → cinza quente (0xff4400), pulse=1 → branco incandescente (0xffcc88)
    const r = Math.floor(0xff)
    const g = Math.floor(0x44 + pulse * (0xcc - 0x44))  // 0x44 → 0xcc
    const b = Math.floor(0x00 + pulse * (0x44 - 0x00))  // 0x00 → 0x44
    const emberColor = (r << 16) | (g << 8) | b

    // Alpha também pulsa — quando mais brilhante, mais opaca
    const emberAlpha = p.alpha * (0.5 + pulse * 0.5)

    // Núcleo brilhante (pequeno e intenso)
    particleGfx
        .circle(p.x, p.y, p.size * 0.6)
        .fill({ color: 0xffffff, alpha: emberAlpha * 0.8 })

    // Halo externo (maior e mais transparente — simula o brilho irradiado)
    particleGfx
        .circle(p.x, p.y, p.size * 1.4)
        .fill({ color: emberColor, alpha: emberAlpha * 0.35 })

    // Corpo principal da brasa
    particleGfx
        .circle(p.x, p.y, p.size)
        .fill({ color: emberColor, alpha: emberAlpha })
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