// src/engine/characterDrawer.ts
const autoCache = {};

export function getHpRingColor(percentage) {
    if (percentage > 0.6) return '#4bdc7b';
    if (percentage > 0.3) return '#e6c84f';
    return '#d94b4b';
}

export function drawCharacter(ctx, character, tokenScale, selectedCharacter, statusIcons) {
    const currentRadius = character.radius * tokenScale;
    const hpRatio = character.maxHp > 0 ? character.hp / character.maxHp : 0;
    const ringColor = getHpRingColor(hpRatio);
    const isDisabled = character.statuses.includes('unconscious') || character.statuses.includes('dead');

    ctx.save();

    // 1. ILUMINAÇÃO DE SELEÇÃO
    if (selectedCharacter && selectedCharacter.id === character.id) {
        ctx.shadowBlur = 30 * tokenScale;
        ctx.shadowColor = 'white';
    }

    ctx.filter = isDisabled ? 'grayscale(1)' : 'none';
    ctx.globalAlpha = isDisabled ? 0.5 : 1;

    // 2. CÍRCULO BASE (TOKEN)
    ctx.beginPath();
    ctx.fillStyle = character.color || '#333';
    ctx.arc(character.x, character.y, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    // --- LÓGICA DE IMAGEM CENTRALIZADA ---
    const imgPath = character.visuals?.token_img;
    if (imgPath) {
        // Se a imagem não estiver no cache, cria o objeto e inicia o download da pasta
        if (!autoCache[imgPath]) {
            const newImg = new Image();
            newImg.src = imgPath;
            autoCache[imgPath] = newImg;
            // Opcional: newImg.onload = () => render(); // Se você tiver uma função global de render
        }

        const img = autoCache[imgPath];

        // Só desenha se o navegador já terminou de carregar o arquivo
        if (img.complete && img.width > 0) {
            ctx.save();
            // Corta a imagem em formato de círculo para caber no token
            ctx.beginPath();
            ctx.arc(character.x, character.y, currentRadius, 0, Math.PI * 2);
            ctx.clip();

            // O "Pulo do Gato" da Centralização:
            // Desenhamos começando no (Centro - Raio) com o tamanho do Diâmetro (Raio * 2)
            const size = currentRadius * 2;
            ctx.drawImage(
                img, 
                character.x - currentRadius, 
                character.y - currentRadius, 
                size, 
                size
            );
            ctx.restore();
        }
    }
    // -------------------------------------

    ctx.lineWidth = 2 * tokenScale;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.shadowBlur = 0; 

    // 3. ANEL DE VIDA
    const ringRadius = currentRadius + (10 * tokenScale);
    
    ctx.beginPath();
    ctx.lineWidth = 9 * tokenScale;
    ctx.strokeStyle = '#000000';
    ctx.arc(character.x, character.y, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 6 * tokenScale;
    ctx.strokeStyle = '#333333';
    ctx.arc(character.x, character.y, ringRadius, -Math.PI / 2, Math.PI * 1.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 6 * tokenScale;
    ctx.strokeStyle = ringColor;
    ctx.lineCap = 'round';
    ctx.arc(character.x, character.y, ringRadius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * hpRatio));
    ctx.stroke();

    // 4. NOME DO PERSONAGEM
    const fontSize = Math.max(12, 16 * tokenScale);
    const textY = character.y - currentRadius - (25 * tokenScale);

    ctx.font = `600 ${fontSize}px 'Cinzel', serif`;
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';

    ctx.lineWidth = 4 * tokenScale;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(character.name, character.x, textY);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(character.name, character.x, textY);

    // 5. ÍCONES DE STATUS
    if (statusIcons && character.statuses && character.statuses.length > 0) {
        const iconSize = 18 * tokenScale;
        const spacing = 4 * tokenScale;
        const drawableStatuses = character.statuses.filter(s => statusIcons[s]);
        
        if (drawableStatuses.length > 0) {
            const totalW = (drawableStatuses.length * iconSize) + ((drawableStatuses.length - 1) * spacing);
            const iconsY = character.y + currentRadius + (20 * tokenScale);
            let startX = character.x - (totalW / 2);

            ctx.filter = 'none';
            ctx.globalAlpha = 1;

            drawableStatuses.forEach((statusKey) => {
                const sImg = statusIcons[statusKey];
                if (sImg && sImg.complete && sImg.width > 0) {
                    ctx.shadowColor = 'black';
                    ctx.shadowBlur = 4;
                    ctx.drawImage(sImg, startX, iconsY, iconSize, iconSize);
                    ctx.shadowBlur = 0;
                    startX += iconSize + spacing;
                }
            });
        }
    }

    ctx.restore();
}

// src/engine/characterDrawer.ts

export function drawTurnHighlight(ctx, characters, tokenScale, concentrationPulse) {
    characters.forEach(char => {
        if (char.isTurn) {
            const pulse = Math.sin(concentrationPulse) * 8; 
            const currentRadius = char.radius * tokenScale;
            
            ctx.save();
            const gradient = ctx.createRadialGradient(
                char.x, char.y, currentRadius * 0.2,
                char.x, char.y, currentRadius + 50 + pulse 
            );
            
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)'); 
            gradient.addColorStop(0.3, 'rgba(240, 176, 48, 0.4)'); 
            gradient.addColorStop(1, 'rgba(240, 176, 48, 0)');    

            ctx.fillStyle = gradient;
            ctx.shadowBlur = 25 + pulse;
            ctx.shadowColor = 'rgba(240, 176, 48, 0.5)';
            
            ctx.beginPath();
            ctx.arc(char.x, char.y, currentRadius + 40 + pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });
}