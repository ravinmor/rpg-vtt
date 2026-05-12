// No arquivo de UI ou menu
import { registerNewCharacter } from '../state/gameState';
import { state } from '../state/gameState';

const fileInput = document.getElementById('player-import-input') as HTMLInputElement;

if (fileInput) {
    fileInput.addEventListener('change', (event: any) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            try {
                const playerData = JSON.parse(e.target.result);
                
                // Monta o objeto seguindo o padrão que o seu sistema espera
                const newPlayer = {
                    ...playerData,
                    id: `player-${Date.now()}`, 
                    // Define uma posição inicial (pode ser o centro da tela)
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    isPlayer: true
                };

                // CHAMA A FUNÇÃO DE REGISTRO DO GAMESTATE
                registerNewCharacter(newPlayer);
                
                console.log(`Jogador ${newPlayer.name} importado com sucesso.`);

                // Força o re-render do canvas se a função estiver disponível globalmente
                if ((window as any).render) (window as any).render();
                
                fileInput.value = ''; // Reseta o input
            } catch (err) {
                console.error("Erro ao processar JSON da ficha:", err);
                alert("O arquivo JSON não está no formato correto.");
            }
        };
        reader.readAsText(file);
    });
}