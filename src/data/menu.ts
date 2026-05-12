export const menuDatabase = {
    label: 'Rituais de Campo',
    children: [
        {
            type: 'folder',
            label: 'Efeitos de Área',
            icon: '🌍',
            children: [
                { type: 'effect', id: 'fire', label: 'Fogo', icon: '🔥', videoPath: '/videos/fire.mp4' },
                { type: 'effect', id: 'poison', label: 'Veneno', icon: '🤢', videoPath: '/videos/poison.mp4' },
                { type: 'effect', id: 'ice', label: 'Gelo', icon: '❄️', videoPath: '/videos/ice.mp4' },
                { type: 'effect', id: 'darkness', label: 'Trevas', icon: '🌑', videoPath: '/videos/darkness.mp4' },
                { type: 'effect', id: 'fog', label: 'Névoa', icon: '🌫️', videoPath: '/videos/fog.mp4' },
                { type: 'effect', id: 'fireflies', label: 'Vagalumes', icon: '✨' }
            ]
        },
        // --- NOVA PASTA DE CORES E FILTROS ---
        {
            type: 'folder',
            label: 'Filtros e Cores',
            icon: '🎨',
            children: [
                { type: 'effect', id: 'color_white', label: 'Branco Sólido', icon: '⬜', color: 'rgba(255, 255, 255, 1)' },
                { type: 'effect', id: 'color_white_tp', label: 'Branco Transp.', icon: '◽', color: 'rgba(255, 255, 255, 0.4)' },
                { type: 'effect', id: 'color_black', label: 'Preto Sólido', icon: '⬛', color: 'rgba(0, 0, 0, 1)' },
                { type: 'effect', id: 'color_black_tp', label: 'Preto Transp.', icon: '▪️', color: 'rgba(0, 0, 0, 0.5)' },
                { type: 'effect', id: 'color_gold_tp', label: 'Dourado Transp.', icon: '🟡', color: 'rgba(212, 175, 55, 0.4)' },
                { type: 'effect', id: 'color_red_tp', label: 'Vermelho Transp.', icon: '🔴', color: 'rgba(255, 0, 0, 0.3)' },
                { type: 'effect', id: 'color_blue_tp', label: 'Azul Transp.', icon: '🔵', color: 'rgba(0, 0, 255, 0.3)' }
            ]
        },
        {
            type: 'folder',
            label: 'Texturas de Terreno',
            icon: '🧱',
            children: [
                { type: 'effect', id: 'terrain_wood', label: 'Madeira', icon: '🪵', imagePath: '/textures/wood_texture.jpg' },
                { type: 'effect', id: 'terrain_grass', label: 'Grama', icon: '🌿', imagePath: '/textures/grass_texture.jpg' },
                { type: 'effect', id: 'terrain_stone', label: 'Pedra', icon: '🪨', imagePath: '/textures/stone_texture.jpg' },
                { type: 'effect', id: 'terrain_water', label: 'Água', icon: '🌊', videoPath: '/textures/water_texture.mp4' }
            ]
        }
    ]
};