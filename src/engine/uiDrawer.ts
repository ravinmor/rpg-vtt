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

// ─────────────────────────────────────────────────────────────────────────────
// HANDLES — geometria exportada para que mouseHandlers possa fazer hit-test
// sem depender do Pixi. Atualizada todo frame pelo syncUI.
// ─────────────────────────────────────────────────────────────────────────────
export const editHandles = {
    resize: null as { x: number; y: number } | null,   // canto inferior-direito
    rotate: null as { x: number; y: number } | null,   // acima do centro
    radius: 10,   // raio de hit dos handles em px do mundo
};

export function syncUI(state: any) {
    ensureInit();
    uiGraphics.clear();
    editHandles.resize = null;
    editHandles.rotate = null;

    // 1. Preview de forma geométrica enquanto arrasta
    if (state.isDrawingShape && state.shapeStart && state.shapeEnd) {
        const previewPath = generateShapePath(state.currentDrawMode, state.shapeStart, state.shapeEnd);
        if (previewPath.length > 0) {
            uiGraphics.moveTo(previewPath[0].x, previewPath[0].y);
            for (let i = 1; i < previewPath.length; i++) {
                uiGraphics.lineTo(previewPath[i].x, previewPath[i].y);
            }
            uiGraphics.closePath();
            uiGraphics.fill({ color: 0xffffff, alpha: 0.06 });
            uiGraphics.stroke({ color: 0xffffff, alpha: 0.7, width: 2 });
        }
    }

    // 2. Rastro do pincel
    if (state.gesturePoints && state.gesturePoints.length >= 2) {
        const alpha = state.menuOpen ? 0.2 : 0.9;
        uiGraphics.moveTo(state.gesturePoints[0].x, state.gesturePoints[0].y);
        for (let i = 1; i < state.gesturePoints.length; i++) {
            uiGraphics.lineTo(state.gesturePoints[i].x, state.gesturePoints[i].y);
        }
        uiGraphics.stroke({ color: 0xffffff, alpha, width: 3 });
    }

    // 3. Ponto de interseção
    if (state.intersectionPoint && !state.menuOpen) {
        uiGraphics
            .circle(state.intersectionPoint.x, state.intersectionPoint.y, 8)
            .fill({ color: 0xff0000 })
            .stroke({ color: 0xffffff, width: 2 });
    }

    // 4. Preview spell_object
    if (state.currentDrawMode === 'spell_object' && state.pendingSpellPoint) {
        uiGraphics
            .circle(state.pendingSpellPoint.x, state.pendingSpellPoint.y, 40)
            .fill({ color: 0xaa44ff, alpha: 0.25 })
            .stroke({ color: 0xaa44ff, alpha: 0.8, width: 2 });
    }

    // 5. Handles de edição (zona selecionada no modo select)
    if (state.editingZone && state.currentDrawMode === 'select' && !state.isDraggingZone) {
        drawEditHandles(state.editingZone);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// DESENHA OS HANDLES E PUBLICA AS POSIÇÕES em editHandles
// ─────────────────────────────────────────────────────────────────────────────
function drawEditHandles(zone: any) {
    const HR = editHandles.radius; // raio visual do handle

    if (zone.type === 'spell_object') {
        const cx = zone.x;
        const cy = zone.y;
        const r  = zone.radius;

        // Borda de seleção
        uiGraphics
            .circle(cx, cy, r + 3)
            .stroke({ color: 0xffd700, alpha: 0.9, width: 2 });

        // Handle de resize: ponto à direita do círculo
        const rx = cx + r;
        const ry = cy;
        editHandles.resize = { x: rx, y: ry };
        drawHandle(rx, ry, 0x00ccff, '↔');

        // Handle de rotate: ponto acima do círculo
        const rotX = cx;
        const rotY = cy - r - 28;
        editHandles.rotate = { x: rotX, y: rotY };
        drawHandle(rotX, rotY, 0x00ff88, '↻');

        // Linha conectando o handle de rotate ao círculo
        uiGraphics
            .moveTo(cx, cy - r - 3)
            .lineTo(cx, cy - r - 20)
            .stroke({ color: 0xffffff, alpha: 0.4, width: 1 });

    } else if (zone.path && zone.path.length > 1) {
        const bb = getBoundingBox(zone.path);

        // Borda de seleção ao redor do bounding box
        uiGraphics
            .rect(bb.minX - 4, bb.minY - 4, bb.width + 8, bb.height + 8)
            .stroke({ color: 0xffd700, alpha: 0.7, width: 1 });

        // Handle de resize: canto inferior-direito
        const rx = bb.maxX + 4;
        const ry = bb.maxY + 4;
        editHandles.resize = { x: rx, y: ry };
        drawHandle(rx, ry, 0x00ccff, '↔');

        // Handle de rotate: centro-topo
        const rotX = bb.minX + bb.width / 2;
        const rotY = bb.minY - 28;
        editHandles.rotate = { x: rotX, y: rotY };
        drawHandle(rotX, rotY, 0x00ff88, '↻');

        // Linha do handle de rotate até a borda superior
        uiGraphics
            .moveTo(rotX, bb.minY - 4)
            .lineTo(rotX, bb.minY - 20)
            .stroke({ color: 0xffffff, alpha: 0.4, width: 1 });
    }
}

function drawHandle(x: number, y: number, color: number, _symbol: string) {
    const HR = editHandles.radius;
    uiGraphics
        .circle(x, y, HR)
        .fill({ color, alpha: 0.9 })
        .stroke({ color: 0xffffff, width: 2 });
}