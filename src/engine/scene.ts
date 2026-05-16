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
export const layerPings = new PIXI.Graphics();
layerPings.label = 'layer_pings';

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

    // 1. Camadas base do mapa e tokens entram primeiro (ficam atrás)
    viewport.addChild(layerEffects)
    viewport.addChild(layerGrid)
    viewport.addChild(layerTokens)
    viewport.addChild(layerUI)

    // 2. ADICIONE A LAYER DE PINGS NO TOPO DO VIEWPORT AQUI!
    // Como ela é adicionada por último no viewport, nada dentro do mapa pode cobri-la
    viewport.addChild(layerPings)

    subLayerAreas  = new PIXI.Container()
    subLayerSpells = new PIXI.Container()

    // REMOVIDO: subLayerAreas.addChild(layerPings); <-- Tira daqui!
    
    layerEffects.addChild(subLayerAreas)
    layerEffects.addChild(subLayerSpells)
    
    subLayerAreas.eventMode  = 'none'
    subLayerSpells.eventMode = 'static'
    layerTokens.eventMode    = 'static'
    
    // Garante que a camada de pings também ignore cliques para não travar o mapa embaixo dela
    layerPings.eventMode     = 'none'

    w.app      = app
    w.viewport = viewport

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight)
        viewport.resize(window.innerWidth, window.innerHeight)
    })

    initGizmo()
}