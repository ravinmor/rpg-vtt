// src/engine/uiDrawer.ts
import { generateShapePath } from '../utils/math';

/**
 * Desenha o preview de formas geométricas (quadrado, círculo, etc)
 */
export function drawShapePreview(ctx, currentDrawMode, shapeStart, shapeEnd) {
    if (!shapeStart || !shapeEnd) return;
    
    const previewPath = generateShapePath(currentDrawMode, shapeStart, shapeEnd);
    if (previewPath.length === 0) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(previewPath[0].x, previewPath[0].y);
    previewPath.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
}

/**
 * Desenha a linha do pincel enquanto o usuário arrasta
 */
export function drawGestureLine(ctx, gesturePoints, menuOpen) {
    if (gesturePoints.length < 2) return;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = menuOpen ? 'rgba(255, 255, 255, 0.2)' : 'white';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round'; 
    ctx.lineJoin = 'round';
    ctx.moveTo(gesturePoints[0].x, gesturePoints[0].y);
    gesturePoints.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.stroke();
    ctx.restore();
}

/**
 * Desenha a bolinha vermelha quando o rastro do pincel se cruza
 */
export function drawIntersectionPoint(ctx, intersectionPoint) {
    if (!intersectionPoint) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(intersectionPoint.x, intersectionPoint.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'red';
    ctx.fill();
    ctx.restore();
}

/**
 * Desenha o contorno da área detectada quando o menu abre
 */
export function drawAreaHighlight(ctx, lastCirclePath) {
    if (lastCirclePath.length < 2) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(lastCirclePath[0].x, lastCirclePath[0].y);
    lastCirclePath.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.setLineDash([4, 4]); 
    ctx.stroke();
    ctx.restore();
}