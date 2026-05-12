// src/engine/characterDrawer.ts

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
    ctx.fillStyle = character.color;
    ctx.arc(character.x, character.y, currentRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2 * tokenScale;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.shadowBlur = 0; // Desliga sombra para não borrar os anéis

    // 3. ANEL DE VIDA (Com bordas de contraste)
    const ringRadius = currentRadius + (10 * tokenScale);
    
    // Borda preta externa do anel (para visibilidade em fundos claros)
    ctx.beginPath();
    ctx.lineWidth = 9 * tokenScale;
    ctx.strokeStyle = '#000000';
    ctx.arc(character.x, character.y, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Fundo do anel (Cinza escuro)
    ctx.beginPath();
    ctx.lineWidth = 6 * tokenScale;
    ctx.strokeStyle = '#333333';
    ctx.arc(character.x, character.y, ringRadius, -Math.PI / 2, Math.PI * 1.5);
    ctx.stroke();

    // Barra de vida colorida
    ctx.beginPath();
    ctx.lineWidth = 6 * tokenScale;
    ctx.strokeStyle = ringColor;
    ctx.lineCap = 'round';
    ctx.arc(character.x, character.y, ringRadius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * hpRatio));
    ctx.stroke();

    // 4. NOME DO PERSONAGEM (Com Outline de alto contraste)
    const fontSize = Math.max(12, 16 * tokenScale);
    const textY = character.y - currentRadius - (25 * tokenScale);

    ctx.font = `600 ${fontSize}px 'Cinzel', serif`;
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round'; // Faz a borda do texto ser suave, não pontuda

    // Desenha a borda preta espessa primeiro
    ctx.lineWidth = 4 * tokenScale;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(character.name, character.x, textY);

    // Desenha o preenchimento branco por cima
    ctx.fillStyle = '#ffffff';
    ctx.fillText(character.name, character.x, textY);

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