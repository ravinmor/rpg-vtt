// src/engine/effectDrawer.ts
import { getBoundingBox } from '../utils/math';

// ==========================================
// TRUQUE DE MESTRE: Canvas Invisível para a Máscara
// ==========================================
const maskCanvas = document.createElement('canvas');
const maskCtx = maskCanvas.getContext('2d');

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

    // Move o centro do canvas para o centro da magia
    ctx.translate(zone.x, zone.y);

    // ==========================================
    // INÍCIO DO ISOLAMENTO DE ROTAÇÃO
    // ==========================================
    ctx.save(); 
    ctx.rotate(zone.rotation || 0);

    if (zone.video) {
        const r = zone.radius;
        const diam = r * 2;
        const vRatio = zone.video.videoWidth / zone.video.videoHeight;
        
        let drawWidth = diam, drawHeight = diam;

        if (vRatio > 1) { 
            drawWidth = drawHeight * vRatio;
        } else if (vRatio < 1) { 
            drawHeight = drawWidth / vRatio;
        }

        ctx.globalAlpha = zone.opacity ?? 0.8;
        ctx.globalCompositeOperation = 'screen'; 

        if (zone.fade) {
            let offsetX = -((drawWidth - diam) / 2);
            let offsetY = -((drawHeight - diam) / 2);

            if (maskCanvas.width !== diam) {
                maskCanvas.width = diam;
                maskCanvas.height = diam;
            } else {
                if (maskCtx) maskCtx.clearRect(0, 0, diam, diam);
            }

            if (maskCtx) {
                maskCtx.globalCompositeOperation = 'source-over';
                maskCtx.drawImage(zone.video, offsetX, offsetY, drawWidth, drawHeight);

                maskCtx.globalCompositeOperation = 'destination-in';
                const gradient = maskCtx.createRadialGradient(r, r, r * 0.5, r, r, r);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 1)'); 
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); 

                maskCtx.fillStyle = gradient;
                maskCtx.beginPath();
                maskCtx.arc(r, r, r, 0, Math.PI * 2);
                maskCtx.fill();
            }

            ctx.drawImage(maskCanvas, -r, -r);

        } else {
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.clip(); 
            
            let offsetX = -(drawWidth / 2);
            let offsetY = -(drawHeight / 2);
            
            ctx.drawImage(zone.video, offsetX, offsetY, drawWidth, drawHeight);
        }
    } 
    else {
        ctx.beginPath();
        ctx.arc(0, 0, zone.radius, 0, Math.PI * 2);
        ctx.clip();
        
        if (zone.color) {
            ctx.fillStyle = zone.color;
            ctx.globalAlpha = zone.opacity ?? 0.8;
            ctx.fill();
        }
    }
    
    // ==========================================
    // FIM DO ISOLAMENTO DE ROTAÇÃO
    // ==========================================
    ctx.restore(); // O vídeo continua girando, mas o canvas "desgira"

    // Indicadores de Seleção (Agora ficam estáticos!)
    if (editingZone === zone) {
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
        
        ctx.beginPath();
        ctx.arc(0, 0, zone.radius, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.rect(zone.radius - 5, -5, 10, 10);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function renderDrawnArea(ctx, canvas, zone, editingZone) {
    // Proteção contra caminhos inválidos
    if (!zone.path || zone.path.length < 2) return;

    // 1. Calcula os limites do desenho e as dimensões ANTES de tudo
    const bb = getBoundingBox(zone.path);
    const width = bb.maxX - bb.minX;
    const height = bb.maxY - bb.minY;

    // 2. Traça o caminho da forma desenhada
    ctx.beginPath();
    ctx.moveTo(zone.path[0].x, zone.path[0].y);
    zone.path.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath();

    // 3. Salva o contexto ANTES de cortar a área (MUITO IMPORTANTE)
    ctx.save();
    ctx.clip(); // Corta os vídeos/cores para não vazarem do desenho

    // Preenchimento interno
    ctx.globalAlpha = zone.opacity ?? 0.8;
    if (zone.video) {
        // Renderiza o vídeo usando o tamanho exato da Bounding Box (não a tela inteira)
        ctx.drawImage(zone.video, bb.minX, bb.minY, width, height);
    } else if (zone.image && zone.image.complete) {
        if (!zone.pattern) zone.pattern = ctx.createPattern(zone.image, 'repeat');
        if (zone.pattern) {
            ctx.translate(bb.minX, bb.minY);
            ctx.fillStyle = zone.pattern;
            ctx.fillRect(0, 0, width, height);
            ctx.translate(-bb.minX, -bb.minY);
        }
    } else if (zone.color) {
        ctx.fillStyle = zone.color;
        ctx.fill();
    }

    // 4. Efeito especial de Vagalumes
    if (zone.type === 'fireflies' && zone.particles) {
        renderParticles(ctx, zone);
    }

    // 5. RESTAURA o contexto para desfazer o "clip()". 
    // A partir daqui, as coisas podem ser desenhadas fora dos limites do traço.
    ctx.restore();

    // 6. Borda da área (agora com opacidade maior para você enxergar e sem ser cortada)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 7. Renderiza as Linhas e Handles de Edição se estiver selecionada
    if (editingZone === zone) {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        // Usa as coordenadas e o width/height calculados lá no começo
        ctx.strokeRect(bb.minX, bb.minY, width, height);
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        // Define as posições das 4 alças nos cantos do retângulo limite
        const handles = [
            {x: bb.minX, y: bb.minY}, {x: bb.maxX, y: bb.minY},
            {x: bb.maxX, y: bb.maxY}, {x: bb.minX, y: bb.maxY}
        ];

        handles.forEach(h => {
            ctx.beginPath();
            ctx.rect(h.x - 5, h.y - 5, 10, 10);
            ctx.fill();
            ctx.stroke();
        });
        ctx.restore();
    }
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