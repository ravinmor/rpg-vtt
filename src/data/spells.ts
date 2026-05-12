export const spellDatabase = {
    label: 'Efeitos Individuais e Magias',
    children: [
        {
            type: 'folder',
            label: 'Efeitos Simples',
            icon: '✨',
            children: [
                { id: 'fire_burst', label: 'Explosão de Fogo', icon: '💥', radius: 80, opacity: 0.8, rotateSpeed: 0, fade: true, videoPath: '/videos/fire.mp4' },
                { id: 'poison_cloud', label: 'Nuvem Tóxica', icon: '💨', radius: 100, opacity: 0.7, rotateSpeed: 0, fade: true, videoPath: '/videos/poison.mp4' },
                { id: 'holy_spark', label: 'Brilho Sagrado', icon: '🌟', radius: 60, opacity: 0.8, rotateSpeed: 0.02, fade: true, videoPath: '/videos/holy.mp4' }
            ]
        },
        {
            type: 'folder',
            label: 'Auras e Escudos',
            icon: '🛡️',
            children: [
                { id: 'shield_spell', label: 'Escudo Arcano', icon: '💠', radius: 100, opacity: 0.6, rotateSpeed: 0, fade: true, videoPath: '/videos/shield.mp4' },
                { id: 'armor_of_agathys', label: 'Armadura de Agathys', icon: '❄️', radius: 100, opacity: 1, rotateSpeed: 0.02, fade: true, videoPath: '/videos/agathys.mp4' },
                { id: 'fire_shield', label: 'Escudo de Fogo', icon: '🔥', radius: 100, opacity: 0.8, rotateSpeed: 0, fade: false, videoPath: '/videos/fire_shield.mp4' },
                { id: 'globe_invulnerability', label: 'Globo de Invul.', icon: '🔮', radius: 100, opacity: 1, rotateSpeed: 0, fade: false, videoPath: '/videos/globe_invulnerability.mp4' },
                { id: 'antimagic_field', label: 'Campo Antimagia', icon: '🚫', radius: 100, opacity: 0.9, rotateSpeed: 0, fade: false, videoPath: '/videos/antimagic_field.mp4' },
                { id: 'aura_protection', label: 'Aura de Paladino', icon: '🛡️', radius: 100, opacity: 0.8, rotateSpeed: 0.01, fade: true, videoPath: '/videos/aura_protection.mp4' },
                { id: 'pass_without_trace', label: 'Passos S/ Pegadas', icon: '🍃', radius: 150, opacity: 0.8, rotateSpeed: 0, fade: true, videoPath: '/videos/pass_without_trace.mp4' },
                { id: 'aura_life', label: 'Aura de Vida', icon: '🍃', radius: 150, opacity: 1, rotateSpeed: 0, fade: true, videoPath: '/videos/aura_life.mp4' },
                { id: 'aura_purity', label: 'Aura de Pureza', icon: '✨', radius: 150, opacity: 1, rotateSpeed: 0.01, fade: true, videoPath: '/videos/aura_purity.mp4' },
                { id: 'aura_vitality', label: 'Aura de Vitalidade', icon: '💚', radius: 150, opacity: 1, rotateSpeed: 0.02, fade: true, videoPath: '/videos/aura_vitality.mp4' },
                { id: 'holy_aura', label: 'Aura Sagrada', icon: '🌟', radius: 150, opacity: 0.8, rotateSpeed: 0, fade: true, videoPath: '/videos/holy_aura.mp4' },
                { id: 'spirit_guardians', label: 'Espíritos Guardiões', icon: '👼', radius: 100, opacity: 1, rotateSpeed: 0, fade: true, videoPath: '/videos/spirit_guardians.mp4' },
                { id: 'crusaders_mantle', label: 'Manto do Cruzado', icon: '🗡️', radius: 100, opacity: 0.5, rotateSpeed: 0, fade: true, videoPath: '/videos/crusaders_mantle.mp4' },
                { id: 'beacon_hope', label: 'Sinal de Esperança', icon: '🕊️', radius: 100, opacity: 1, rotateSpeed: 0.01, fade: true, videoPath: '/videos/beacon_hope.mp4' },
                { id: 'circle_power', label: 'Círculo de Poder', icon: '⚡', radius: 100, opacity: 0.7, rotateSpeed: 0, fade: false, videoPath: '/videos/circle_power.mp4' },
                { id: 'antilife_shell', label: 'Carapaça Antivida', icon: '🚷', radius: 100, opacity: 1, rotateSpeed: 0.01, fade: false, videoPath: '/videos/antilife_shell.mp4' },
                { id: 'warding_wind', label: 'Vento Protetor', icon: '🌪️', radius: 100, opacity: 0.6, rotateSpeed: 0.02, fade: true, videoPath: '/videos/warding_wind.mp4' },
                { id: 'shadow_moil', label: 'Sombra de Moil', icon: '🌑', radius: 100, opacity: 0.7, rotateSpeed: 0.02, fade: true, videoPath: '/videos/shadow_moil.mp4' },
                { id: 'shield_faith', label: 'Escudo da Fé', icon: '🪬', radius: 100, opacity: 0.5, rotateSpeed: 0, fade: false, videoPath: '/videos/shield_faith.mp4' },
                { id: 'mage_armor', label: 'Armadura Arcana', icon: '👕', radius: 100, opacity: 0.3, rotateSpeed: 0, fade: false, videoPath: '/videos/mage_armor.mp4' },
                { id: 'sanctuary', label: 'Santuário', icon: '🙏', radius: 100, opacity: 0.4, rotateSpeed: 0.01, fade: false, videoPath: '/videos/sanctuary.mp4' },
                { id: 'protection_evil_good', label: 'Proteção Bem/Mal', icon: '☯️', radius: 100, opacity: 0.5, rotateSpeed: 0.02, fade: false, videoPath: '/videos/protection_evil_good.mp4' },
                { id: 'magic_circle', label: 'Círculo Mágico', icon: '🔯', radius: 150, opacity: 0.8, rotateSpeed: 0, fade: false, videoPath: '/videos/magic_circle.mp4' },
                { id: 'tiny_hut', label: 'Cabana de Leomund', icon: '⛺', radius: 150, opacity: 0.9, rotateSpeed: 0, fade: false, videoPath: '/videos/tiny_hut.mp4' },
                { id: 'resilient_sphere', label: 'Esfera Resiliente', icon: '🫧', radius: 100, opacity: 0.6, rotateSpeed: 0, fade: false, videoPath: '/videos/resilient_sphere.mp4' },
                { id: 'wall_force', label: 'Muralha de Força', icon: '🧱', radius: 200, opacity: 0.3, rotateSpeed: 0, fade: false, videoPath: '/videos/wall_force.mp4' },
                { id: 'wall_fire', label: 'Muralha de Fogo', icon: '🔥', radius: 200, opacity: 0.8, rotateSpeed: 0, fade: false, videoPath: '/videos/wall_fire.mp4' },
                { id: 'wall_ice', label: 'Muralha de Gelo', icon: '🧊', radius: 200, opacity: 0.9, rotateSpeed: 0, fade: false, videoPath: '/videos/wall_ice.mp4' },
                { id: 'wall_wind', label: 'Muralha de Vento', icon: '💨', radius: 100, opacity: 0.6, rotateSpeed: 0.02, fade: false, videoPath: '/videos/wall_wind.mp4' },
                { id: 'wall_water', label: 'Muralha de Água', icon: '🌊', radius: 200, opacity: 0.7, rotateSpeed: 0.02, fade: false, videoPath: '/videos/wall_water.mp4' },
                { id: 'wall_thorns', label: 'Muralha de Espinhos', icon: '🥀', radius: 100, opacity: 0.9, rotateSpeed: 0.002, fade: false, videoPath: '/videos/wall_thorns.mp4' },
                { id: 'wall_stone', label: 'Muralha de Pedra', icon: '🪨', radius: 200, opacity: 1.0, rotateSpeed: 0, fade: false, videoPath: '/videos/wall_stone.mp4' },
                { id: 'wall_light', label: 'Muralha de Luz', icon: '🔦', radius: 200, opacity: 0.7, rotateSpeed: 0, fade: false, videoPath: '/videos/wall_light.mp4' },
                { id: 'wall_sand', label: 'Muralha de Areia', icon: '⏳', radius: 100, opacity: 0.8, rotateSpeed: 0.02, fade: false, videoPath: '/videos/wall_sand.mp4' },
                { id: 'blade_barrier', label: 'Barreira de Lâminas', icon: '⚔️', radius: 200, opacity: 0.7, rotateSpeed: 0.1, fade: false, videoPath: '/videos/blade_barrier.mp4' },
                { id: 'prismatic_wall', label: 'Muralha Prismática', icon: '🌈', radius: 200, opacity: 0.8, rotateSpeed: 0.01, fade: false, videoPath: '/videos/prismatic_wall.mp4' },
                { id: 'storm_sphere', label: 'Esfera de Tempestade', icon: '⛈️', radius: 100, opacity: 1, rotateSpeed: 0.01, fade: true, videoPath: '/videos/storm_sphere.mp4' }
            ]
        },
        {
            type: 'folder',
            label: 'Dano em Área (AoE)',
            icon: '💥',
            children: [
                { id: 'fireball', label: 'Bola de Fogo', icon: '🔥', radius: 150, opacity: 0.9, rotateSpeed: 0, fade: true, videoPath: '/videos/fireball.mp4' },
                { id: 'shatter', label: 'Despedaçar', icon: '🔊', radius: 100, opacity: 0.8, rotateSpeed: 0, fade: true, videoPath: '/videos/shatter.mp4' },
                { id: 'ice_storm', label: 'Tempestade de Gelo', icon: '🌨️', radius: 150, opacity: 0.8, rotateSpeed: 0.02, fade: true, videoPath: '/videos/ice_storm.mp4' },
                { id: 'meteor_swarm', label: 'Chuva de Meteoros', icon: '☄️', radius: 300, opacity: 0.9, rotateSpeed: 0, fade: true, videoPath: '/videos/meteor_swarm.mp4' },
                { id: 'call_lightning', label: 'Convocar Relâmpagos', icon: '⚡', radius: 150, opacity: 0.8, rotateSpeed: 0.01, fade: true, videoPath: '/videos/call_lightning.mp4' },
                { id: 'moonbeam', label: 'Raio Lunar', icon: '🌕', radius: 60, opacity: 0.7, rotateSpeed: -0.01, fade: true, videoPath: '/videos/moonbeam.mp4' },
                { id: 'sickening_radiance', label: 'Radiação Doentia', icon: '🤢', radius: 180, opacity: 0.5, rotateSpeed: 0.03, fade: true, videoPath: '/videos/sickening_radiance.mp4' },
                { id: 'destructive_wave', label: 'Onda Destrutiva', icon: '🌊', radius: 180, opacity: 0.8, rotateSpeed: 0, fade: true, videoPath: '/videos/destructive_wave.mp4' }
            ]
        },
        {
            type: 'folder',
            label: 'Controle de Terreno',
            icon: '🕸️',
            children: [
                { id: 'web', label: 'Teia', icon: '🕸️', radius: 150, opacity: 0.7, rotateSpeed: 0, fade: true, videoPath: '/videos/web.mp4' },
                { id: 'entangle', label: 'Constrição (Raízes)', icon: '🌿', radius: 150, opacity: 0.8, rotateSpeed: 0, fade: true, videoPath: '/videos/entangle.mp4' },
                { id: 'spike_growth', label: 'Crescimento de Espinhos', icon: '🌵', radius: 150, opacity: 0.8, rotateSpeed: 0, fade: true, videoPath: '/videos/spike_growth.mp4' },
                { id: 'grease', label: 'Área Escorregadia', icon: '🛢️', radius: 100, opacity: 0.6, rotateSpeed: 0, fade: true, videoPath: '/videos/grease.mp4' },
                { id: 'evards_tentacles', label: 'Tentáculos de Evard', icon: '🐙', radius: 150, opacity: 0.85, rotateSpeed: 0.01, fade: true, videoPath: '/videos/evards_tentacles.mp4' },
                { id: 'plant_growth', label: 'Crescimento de Plantas', icon: '🌳', radius: 250, opacity: 0.8, rotateSpeed: 0, fade: true, videoPath: '/videos/plant_growth.mp4' }
            ]
        },
        {
            type: 'folder',
            label: 'Névoas e Visão',
            icon: '🌫️',
            children: [
                { id: 'fog_cloud', label: 'Névoa Obscurecente', icon: '☁️', radius: 150, opacity: 0.8, rotateSpeed: 0.005, fade: true, videoPath: '/videos/fog_cloud.mp4' },
                { id: 'stinking_cloud', label: 'Névoa Fétida', icon: '💨', radius: 150, opacity: 0.7, rotateSpeed: 0.01, fade: true, videoPath: '/videos/stinking_cloud.mp4' },
                { id: 'cloudkill', label: 'Névoa Mortal', icon: '☠️', radius: 150, opacity: 0.7, rotateSpeed: 0.015, fade: true, videoPath: '/videos/cloudkill.mp4' },
                { id: 'darkness', label: 'Escuridão', icon: '🌑', radius: 120, opacity: 0.98, rotateSpeed: 0, fade: true, videoPath: '/videos/darkness.mp4' },
                { id: 'daylight', label: 'Luz do Dia', icon: '☀️', radius: 300, opacity: 0.3, rotateSpeed: 0, fade: true, videoPath: '/videos/daylight.mp4' },
                { id: 'faerie_fire', label: 'Fogo das Fadas', icon: '✨', radius: 150, opacity: 0.5, rotateSpeed: 0.02, fade: true, videoPath: '/videos/faerie_fire.mp4' },
                { id: 'hypnotic_pattern', label: 'Padrão Hipnótico', icon: '🌀', radius: 180, opacity: 0.6, rotateSpeed: 0.05, fade: true, videoPath: '/videos/hypnotic_pattern.mp4' }
            ]
        }
    ]
};