// src/engine/uiDrawer.ts
import * as PIXI from 'pixi.js';
import { layerUI } from './scene';
import { generateShapePath, getBoundingBox } from '../utils/math';

const uiGraphics = new PIXI.Graphics();
let initialized = false;

function ensureInit() {
    if (!initialized && layerUI) {
        layerUI.addChild(uiGraphics);
        initialized = true;
    }
}

export function syncUI(state: any) {
    ensureInit()
    uiGraphics.clear()

    // 1. Preview de forma geométrica enquanto arrasta
    if (state.isDrawingShape && state.shapeStart && state.shapeEnd) {
        const previewPath = generateShapePath(state.currentDrawMode, state.shapeStart, state.shapeEnd)
        if (previewPath.length > 0) {
            uiGraphics.moveTo(previewPath[0].x, previewPath[0].y)
            for (let i = 1; i < previewPath.length; i++) {
                uiGraphics.lineTo(previewPath[i].x, previewPath[i].y)
            }
            uiGraphics.closePath()
            uiGraphics.fill({ color: 0xffffff, alpha: 0.06 })
            uiGraphics.stroke({ color: 0xffffff, alpha: 0.7, width: 2 })
        }
    }

    // 2. Rastro do pincel — durante desenho usa gesturePoints,
    //    enquanto menu estiver aberto usa lastCirclePath
    const pathToShow = state.gesturePoints?.length >= 2
        ? state.gesturePoints
        : (state.menuOpen && state.lastCirclePath?.length >= 2 ? state.lastCirclePath : null)

    if (pathToShow) {
        uiGraphics.moveTo(pathToShow[0].x, pathToShow[0].y)
        for (let i = 1; i < pathToShow.length; i++) {
            uiGraphics.lineTo(pathToShow[i].x, pathToShow[i].y)
        }
        uiGraphics.closePath()
        uiGraphics.fill({ color: 0xffffff, alpha: state.menuOpen ? 0.05 : 0.0 })
        uiGraphics.stroke({ color: 0xffffff, alpha: state.menuOpen ? 0.35 : 0.9, width: 2 })
    }

    // 3. Ponto de interseção
    if (state.intersectionPoint && !state.menuOpen) {
        uiGraphics
            .circle(state.intersectionPoint.x, state.intersectionPoint.y, 8)
            .fill({ color: 0xff0000 })
            .stroke({ color: 0xffffff, width: 2 })
    }

    // 4. Preview spell_object
    if (state.currentDrawMode === 'spell_object' && state.pendingSpellPoint) {
        uiGraphics
            .circle(state.pendingSpellPoint.x, state.pendingSpellPoint.y, 40)
            .fill({ color: 0xaa44ff, alpha: 0.25 })
            .stroke({ color: 0xaa44ff, alpha: 0.8, width: 2 })
    }
}
