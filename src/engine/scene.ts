import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'

export let app: PIXI.Application
export let viewport: Viewport

export let layerBackground: PIXI.Container
export let layerEffects: PIXI.Container
export let layerGrid: PIXI.Graphics
export let layerTokens: PIXI.Container
export let layerUI: PIXI.Container

const w = (window as any);

export async function initScene(canvas: HTMLCanvasElement) {
    app = new PIXI.Application()
    
    await app.init({
        canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    })

    // Viewport com pan/zoom — resolve o 1.1 inteiro
    viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 4000,   // tamanho do mundo infinito
        worldHeight: 4000,
        events: app.renderer.events,
    })

    viewport
        .drag({ mouseButtons: 'middle' })  // arrasta com botão do meio
        .pinch()                            // pinch zoom no mobile
        .wheel()                            // scroll para zoom
        .decelerate()                       // inércia

    app.stage.addChild(viewport)

    // Camadas em ordem (z-index implícito pela ordem de addChild)
    layerBackground = new PIXI.Container()
    layerEffects    = new PIXI.Container()
    layerGrid       = new PIXI.Graphics()
    layerTokens     = new PIXI.Container()
    layerUI         = new PIXI.Container()

    viewport.addChild(layerBackground)
    viewport.addChild(layerEffects)
    viewport.addChild(layerGrid)
    viewport.addChild(layerTokens)
    viewport.addChild(layerUI)
    w.app = app;
    w.viewport = viewport;
    // Resize responsivo
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight)
        viewport.resize(window.innerWidth, window.innerHeight)
    })
}