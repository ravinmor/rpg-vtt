// src/engine/effectDrawer.ts
import { getBoundingBox } from '../utils/math';

export function drawActiveZones(ctx, canvas, activeZones, editingZone) {
    activeZones.forEach((zone) => {
        ctx.save();

        // --- LÓGICA PARA MAGIAS CIRCULARES (spell_object) ---
        if (zone.type === 'spell_object') {
            renderSpellObject(ctx, zone, editingZone);
        } 
        // --- LÓGICA PARA ÁREAS DESENHADAS (Pincel/Formas) ---
        else if (zone.path && zone.path.length > 0) {
            renderDrawnArea(ctx, canvas, zone, editingZone);
        }

        ctx.restore();
    });
}

function renderSpellObject(ctx, zone, editingZone) {
    if (zone.rotateSpeed) {
        zone.rotation = (zone.rotation || 0) + zone.rotateSpeed;
    }

    ctx.translate(zone.x, zone.y);
    ctx.rotate(zone.rotation || 0);

    ctx.beginPath();
    ctx.arc(0, 0, zone.radius, 0, Math.PI * 2);
    ctx.clip();

    if (zone.video) {
        ctx.globalAlpha = zone.opacity ?? 0.8;
        ctx.globalCompositeOperation = 'screen'; 
        
        const vRatio = zone.video.videoWidth / zone.video.videoHeight;
        let drawWidth = zone.radius * 2, drawHeight = zone.radius * 2;
        let offsetX = -zone.radius, offsetY = -zone.radius;

        if (vRatio > 1) { 
            drawWidth = drawHeight * vRatio;
            offsetX = -(drawWidth / 2);
        } else if (vRatio < 1) { 
            drawHeight = drawWidth / vRatio;
            offsetY = -(drawHeight / 2);
        }

        ctx.drawImage(zone.video, offsetX, offsetY, drawWidth, drawHeight);
    }
    
    // Se estiver editando, desenha os indicadores de seleção (alças)
    if (editingZone === zone) {
        // ... (seu código de desenho da alça pontilhada e quadrada que estava no main)
    }
}

function renderDrawnArea(ctx, canvas, zone, editingZone) {
    ctx.beginPath();
    ctx.moveTo(zone.path[0].x, zone.path[0].y);
    zone.path.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.clip();

    if (zone.video) {
        ctx.drawImage(zone.video, 0, 0, canvas.width, canvas.height);
    } else if (zone.image && zone.image.complete) {
        if (!zone.pattern) zone.pattern = ctx.createPattern(zone.image, 'repeat');
        if (zone.pattern) {
            ctx.fillStyle = zone.pattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    } else if (zone.color) {
        ctx.fillStyle = zone.color;
        ctx.fill();
    }
    
    // Efeito especial de Vagalumes
    if (zone.type === 'fireflies' && zone.particles) {
        renderParticles(ctx, zone);
    }

    // Borda da área
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();
}

function renderParticles(ctx, zone) {
    const bb = getBoundingBox(zone.path);
    zone.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.alpha += p.pulse;
        if (p.alpha > 1 || p.alpha < 0.1) p.pulse *= -1;
        if (p.x < bb.minX) p.x = bb.maxX;
        if (p.x > bb.maxX) p.x = bb.minX;
        if (p.y < bb.minY) p.y = bb.maxY;
        if (p.y > bb.maxY) p.y = bb.minY;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 255, 100, ${Math.max(0, p.alpha)})`;
        ctx.fill();
    });
}