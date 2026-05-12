// src/engine/renderer.ts

/**
 * Limpa o canvas e desenha o fundo
 */
export function drawBackground(ctx, canvas, backgroundAssets, currentBackground) {
    const backgroundConfig = backgroundAssets[currentBackground];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!backgroundConfig || !backgroundConfig.image) return;

    const backgroundImage = backgroundConfig.image;

    if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
        if (backgroundConfig.repeat) {
            const pattern = ctx.createPattern(backgroundImage, 'repeat');
            if (pattern) {
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        } else {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        }
    } else {
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

/**
 * Desenha o Grid de referência
 */
export function drawGrid(ctx, canvas, BASE_GRID_SIZE, gridScale) {
    ctx.save(); // Salva o estado atual do canvas
    ctx.beginPath();
    
    // Altere a cor/opacidade aqui
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; 
    
    // AUMENTE A ESPESSURA AQUI (Tente 2, 3 ou 4)
    ctx.lineWidth = 4; 

    const currentGridSize = BASE_GRID_SIZE * gridScale;
    
    for (let x = 0; x < canvas.width; x += currentGridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y < canvas.height; y += currentGridSize) {
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
    }
    
    ctx.stroke();
    ctx.restore();
}