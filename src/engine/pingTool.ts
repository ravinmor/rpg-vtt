import { Graphics } from 'pixi.js';

export const pingState = {
    active: false,
    points: [] as { x: number, y: number, timer: number }[]
};

export function resetPings() {
    pingState.points = [];
    // Se você tiver uma camada de gráficos específica, pode limpá-la aqui também
}

export function initPing(layer: Graphics) {
    // Apenas garante que a camada comece limpa se necessário
    layer.clear();
}

export function drawPings(layer: Graphics) {
    // IMPORTANTE: Mudamos para 'add' (Aditivo). 
    // Isso faz as cores somarem com o fundo e brilharem MUITO mais, estilo sabre de luz.
    layer.blendMode = 'add'; 
    
    layer.clear();
    if (pingState.points.length === 0) return;

    // CORES CALIBRADAS PARA O MODO 'ADD':
    // Usamos um laranja mais escuro na base e um amarelo no topo para criar o degradê de fogo.
    const coreColor = 0xffffff;     // Branco absoluto (o centro da luz)
    const innerColor = 0xffcc00;    // Amarelo Ouro (o brilho quente)
    const outerColor = 0xff6600;    // Laranja Queimado (a borda da energia)
    const shadowColor = 0x000000;   // Preto (para a base de contraste)

    pingState.points.forEach((ping) => {
        ping.timer += 0.05; 
        
        // Pulsação de tamanho sutil
        const pulseRadius = 25 + Math.sin(ping.timer) * 6;
        
        // Alpha oscila entre 0.4 e 0.9 (mantém o brilho vivo)
        const baseAlpha = 0.65 + Math.sin(ping.timer) * 0.25;

        // ==========================================
        // 1. BASE DE CONTRASTE (SUB-LAYER SÓLIDA)
        // ==========================================
        // Desenha uma borda preta grossa por baixo com alpha fixo para o ping não sumir
        // em fundos muito claros, mesmo no modo 'add'.
        layer.circle(ping.x, ping.y, pulseRadius)
             .stroke({ width: 6, color: shadowColor, alpha: 0.5 });


        // ==========================================
        // 2. O ANEL DE ENERGIA EM CAMADAS (O "SABRE DE LUZ")
        // ==========================================
        // Desenhamos 3 anéis sobrepostos para criar o efeito de degradê neon.
        
        // Camada 1: Brilho Externo Laranja (Larga e suave)
        layer.circle(ping.x, ping.y, pulseRadius)
             .stroke({ width: 4, color: outerColor, alpha: baseAlpha * 0.5 });

        // Camada 2: Núcleo Quente Amarelo (Média e mais intensa)
        layer.circle(ping.x, ping.y, pulseRadius)
             .stroke({ width: 2, color: innerColor, alpha: baseAlpha * 0.8 });
             
        // Camada 3: Fio de Luz Branco (Fina e no centro das outras duas)
        // Isso cria o "strikethrough" que faz parecer energia real.
        layer.circle(ping.x, ping.y, pulseRadius)
             .stroke({ width: 0.75, color: coreColor, alpha: baseAlpha });


        // ==========================================
        // 3. PONTO CENTRAL (NÚCLEO DE FORÇA)
        // ==========================================
        // Um ponto central sólido que pulsa em opacidade, parecendo uma pequena estrela.
        
        // Aura Laranja Externa
        layer.circle(ping.x, ping.y, 6)
             .fill({ color: outerColor, alpha: baseAlpha * 0.6 });

        // Núcleo Branco Puro
        layer.circle(ping.x, ping.y, 3)
             .fill({ color: coreColor, alpha: baseAlpha });
    });
}