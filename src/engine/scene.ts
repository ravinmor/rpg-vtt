import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { initGizmo } from './transformGizmo'

export let app:            PIXI.Application
export let viewport:       Viewport

export let layerEffects:   PIXI.Container
export let layerGrid:      PIXI.Graphics
export let layerTokens:    PIXI.Container
export let layerUI:        PIXI.Container
export let layerFog:       PIXI.Container
layerFog = new PIXI.Container()
layerFog.label     = 'layer-fog'
layerFog.eventMode = 'none'
layerFog.visible   = false

const emptyFilter = new PIXI.AlphaFilter()
emptyFilter.alpha  = 1
layerFog.filters   = [emptyFilter]

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
        premultipliedAlpha: true,
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

    // Camadas do viewport (mundo — sofrem pan/zoom)
    layerEffects       = new PIXI.Container()
    layerGrid          = new PIXI.Graphics()
    layerTokens        = new PIXI.Container()
    layerUI            = new PIXI.Container()
    layerFog           = new PIXI.Container()
    layerFog.label     = 'layer-fog'
    layerFog.eventMode = 'none'
    layerFog.visible   = false
    layerFog.filters   = [emptyFilter]

    viewport.addChild(layerEffects)
    viewport.addChild(layerGrid)  // 1º — mapa e tokens
    viewport.addChild(layerTokens)
    viewport.addChild(layerUI)
    viewport.addChild(layerPings)
    viewport.addChild(layerFog)

    subLayerAreas  = new PIXI.Container()
    subLayerSpells = new PIXI.Container()

    layerEffects.addChild(subLayerAreas)
    layerEffects.addChild(subLayerSpells)

    subLayerAreas.eventMode  = 'none'
    subLayerSpells.eventMode = 'static'
    layerTokens.eventMode    = 'static'
    layerPings.eventMode     = 'none'

    // Fog — fica no app.stage em coordenadas de TELA (não sofre pan/zoom)
    // Adicionada APÓS o viewport para ficar por cima

    app.stage.addChild(viewport)       // 2º — fog por cima do mapa, em coords de tela

    w.app      = app
    w.viewport = viewport

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight)
        viewport.resize(window.innerWidth, window.innerHeight)
    })

    initGizmo()
}
