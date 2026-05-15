import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { initGizmo } from './transformGizmo'

export let app: PIXI.Application
export let viewport: Viewport

export let layerEffects: PIXI.Container
export let layerGrid:    PIXI.Graphics
export let layerTokens:  PIXI.Container
export let layerUI:      PIXI.Container

export let subLayerAreas:  PIXI.Container
export let subLayerSpells: PIXI.Container

const w = (window as any)

export async function initScene(canvas: HTMLCanvasElement) {
    app = new PIXI.Application()

    await app.init({
        canvas,
        width:           window.innerWidth,
        height:          window.innerHeight,
        backgroundColor: 0x000000,
        antialias:       true,
        resolution:      window.devicePixelRatio || 1,
        autoDensity:     true,
    })

    viewport = new Viewport({
        screenWidth:  window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth:   4000,
        worldHeight:  4000,
        events:       app.renderer.events,
    })

    viewport
        .drag({ mouseButtons: 'middle' })
        .pinch()
        .wheel()
        .decelerate()

    app.stage.addChild(viewport)

    layerEffects = new PIXI.Container()
    layerGrid    = new PIXI.Graphics()
    layerTokens  = new PIXI.Container()
    layerUI      = new PIXI.Container()

    viewport.addChild(layerEffects)
    viewport.addChild(layerGrid)
    viewport.addChild(layerTokens)
    viewport.addChild(layerUI)

    subLayerAreas  = new PIXI.Container()
    subLayerSpells = new PIXI.Container()

    layerEffects.addChild(subLayerAreas)
    layerEffects.addChild(subLayerSpells)

    // Áreas nunca interceptam cliques — hit test é feito manualmente
    // no mouseHandlers. Sem isso, uma textura criada depois bloqueia
    // o clique em spells que estão visualmente na frente.
    subLayerAreas.eventMode  = 'none'
    subLayerSpells.eventMode = 'static'
    layerTokens.eventMode    = 'static'

    w.app      = app
    w.viewport = viewport

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight)
        viewport.resize(window.innerWidth, window.innerHeight)
    })

    initGizmo()
}