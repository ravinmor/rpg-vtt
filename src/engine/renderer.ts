// src/engine/renderer.ts
import * as PIXI from 'pixi.js'
import { layerBackground, layerGrid } from './scene'
import { backgroundDefinitions } from '../data/background' // Importe as definições aqui

export function drawBackground(type: string) {
    const config = (backgroundDefinitions as any)[type];
    
    // Se mudar para "none" ou não existir, limpa
    if (!config || type === 'none') {
        layerBackground.removeChildren();
        return;
    }

    // Só cria o sprite se a layer estiver vazia ou se o fundo mudou
    if (layerBackground.children.length === 0 || (layerBackground.children[0] as any).label !== type) {
        layerBackground.removeChildren();
        
        const texture = PIXI.Texture.from(config.path);
        const backgroundSprite = new PIXI.Sprite(texture);
        backgroundSprite.label = type;

        // Cobre o mundo
        backgroundSprite.width = 4000;
        backgroundSprite.height = 4000;

        layerBackground.addChild(backgroundSprite);
    }
}

export function drawGrid(baseSize: number, scale: number) {
    layerGrid.clear();
    layerGrid.setStrokeStyle({ width: 1, color: 0xffffff, alpha: 0.15 });

    const size = baseSize * scale;
    const w = 4000;
    const h = 4000;

    for (let x = 0; x <= w; x += size) {
        layerGrid.moveTo(x, 0).lineTo(x, h);
    }
    for (let y = 0; y <= h; y += size) {
        layerGrid.moveTo(0, y).lineTo(w, y);
    }
    layerGrid.stroke();
}