import { Monster } from '../types/entities';

export const bestiaryDatabase: Monster[] = [
    {
      "id": "goblin_scout",
      "name": "Goblin Batedor",
      "category": "Humanoide",
      "size": "Pequeno",
      "challenge_rating": "1/4",
      "combat": {
        "hp": { "current": 7, "max": 7 },
        "ca": 15,
        "speed": "30ft",
        "initiative_mod": 2
      },
      "attributes": {
        "str": 8, "dex": 14, "con": 10,
        "int": 10, "wis": 8, "cha": 8
      },
      "visuals": {
        "token_img": "/tokens/enemies/goblin.jpg",
        "aura_preset": null,
        "scale": 0.8
      },
      "actions": [
        { "name": "Cimitarra", "mod": "+4", "damage": "1d6 + 2", "type": "Cortante" },
        { "name": "Arco Curto", "mod": "+4", "damage": "1d6 + 2", "range": "80/320ft" }
      ],
      "traits": [
        { "name": "Fuga Ágil", "desc": "Pode desengajar ou esconder como ação bônus." }
      ]
    },{
      "id": "goblin_boss",
      "name": "Chefe Goblin",
      "category": "Humanoide",
      "size": "Pequeno",
      "challenge_rating": "1",
      "combat": { "hp": { "current": 21, "max": 21 }, "ca": 17, "speed": "30ft", "initiative_mod": 2 },
      "visuals": { "token_img": "/tokens/enemies/goblin_boss.jpg", "aura_preset": null, "scale": 0.9 },
      "actions": [
        { "name": "Ataques Múltiplos", "desc": "Faz dois ataques de cimitarra." },
        { "name": "Redirecionar Ataque", "desc": "Reação: Troca de lugar com um goblin próximo para que ele receba o dano em seu lugar." }
      ]
    },
    {
      "id": "goblin_shaman",
      "name": "Xamã Goblin",
      "category": "Humanoide",
      "size": "Pequeno",
      "challenge_rating": "2",
      "combat": { "hp": { "current": 15, "max": 15 }, "ca": 13, "speed": "30ft", "initiative_mod": 1 },
      "visuals": { "token_img": "/tokens/enemies/goblin_shaman.jpg", "aura_preset": "poison_cloud", "scale": 0.8 },
      "traits": [
        { "name": "Conjuração", "desc": "Pode usar Chicote de Espinhos e Infringir Ferimentos." }
      ]
    },

    // --- ALIADOS NATURAIS ---
    {
      "id": "wolf",
      "name": "Lobo",
      "category": "Besta",
      "size": "Médio",
      "challenge_rating": "1/4",
      "combat": { "hp": { "current": 11, "max": 11 }, "ca": 13, "speed": "40ft", "initiative_mod": 2 },
      "visuals": { "token_img": "/tokens/enemies/wolf.jpg", "aura_preset": null, "scale": 1.0 },
      "traits": [
        { "name": "Táticas de Matilha", "desc": "Vantagem no ataque se houver um aliado a 1,5m do alvo." }
      ]
    },
    {
      "id": "worg",
      "name": "Worg (Montaria)",
      "category": "Abominação",
      "size": "Grande",
      "challenge_rating": "1",
      "combat": { "hp": { "current": 26, "max": 26 }, "ca": 13, "speed": "50ft", "initiative_mod": 1 },
      "visuals": { "token_img": "/tokens/enemies/worg.jpg", "aura_preset": null, "scale": 1.4 },
      "actions": [
        { "name": "Mordida", "mod": "+5", "damage": "2d6 + 3", "desc": "Se o alvo for uma criatura, deve passar em TR de Força CD 13 ou cair caído." }
      ]
    },

    // --- A FORÇA BRUTA (GOBLINOIDES) ---
    {
      "id": "bugbear",
      "name": "Bugbear",
      "category": "Humanoide",
      "size": "Médio",
      "challenge_rating": "1",
      "combat": { "hp": { "current": 27, "max": 27 }, "ca": 16, "speed": "30ft", "initiative_mod": 2 },
      "visuals": { "token_img": "/tokens/enemies/bugbear.jpg", "aura_preset": null, "scale": 1.2 },
      "traits": [
        { "name": "Emboscador", "desc": "Causa +2d6 de dano em alvos surpreendidos." },
        { "name": "Alcance Longo", "desc": "Seus ataques corpo-a-corpo têm +1,5m de alcance." }
      ]
    },
    {
      "id": "hobgoblin_captain",
      "name": "Capitão Hobgoblin",
      "category": "Humanoide",
      "size": "Médio",
      "challenge_rating": "3",
      "combat": { "hp": { "current": 39, "max": 39 }, "ca": 17, "speed": "30ft", "initiative_mod": 1 },
      "visuals": { "token_img": "/tokens/enemies/hobgoblin_cap.jpg", "aura_preset": "aura_protection", "scale": 1.1 },
      "actions": [
        { "name": "Liderança", "desc": "Dá +1d4 em ataques e salvaguardas de aliados em um raio de 9m." }
      ]
    },
    {
      "id": "beholder_eye_tyrant",
      "name": "Observador (Beholder)",
      "category": "Aberração",
      "size": "Grande",
      "challenge_rating": "13",
      "combat": {
        "hp": { "current": 180, "max": 180 },
        "ca": 18,
        "speed": "0ft, voo 20ft (estável)",
        "initiative_mod": 2
      },
      "attributes": {
        "str": 10, "dex": 14, "con": 18,
        "int": 17, "wis": 15, "cha": 17
      },
      "visuals": {
        "token_img": "/tokens/enemies/beholder.jpg",
        "aura_preset": "antimagic_field", 
        "scale": 1.5
      },
      "actions": [
        { "name": "Mordida", "mod": "+5", "damage": "4d6", "type": "Perfurante" },
        { "name": "Raios Oculares", "desc": "Dispara 3 raios aleatórios (Charme, Paralisia, Medo, etc)." }
      ],
      "traits": [
        { "name": "Cone Antimagia", "desc": "Cria um cone de 150ft de antimagia no início do turno." }
      ]
    },
    {
      "id": "lich_lord",
      "name": "Lich",
      "category": "Morto-Vivo",
      "size": "Médio",
      "challenge_rating": "21",
      "combat": {
        "hp": { "current": 135, "max": 135 },
        "ca": 17,
        "speed": "30ft",
        "initiative_mod": 3
      },
      "attributes": {
        "str": 11, "dex": 16, "con": 16,
        "int": 20, "wis": 14, "cha": 16
      },
      "visuals": {
        "token_img": "/tokens/enemies/lich.jpg",
        "aura_preset": "darkness_sphere",
        "scale": 1.0
      },
      "actions": [
        { "name": "Toque Paralisante", "mod": "+12", "damage": "3d6", "type": "Frio" },
        { "name": "Conjuração", "desc": "Pode conjurar magias de até 9º nível (Palavra de Poder: Matar)." }
      ],
      "traits": [
        { "name": "Resistência Lendária", "desc": "Pode escolher passar em um teste de resistência falho (3/dia)." }
      ]
    },
    {
        "id": "orc_berserker",
        "name": "Orc Berserker",
        "category": "Humanoide",
        "size": "Médio",
        "challenge_rating": "2",
        "combat": {
            "hp": { "current": 45, "max": 45 },
            "ca": 13,
            "speed": "30ft",
            "initiative_mod": 1
        },
        "attributes": {
            "str": 18, "dex": 12, "con": 16,
            "int": 7, "wis": 10, "cha": 8
        },
        "visuals": {
            "token_img": "/tokens/enemies/orc_berserker.jpg",
            "aura_preset": "rage",
            "scale": 1.2
        },
        "actions": [
            { "name": "Machado Grande", "mod": "+6", "damage": "1d12 + 4", "type": "Cortante" }
        ],
        "traits": [
            { "name": "Fúria Selvagem", "desc": "Recebe vantagem em ataques quando abaixo da metade da vida." }
        ]
    },
    {
    "id": "orc_war_chief",
    "name": "Chefe de Guerra Orc",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "4",
    "combat": {
        "hp": { "current": 93, "max": 93 },
        "ca": 16,
        "speed": "30ft",
        "initiative_mod": 1
    },
    "visuals": {
        "token_img": "/tokens/enemies/orc_warchief.jpg",
        "aura_preset": "battle_cry",
        "scale": 1.3
    },
    "actions": [
        { "name": "Ataques Múltiplos", "desc": "Realiza dois ataques de machado." },
        { "name": "Grito de Guerra", "desc": "Aliados orcs recebem +2 em dano até o próximo turno." }
    ]
    },
    {
    "id": "skeleton_warrior",
    "name": "Esqueleto Guerreiro",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": {
        "hp": { "current": 13, "max": 13 },
        "ca": 13,
        "speed": "30ft",
        "initiative_mod": 2
    },
    "visuals": {
        "token_img": "/tokens/enemies/skeleton.jpg",
        "aura_preset": null,
        "scale": 1.0
    },
    "actions": [
        { "name": "Espada Curta", "mod": "+4", "damage": "1d6 + 2", "type": "Perfurante" },
        { "name": "Arco Curto", "mod": "+4", "damage": "1d6 + 2", "range": "80/320ft" }
    ],
    "traits": [
        { "name": "Natureza Morta-Viva", "desc": "Imune a veneno e exaustão." }
    ]
    },
    {
    "id": "zombie_brute",
    "name": "Zumbi Brutamontes",
    "category": "Morto-Vivo",
    "size": "Grande",
    "challenge_rating": "2",
    "combat": {
        "hp": { "current": 60, "max": 60 },
        "ca": 8,
        "speed": "20ft",
        "initiative_mod": -1
    },
    "visuals": {
        "token_img": "/tokens/enemies/zombie_brute.jpg",
        "aura_preset": "disease_cloud",
        "scale": 1.5
    },
    "actions": [
        { "name": "Pancada", "mod": "+5", "damage": "2d8 + 3", "type": "Concussão" }
    ],
    "traits": [
        { "name": "Resiliência Morta-Viva", "desc": "Pode permanecer com 1 HP ao invés de cair a 0." }
    ]
    },
    {
    "id": "cultist_fanatic",
    "name": "Fanático do Culto",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "2",
    "combat": {
        "hp": { "current": 33, "max": 33 },
        "ca": 13,
        "speed": "30ft",
        "initiative_mod": 1
    },
    "visuals": {
        "token_img": "/tokens/enemies/cultist_fanatic.jpg",
        "aura_preset": "dark_prayer",
        "scale": 1.0
    },
    "actions": [
        { "name": "Adaga Ritualística", "mod": "+4", "damage": "1d4 + 2", "type": "Perfurante" },
        { "name": "Raio Sombrio", "mod": "+5", "damage": "2d8", "type": "Necrótico", "range": "60ft" }
    ],
    "traits": [
        { "name": "Conjuração Profana", "desc": "Pode conjurar Comando e Infligir Ferimentos." }
    ]
    },

    {
    "id": "mimic",
    "name": "Mímico",
    "category": "Monstruosidade",
    "size": "Médio",
    "challenge_rating": "2",
    "combat": {
        "hp": { "current": 58, "max": 58 },
        "ca": 12,
        "speed": "15ft",
        "initiative_mod": 1
    },
    "visuals": {
        "token_img": "/tokens/enemies/mimic.jpg",
        "aura_preset": "sticky_zone",
        "scale": 1.1
    },
    "actions": [
        { "name": "Pseudópode", "mod": "+5", "damage": "1d8 + 3", "type": "Concussão" },
        { "name": "Mordida", "mod": "+5", "damage": "1d8 + 3", "type": "Perfurante" }
    ],
    "traits": [
        { "name": "Forma Mutável", "desc": "Pode assumir a aparência de objetos." },
        { "name": "Adesivo", "desc": "Criaturas agarradas ficam presas ao mímico." }
    ]
    },
    {
    "id": "young_red_dragon",
    "name": "Dragão Vermelho Jovem",
    "category": "Dragão",
    "size": "Grande",
    "challenge_rating": "10",
    "combat": {
        "hp": { "current": 178, "max": 178 },
        "ca": 18,
        "speed": "40ft, voo 80ft, escalada 40ft",
        "initiative_mod": 0
    },
    "attributes": {
        "str": 23, "dex": 10, "con": 21,
        "int": 14, "wis": 11, "cha": 19
    },
    "visuals": {
        "token_img": "/tokens/enemies/red_dragon_young.jpg",
        "aura_preset": "fire_aura",
        "scale": 2.0
    },
    "actions": [
        { "name": "Mordida", "mod": "+10", "damage": "2d10 + 6", "type": "Perfurante" },
        { "name": "Sopro de Fogo", "desc": "Cone de 30ft causando 16d6 de dano de fogo." }
    ],
    "traits": [
        { "name": "Presença Aterradora", "desc": "Inimigos próximos devem resistir ou ficam amedrontados." }
    ]
    },
    {
    "id": "gelatinous_cube",
    "name": "Cubo Gelatinoso",
    "category": "Limo",
    "size": "Grande",
    "challenge_rating": "2",
    "combat": {
        "hp": { "current": 84, "max": 84 },
        "ca": 6,
        "speed": "15ft",
        "initiative_mod": -4
    },
    "visuals": {
        "token_img": "/tokens/enemies/gelatinous_cube.jpg",
        "aura_preset": "acid_pool",
        "scale": 1.8
    },
    "actions": [
        { "name": "Pseudópode", "mod": "+3", "damage": "3d6", "type": "Ácido" }
    ],
    "traits": [
        { "name": "Transparente", "desc": "Difícil de perceber quando imóvel." },
        { "name": "Engolfar", "desc": "Criaturas médias ou menores podem ser absorvidas." }
    ]
    },
    {
    "id": "vampire_spawn",
    "name": "Prole Vampírica",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "5",
    "combat": {
        "hp": { "current": 82, "max": 82 },
        "ca": 15,
        "speed": "30ft, escalada 30ft",
        "initiative_mod": 3
    },
    "visuals": {
        "token_img": "/tokens/enemies/vampire_spawn.jpg",
        "aura_preset": "blood_mist",
        "scale": 1.0
    },
    "actions": [
        { "name": "Garras", "mod": "+6", "damage": "2d4 + 3", "type": "Cortante" },
        { "name": "Mordida", "mod": "+6", "damage": "1d6 + 3", "type": "Necrótico" }
    ],
    "traits": [
        { "name": "Regeneração", "desc": "Recupera 10 HP no início do turno se não tiver sofrido dano radiante." },
        { "name": "Escalada Aracnídea", "desc": "Pode subir paredes e tetos." }
    ]
    },

    {
    "id": "zombie_rotten",
    "name": "Zumbi Putrefato",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": {
        "hp": { "current": 22, "max": 22 },
        "ca": 8,
        "speed": "20ft",
        "initiative_mod": -2
    },
    "attributes": {
        "str": 13, "dex": 6, "con": 16,
        "int": 3, "wis": 6, "cha": 5
    },
    "visuals": {
        "token_img": "/tokens/enemies/zombie.jpg",
        "aura_preset": "poison_cloud",
        "scale": 1.1
    },
    "actions": [
        { "name": "Pancada", "mod": "+3", "damage": "1d6 + 1", "type": "Contundente" }
    ],
    "traits": [
        { "name": "Fortitude Morta-Viva", "desc": "Pode permanecer com 1 HP ao invés de cair a 0." }
    ]
    },
    {
    "id": "orc_warlord",
    "name": "Senhor da Guerra Orc",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "4",
    "combat": {
        "hp": { "current": 93, "max": 93 },
        "ca": 18,
        "speed": "30ft",
        "initiative_mod": 1
    },
    "attributes": {
        "str": 19, "dex": 12, "con": 18,
        "int": 11, "wis": 11, "cha": 16
    },
    "visuals": {
        "token_img": "/tokens/enemies/orc_warlord.jpg",
        "aura_preset": "war_cry",
        "scale": 1.3
    },
    "actions": [
        { "name": "Multiataque", "desc": "Realiza dois ataques com machado de batalha." },
        { "name": "Grito de Guerra", "desc": "Aliados em 9m ganham vantagem no próximo ataque." }
    ],
    "traits": [
        { "name": "Comandante Brutal", "desc": "Orcs aliados recebem +2 em dano." }
    ]
    },
    {
    "id": "dire_wolf",
    "name": "Lobo Atroz",
    "category": "Besta",
    "size": "Grande",
    "challenge_rating": "1",
    "combat": {
        "hp": { "current": 37, "max": 37 },
        "ca": 14,
        "speed": "50ft",
        "initiative_mod": 2
    },
    "attributes": {
        "str": 17, "dex": 15, "con": 15,
        "int": 3, "wis": 12, "cha": 7
    },
    "visuals": {
        "token_img": "/tokens/enemies/dire_wolf.jpg",
        "aura_preset": null,
        "scale": 1.5
    },
    "actions": [
        { "name": "Mordida", "mod": "+5", "damage": "2d6 + 3", "type": "Perfurante" }
    ],
    "traits": [
        { "name": "Táticas de Matilha", "desc": "Vantagem em ataques com aliados adjacentes." }
    ]
    },
    {
    "id": "giant_spider",
    "name": "Aranha Gigante",
    "category": "Besta",
    "size": "Grande",
    "challenge_rating": "1",
    "combat": {
        "hp": { "current": 26, "max": 26 },
        "ca": 14,
        "speed": "30ft, escalada 30ft",
        "initiative_mod": 3
    },
    "attributes": {
        "str": 14, "dex": 16, "con": 12,
        "int": 2, "wis": 11, "cha": 4
    },
    "visuals": {
        "token_img": "/tokens/enemies/giant_spider.jpg",
        "aura_preset": "web_area",
        "scale": 1.4
    },
    "actions": [
        { "name": "Mordida Venenosa", "mod": "+5", "damage": "1d8 + 3", "type": "Veneno" },
        { "name": "Teia", "desc": "Restringe um alvo em até 30ft." }
    ],
    "traits": [
        { "name": "Escalada Aracnídea", "desc": "Anda em paredes e tetos sem testes." }
    ]
    },
    {
    "id": "mimic_chest",
    "name": "Mímico",
    "category": "Aberração",
    "size": "Médio",
    "challenge_rating": "2",
    "combat": {
        "hp": { "current": 58, "max": 58 },
        "ca": 12,
        "speed": "15ft",
        "initiative_mod": 1
    },
    "attributes": {
        "str": 17, "dex": 12, "con": 15,
        "int": 5, "wis": 13, "cha": 8
    },
    "visuals": {
        "token_img": "/tokens/enemies/mimic.jpg",
        "aura_preset": "sticky_surface",
        "scale": 1.2
    },
    "actions": [
        { "name": "Pseudópode", "mod": "+5", "damage": "1d8 + 3", "type": "Contundente" },
        { "name": "Mordida", "mod": "+5", "damage": "1d8 + 3", "type": "Perfurante" }
    ],
    "traits": [
        { "name": "Forma Falsa", "desc": "Pode assumir aparência de objeto." },
        { "name": "Adesivo", "desc": "Criaturas agarradas ficam presas ao corpo." }
    ]
    },
    {
    "id": "owlbear",
    "name": "Urso-Coruja",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "3",
    "combat": {
        "hp": { "current": 59, "max": 59 },
        "ca": 13,
        "speed": "40ft",
        "initiative_mod": 1
    },
    "attributes": {
        "str": 20, "dex": 12, "con": 17,
        "int": 3, "wis": 12, "cha": 7
    },
    "visuals": {
        "token_img": "/tokens/enemies/owlbear.jpg",
        "aura_preset": null,
        "scale": 1.6
    },
    "actions": [
        { "name": "Garras", "mod": "+7", "damage": "2d8 + 5", "type": "Cortante" },
        { "name": "Bico", "mod": "+7", "damage": "1d10 + 5", "type": "Perfurante" }
    ],
    "traits": [
        { "name": "Olfato Aguçado", "desc": "Vantagem em testes de Percepção relacionados ao olfato." }
    ]
    },
    {
    "id": "mind_flayer",
    "name": "Devorador de Mentes",
    "category": "Aberração",
    "size": "Médio",
    "challenge_rating": "7",
    "combat": {
        "hp": { "current": 71, "max": 71 },
        "ca": 15,
        "speed": "30ft",
        "initiative_mod": 4
    },
    "attributes": {
        "str": 11, "dex": 12, "con": 12,
        "int": 19, "wis": 17, "cha": 17
    },
    "visuals": {
        "token_img": "/tokens/enemies/mind_flayer.jpg",
        "aura_preset": "psychic_field",
        "scale": 1.1
    },
    "actions": [
        { "name": "Tentáculos", "mod": "+7", "damage": "2d10 + 4", "type": "Psíquico" },
        { "name": "Explosão Mental", "desc": "Cone psíquico de 60ft que atordoa criaturas." }
    ],
    "traits": [
        { "name": "Resistência Mágica", "desc": "Vantagem contra magias e efeitos mágicos." }
    ]
    },
    {
    "id": "gnoll_raider",
    "name": "Saqueador Gnoll",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1/2",
    "combat": {
        "hp": { "current": 22, "max": 22 },
        "ca": 15,
        "speed": "30ft",
        "initiative_mod": 2
    },
    "attributes": {
        "str": 14, "dex": 14, "con": 12,
        "int": 6, "wis": 10, "cha": 7
    },
    "visuals": {
        "token_img": "/tokens/enemies/gnoll_raider.jpg",
        "aura_preset": null,
        "scale": 1.1
    },
    "actions": [
        { "name": "Lança", "mod": "+4", "damage": "1d6 + 2", "type": "Perfurante" },
        { "name": "Arco Longo", "mod": "+4", "damage": "1d8 + 2", "range": "150/600ft" }
    ],
    "traits": [
        { "name": "Frenesi Sangrento", "desc": "Pode fazer um ataque bônus ao derrubar um inimigo." }
    ]
    },
    {
    "id": "minotaur",
    "name": "Minotauro",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "3",
    "combat": {
        "hp": { "current": 76, "max": 76 },
        "ca": 14,
        "speed": "40ft",
        "initiative_mod": 0
    },
    "attributes": {
        "str": 18, "dex": 11, "con": 16,
        "int": 6, "wis": 16, "cha": 9
    },
    "visuals": {
        "token_img": "/tokens/enemies/minotaur.jpg",
        "aura_preset": "charge_path",
        "scale": 1.7
    },
    "actions": [
        { "name": "Machado Grande", "mod": "+6", "damage": "2d12 + 4", "type": "Cortante" },
        { "name": "Chifrada", "mod": "+6", "damage": "2d8 + 4", "type": "Perfurante" }
    ],
    "traits": [
        { "name": "Investida", "desc": "Após correr 3m em linha reta, causa dano extra com chifrada." }
    ]
    },
    {
    "id": "harpy",
    "name": "Harpia",
    "category": "Monstruosidade",
    "size": "Médio",
    "challenge_rating": "1",
    "combat": {
        "hp": { "current": 38, "max": 38 },
        "ca": 11,
        "speed": "20ft, voo 40ft",
        "initiative_mod": 1
    },
    "attributes": {
        "str": 12, "dex": 13, "con": 12,
        "int": 7, "wis": 10, "cha": 13
    },
    "visuals": {
        "token_img": "/tokens/enemies/harpy.jpg",
        "aura_preset": "charm_song",
        "scale": 1.1
    },
    "actions": [
        { "name": "Garras", "mod": "+3", "damage": "2d4 + 1", "type": "Cortante" },
        { "name": "Clava", "mod": "+3", "damage": "1d4 + 1", "type": "Contundente" }
    ],
    "traits": [
        { "name": "Canção Hipnótica", "desc": "Criaturas próximas devem resistir ou caminham em direção à harpia." }
    ]
    },
    {
    "id": "basilisk",
    "name": "Basilisco",
    "category": "Monstruosidade",
    "size": "Médio",
    "challenge_rating": "3",
    "combat": {
        "hp": { "current": 52, "max": 52 },
        "ca": 15,
        "speed": "20ft",
        "initiative_mod": -1
    },
    "attributes": {
        "str": 16, "dex": 8, "con": 15,
        "int": 2, "wis": 8, "cha": 7
    },
    "visuals": {
        "token_img": "/tokens/enemies/basilisk.jpg",
        "aura_preset": "petrification_gaze",
        "scale": 1.4
    },
    "actions": [
        { "name": "Mordida", "mod": "+5", "damage": "2d6 + 3", "type": "Perfurante" }
    ],
    "traits": [
        { "name": "Olhar Petrificante", "desc": "Criaturas que olham diretamente devem resistir ou começam a virar pedra." }
    ]
    },
    {
    "id": "shadow",
    "name": "Sombra",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "1/2",
    "combat": {
        "hp": { "current": 16, "max": 16 },
        "ca": 12,
        "speed": "40ft",
        "initiative_mod": 2
    },
    "attributes": {
        "str": 6, "dex": 14, "con": 13,
        "int": 6, "wis": 10, "cha": 8
    },
    "visuals": {
        "token_img": "/tokens/enemies/shadow.jpg",
        "aura_preset": "darkness_aura",
        "scale": 1.0
    },
    "actions": [
        { "name": "Toque Sombrio", "mod": "+4", "damage": "2d6 + 2", "type": "Necrótico" }
    ],
    "traits": [
        { "name": "Dreno de Força", "desc": "O alvo perde 1d4 de Força temporariamente." },
        { "name": "Furtividade Sombria", "desc": "Vantagem em furtividade em áreas escuras." }
    ]
    },
    {
    "id": "animated_armor",
    "name": "Armadura Animada",
    "category": "Constructo",
    "size": "Médio",
    "challenge_rating": "1",
    "combat": {
        "hp": { "current": 33, "max": 33 },
        "ca": 18,
        "speed": "25ft",
        "initiative_mod": 0
    },
    "attributes": {
        "str": 14, "dex": 11, "con": 13,
        "int": 1, "wis": 3, "cha": 1
    },
    "visuals": {
        "token_img": "/tokens/enemies/animated_armor.jpg",
        "aura_preset": null,
        "scale": 1.1
    },
    "actions": [
        { "name": "Soco", "mod": "+4", "damage": "1d6 + 2", "type": "Contundente" }
    ],
    "traits": [
        { "name": "Natureza Constructa", "desc": "Imune a veneno, exaustão e medo." }
    ]
    },
    {
    "id": "gargoyle",
    "name": "Gárgula",
    "category": "Elemental",
    "size": "Médio",
    "challenge_rating": "2",
    "combat": {
        "hp": { "current": 52, "max": 52 },
        "ca": 15,
        "speed": "30ft, voo 60ft",
        "initiative_mod": 0
    },
    "attributes": {
        "str": 15, "dex": 11, "con": 16,
        "int": 6, "wis": 11, "cha": 7
    },
    "visuals": {
        "token_img": "/tokens/enemies/gargoyle.jpg",
        "aura_preset": "stone_skin",
        "scale": 1.2
    },
    "actions": [
        { "name": "Garras", "mod": "+4", "damage": "1d6 + 2", "type": "Cortante" },
        { "name": "Mordida", "mod": "+4", "damage": "1d6 + 2", "type": "Perfurante" }
    ],
    "traits": [
        { "name": "Falsa Aparência", "desc": "Permanece imóvel parecendo uma estátua." }
    ]
    },
    {
    "id": "treant",
    "name": "Ent",
    "category": "Planta",
    "size": "Enorme",
    "challenge_rating": "9",
    "combat": {
        "hp": { "current": 138, "max": 138 },
        "ca": 16,
        "speed": "30ft",
        "initiative_mod": -1
    },
    "attributes": {
        "str": 23, "dex": 8, "con": 21,
        "int": 12, "wis": 16, "cha": 12
    },
    "visuals": {
        "token_img": "/tokens/enemies/treant.jpg",
        "aura_preset": "root_zone",
        "scale": 2.2
    },
    "actions": [
        { "name": "Esmagar", "mod": "+10", "damage": "3d6 + 6", "type": "Contundente" },
        { "name": "Pedra Arremessada", "mod": "+10", "damage": "4d10 + 6", "range": "60/180ft" }
    ],
    "traits": [
        { "name": "Animar Árvores", "desc": "Pode despertar árvores próximas para lutar." }
    ]
    },
    {
    "id": "wyvern",
    "name": "Mantícora Alada",
    "category": "Dragão",
    "size": "Grande",
    "challenge_rating": "6",
    "combat": {
        "hp": { "current": 110, "max": 110 },
        "ca": 13,
        "speed": "20ft, voo 80ft",
        "initiative_mod": 0
    },
    "attributes": {
        "str": 19, "dex": 10, "con": 16,
        "int": 5, "wis": 12, "cha": 6
    },
    "visuals": {
        "token_img": "/tokens/enemies/wyvern.jpg",
        "aura_preset": "poison_tail",
        "scale": 1.9
    },
    "actions": [
        { "name": "Mordida", "mod": "+7", "damage": "2d6 + 4", "type": "Perfurante" },
        { "name": "Ferrão", "mod": "+7", "damage": "2d6 + 4", "type": "Perfurante" }
    ],
    "traits": [
        { "name": "Veneno Mortal", "desc": "Ferrão causa 7d6 de dano venenoso adicional." }
    ]
    },
    {
    "id": "aboleth",
    "name": "Abolete",
    "category": "Aberração",
    "size": "Grande",
    "challenge_rating": "10",
    "combat": {
        "hp": { "current": 135, "max": 135 },
        "ca": 17,
        "speed": "10ft, natação 40ft",
        "initiative_mod": 0
    },
    "attributes": {
        "str": 21, "dex": 9, "con": 15,
        "int": 18, "wis": 15, "cha": 18
    },
    "visuals": {
        "token_img": "/tokens/enemies/aboleth.jpg",
        "aura_preset": "mind_control",
        "scale": 2.0
    },
    "actions": [
        { "name": "Tentáculo", "mod": "+9", "damage": "2d6 + 5", "type": "Contundente" },
        { "name": "Cauda", "mod": "+9", "damage": "3d6 + 5", "type": "Contundente" }
    ],
    "traits": [
        { "name": "Escravizar", "desc": "Pode dominar mentalmente uma criatura." },
        { "name": "Muco Aquático", "desc": "Criaturas afetadas só conseguem respirar na água." }
    ]
    },
    {
    "id": "drow_assassin",
    "name": "Assassino Drow",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "5",
    "combat": {
        "hp": { "current": 78, "max": 78 },
        "ca": 15,
        "speed": "30ft",
        "initiative_mod": 4
    },
    "attributes": {
        "str": 10, "dex": 18, "con": 14,
        "int": 13, "wis": 12, "cha": 14
    },
    "visuals": {
        "token_img": "/tokens/enemies/drow_assassin.jpg",
        "aura_preset": "shadowstep",
        "scale": 1.0
    },
    "actions": [
        { "name": "Espada Curta Envenenada", "mod": "+7", "damage": "1d6 + 4", "type": "Perfurante" },
        { "name": "Besta de Mão", "mod": "+7", "damage": "1d6 + 4", "range": "30/120ft" }
    ],
    "traits": [
        { "name": "Ataque Furtivo", "desc": "Causa +4d6 de dano em ataques com vantagem." },
        { "name": "Sensibilidade à Luz Solar", "desc": "Desvantagem em ataques sob luz solar direta." }
    ]
    },
    {
    "id": "ettercap",
    "name": "Ettercap",
    "category": "Monstruosidade",
    "size": "Médio",
    "challenge_rating": "2",
    "combat": {
        "hp": { "current": 44, "max": 44 },
        "ca": 13,
        "speed": "30ft, escalada 30ft",
        "initiative_mod": 2
    },
    "attributes": {
        "str": 14, "dex": 15, "con": 13,
        "int": 7, "wis": 12, "cha": 8
    },
    "visuals": {
        "token_img": "/tokens/enemies/ettercap.jpg",
        "aura_preset": "web_trap",
        "scale": 1.2
    },
    "actions": [
        { "name": "Garras", "mod": "+4", "damage": "2d4 + 2", "type": "Cortante" },
        { "name": "Mordida Venenosa", "mod": "+4", "damage": "1d8 + 2", "type": "Veneno" }
    ],
    "traits": [
        { "name": "Criador de Teias", "desc": "Pode criar áreas de teia difíceis de atravessar." }
    ]
    },
    {
    "id": "yuan_ti_malison",
    "name": "Yuan-ti Malison",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "3",
    "combat": {
        "hp": { "current": 66, "max": 66 },
        "ca": 12,
        "speed": "30ft",
        "initiative_mod": 3
    },
    "attributes": {
        "str": 16, "dex": 14, "con": 13,
        "int": 14, "wis": 12, "cha": 14
    },
    "visuals": {
        "token_img": "/tokens/enemies/yuan_ti_malison.jpg",
        "aura_preset": "snake_poison",
        "scale": 1.1
    },
    "actions": [
        { "name": "Cimitarra", "mod": "+5", "damage": "1d6 + 3", "type": "Cortante" },
        { "name": "Arco Longo", "mod": "+5", "damage": "1d8 + 3", "range": "150/600ft" }
    ],
    "traits": [
        { "name": "Resistência Mágica", "desc": "Vantagem contra magias e efeitos mágicos." },
        { "name": "Sangue Serpentino", "desc": "Imune a veneno." }
    ]
    },
    {
    "id": "umber_hulk",
    "name": "Hulk Umber",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "5",
    "combat": {
        "hp": { "current": 93, "max": 93 },
        "ca": 18,
        "speed": "30ft, escavação 20ft",
        "initiative_mod": 0
    },
    "attributes": {
        "str": 20, "dex": 13, "con": 16,
        "int": 9, "wis": 10, "cha": 10
    },
    "visuals": {
        "token_img": "/tokens/enemies/umber_hulk.jpg",
        "aura_preset": "confusion_gaze",
        "scale": 1.8
    },
    "actions": [
        { "name": "Garras", "mod": "+8", "damage": "2d8 + 5", "type": "Cortante" },
        { "name": "Mandíbulas", "mod": "+8", "damage": "2d10 + 5", "type": "Perfurante" }
    ],
    "traits": [
        { "name": "Olhar Confuso", "desc": "Criaturas próximas podem ficar confusas ao olhar para ele." }
    ]
    },
    {
    "id": "banshee",
    "name": "Banshee",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "4",
    "combat": {
        "hp": { "current": 58, "max": 58 },
        "ca": 12,
        "speed": "0ft, voo 40ft",
        "initiative_mod": 2
    },
    "attributes": {
        "str": 1, "dex": 14, "con": 10,
        "int": 12, "wis": 11, "cha": 17
    },
    "visuals": {
        "token_img": "/tokens/enemies/banshee.jpg",
        "aura_preset": "fear_aura",
        "scale": 1.1
    },
    "actions": [
        { "name": "Toque Corruptor", "mod": "+4", "damage": "3d6", "type": "Necrótico" }
    ],
    "traits": [
        { "name": "Lamento Mortal", "desc": "Criaturas próximas fazem TR ou caem a 0 HP." },
        { "name": "Incorpórea", "desc": "Pode atravessar objetos e criaturas." }
    ]
    },
    {
    "id": "fire_elemental",
    "name": "Elemental do Fogo",
    "category": "Elemental",
    "size": "Grande",
    "challenge_rating": "5",
    "combat": {
        "hp": { "current": 102, "max": 102 },
        "ca": 13,
        "speed": "50ft",
        "initiative_mod": 3
    },
    "attributes": {
        "str": 10, "dex": 17, "con": 16,
        "int": 6, "wis": 10, "cha": 7
    },
    "visuals": {
        "token_img": "/tokens/enemies/fire_elemental.jpg",
        "aura_preset": "burning_aura",
        "scale": 1.8
    },
    "actions": [
        { "name": "Toque Flamejante", "mod": "+6", "damage": "2d6 + 3", "type": "Fogo" }
    ],
    "traits": [
        { "name": "Corpo de Fogo", "desc": "Criaturas que tocam o elemental sofrem dano de fogo." },
        { "name": "Iluminação Intensa", "desc": "Emite luz intensa em 30ft." }
    ]
    },
    {
    "id": "water_elemental",
    "name": "Elemental da Água",
    "category": "Elemental",
    "size": "Grande",
    "challenge_rating": "5",
    "combat": {
        "hp": { "current": 114, "max": 114 },
        "ca": 14,
        "speed": "30ft, natação 90ft",
        "initiative_mod": 2
    },
    "attributes": {
        "str": 18, "dex": 14, "con": 18,
        "int": 5, "wis": 10, "cha": 8
    },
    "visuals": {
        "token_img": "/tokens/enemies/water_elemental.jpg",
        "aura_preset": "tidal_wave",
        "scale": 1.9
    },
    "actions": [
        { "name": "Golpe Aquático", "mod": "+7", "damage": "2d8 + 4", "type": "Contundente" }
    ],
    "traits": [
        { "name": "Engolfar", "desc": "Pode prender criaturas dentro de seu corpo líquido." }
    ]
    },
    {
    "id": "earth_elemental",
    "name": "Elemental da Terra",
    "category": "Elemental",
    "size": "Grande",
    "challenge_rating": "5",
    "combat": {
        "hp": { "current": 126, "max": 126 },
        "ca": 17,
        "speed": "30ft",
        "initiative_mod": -1
    },
    "attributes": {
        "str": 20, "dex": 8, "con": 20,
        "int": 5, "wis": 10, "cha": 5
    },
    "visuals": {
        "token_img": "/tokens/enemies/earth_elemental.jpg",
        "aura_preset": "stone_quake",
        "scale": 2.0
    },
    "actions": [
        { "name": "Slam", "mod": "+8", "damage": "2d8 + 5", "type": "Contundente" }
    ],
    "traits": [
        { "name": "Passagem Terrestre", "desc": "Pode atravessar pedra e terra não trabalhadas." }
    ]
    },
    {
    "id": "air_elemental",
    "name": "Elemental do Ar",
    "category": "Elemental",
    "size": "Grande",
    "challenge_rating": "5",
    "combat": {
        "hp": { "current": 90, "max": 90 },
        "ca": 15,
        "speed": "0ft, voo 90ft",
        "initiative_mod": 5
    },
    "attributes": {
        "str": 14, "dex": 20, "con": 14,
        "int": 6, "wis": 10, "cha": 6
    },
    "visuals": {
        "token_img": "/tokens/enemies/air_elemental.jpg",
        "aura_preset": "wind_vortex",
        "scale": 1.9
    },
    "actions": [
        { "name": "Golpe de Vendaval", "mod": "+8", "damage": "2d8 + 5", "type": "Contundente" }
    ],
    "traits": [
        { "name": "Redemoinho", "desc": "Pode criar um tornado que arremessa criaturas." }
    ]
    },
    {
    "id": "night_hag",
    "name": "Bruxa da Noite",
    "category": "Corruptor",
    "size": "Médio",
    "challenge_rating": "5",
    "combat": {
        "hp": { "current": 112, "max": 112 },
        "ca": 17,
        "speed": "30ft",
        "initiative_mod": 2
    },
    "attributes": {
        "str": 18, "dex": 15, "con": 16,
        "int": 16, "wis": 14, "cha": 16
    },
    "visuals": {
        "token_img": "/tokens/enemies/night_hag.jpg",
        "aura_preset": "nightmare_mist",
        "scale": 1.1
    },
    "actions": [
        { "name": "Garras", "mod": "+7", "damage": "2d8 + 4", "type": "Necrótico" }
    ],
    "traits": [
        { "name": "Caminhar Etéreo", "desc": "Pode entrar e sair do Plano Etéreo." },
        { "name": "Pesadelo", "desc": "Assombra criaturas durante o sono." }
    ]
    },{
    "id": "aarakocra",
    "name": "Aarakocra",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": {
      "hp": { "current": 13, "max": 13 },
      "ca": 12,
      "speed": "20ft, voo 50ft",
      "initiative_mod": 2
    },
    "attributes": {
      "str": 10, "dex": 14, "con": 10,
      "int": 11, "wis": 12, "cha": 11
    },
    "visuals": {
      "token_img": "/tokens/enemies/aarakocra.jpg",
      "aura_preset": null,
      "scale": 1.0
    },
    "actions": [
      { "name": "Garras", "mod": "+4", "damage": "1d4 + 2", "type": "Cortante" },
      { "name": "Zagaia", "mod": "+4", "damage": "1d6 + 2", "range": "30/120ft" }
    ],
    "traits": [
      { "name": "Mergulho de Ataque", "desc": "Se mergulhar 9m e atingir ataque corpo-a-corpo, causa +1d6 de dano." }
    ]
  },
  {
    "id": "acolyte",
    "name": "Acólito",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": {
      "hp": { "current": 9, "max": 9 },
      "ca": 10,
      "speed": "30ft",
      "initiative_mod": 0
    },
    "attributes": {
      "str": 10, "dex": 10, "con": 10,
      "int": 10, "wis": 14, "cha": 11
    },
    "visuals": {
      "token_img": "/tokens/enemies/acolyte.jpg",
      "aura_preset": null,
      "scale": 1.0
    },
    "actions": [
      { "name": "Clava", "mod": "+2", "damage": "1d4", "type": "Concussão" },
      { "name": "Conjuração", "desc": "Pode conjurar Truques, Bênção e Curar Ferimentos." }
    ],
    "traits": []
  },
  {
    "id": "ancient_black_dragon",
    "name": "Dragão Negro Ancião",
    "category": "Dragão",
    "size": "Gargantuesco",
    "challenge_rating": "21",
    "combat": {
      "hp": { "current": 367, "max": 367 },
      "ca": 22,
      "speed": "40ft, voo 80ft, natação 40ft",
      "initiative_mod": 2
    },
    "attributes": {
      "str": 27, "dex": 14, "con": 25,
      "int": 16, "wis": 15, "cha": 19
    },
    "visuals": {
      "token_img": "/tokens/enemies/black_dragon.jpg",
      "aura_preset": "acid_aura",
      "scale": 2.5
    },
    "actions": [
      { "name": "Multiataque", "desc": "Faz três ataques: uma mordida e duas garras." },
      { "name": "Sopro Ácido", "desc": "Linha de 27m causando 15d8 de dano ácido." }
    ],
    "traits": [
      { "name": "Anfíbio", "desc": "Pode respirar ar e água." },
      { "name": "Resistência Lendária", "desc": "Pode escolher passar em TR falho (3/dia)." }
    ]
  },
  {
    "id": "ancient_blue_dragon",
    "name": "Dragão Azul Ancião",
    "category": "Dragão",
    "size": "Gargantuesco",
    "challenge_rating": "23",
    "combat": {
      "hp": { "current": 481, "max": 481 },
      "ca": 22,
      "speed": "40ft, voo 80ft, escavação 40ft",
      "initiative_mod": 0
    },
    "attributes": {
      "str": 29, "dex": 10, "con": 27,
      "int": 18, "wis": 17, "cha": 21
    },
    "visuals": {
      "token_img": "/tokens/enemies/blue_dragon.jpg",
      "aura_preset": "lightning_aura",
      "scale": 2.5
    },
    "actions": [
      { "name": "Mordida", "mod": "+16", "damage": "2d10 + 9 + 2d6 relâmpago" },
      { "name": "Sopro Elétrico", "desc": "Linha de 36m causando 16d10 de dano elétrico." }
    ],
    "traits": [
      { "name": "Resistência Lendária", "desc": "Pode escolher passar em TR falho (3/dia)." }
    ]
  },
  {
    "id": "androsphinx",
    "name": "Androsfinge",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "17",
    "combat": {
      "hp": { "current": 199, "max": 199 },
      "ca": 17,
      "speed": "40ft, voo 60ft",
      "initiative_mod": 0
    },
    "attributes": {
      "str": 22, "dex": 10, "con": 20,
      "int": 16, "wis": 18, "cha": 23
    },
    "visuals": {
      "token_img": "/tokens/enemies/androsphinx.jpg",
      "aura_preset": "divine_protection",
      "scale": 1.5
    },
    "actions": [
      { "name": "Garras", "mod": "+12", "damage": "2d10 + 6", "type": "Psíquico" },
      { "name": "Rugido", "desc": "Provoca medo, paralisia ou atordoamento em massa." }
    ],
    "traits": [
      { "name": "Mente Impenetrável", "desc": "Imune a ser enfeitiçado ou amedrontado." },
      { "name": "Conjuração", "desc": "Pode conjurar magias de clérigo de até 6º nível." }
    ]
  },
  {
    "id": "ankylosaurus",
    "name": "Anquilossauro",
    "category": "Besta",
    "size": "Enorme",
    "challenge_rating": "3",
    "combat": {
      "hp": { "current": 68, "max": 68 },
      "ca": 15,
      "speed": "30ft",
      "initiative_mod": 0
    },
    "attributes": {
      "str": 19, "dex": 11, "con": 15,
      "int": 2, "wis": 12, "cha": 5
    },
    "visuals": {
      "token_img": "/tokens/enemies/ankylosaurus.jpg",
      "aura_preset": null,
      "scale": 2.2
    },
    "actions": [
      { "name": "Cauda", "mod": "+7", "damage": "4d6 + 4", "desc": "Se o alvo for uma criatura, deve passar em TR Força CD 14 ou cair caído." }
    ],
    "traits": []
  },
  {
    "id": "arcanaloth",
    "name": "Arcanaloth",
    "category": "Corruptor",
    "size": "Médio",
    "challenge_rating": "12",
    "combat": {
      "hp": { "current": 104, "max": 104 },
      "ca": 17,
      "speed": "30ft, voo 30ft",
      "initiative_mod": 1
    },
    "attributes": {
      "str": 17, "dex": 12, "con": 14,
      "int": 20, "wis": 16, "cha": 17
    },
    "visuals": {
      "token_img": "/tokens/enemies/arcanaloth.jpg",
      "aura_preset": "magic_shield",
      "scale": 1.0
    },
    "actions": [
      { "name": "Garras", "mod": "+7", "damage": "2d4 + 3", "type": "Veneno" },
      { "name": "Conjuração", "desc": "Pode conjurar Magias de até 8º nível (Dedo da Morte)." }
    ],
    "traits": [
      { "name": "Resistência Mágica", "desc": "Vantagem contra magias e efeitos mágicos." }
    ]
  },
  {
    "id": "archmage",
    "name": "Arquimago",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "12",
    "combat": {
      "hp": { "current": 99, "max": 99 },
      "ca": 12,
      "speed": "30ft",
      "initiative_mod": 2
    },
    "attributes": {
      "str": 10, "dex": 14, "con": 12,
      "int": 20, "wis": 15, "cha": 16
    },
    "visuals": {
      "token_img": "/tokens/enemies/archmage.jpg",
      "aura_preset": "arcane_barrier",
      "scale": 1.0
    },
    "actions": [
      { "name": "Cajado", "mod": "+6", "damage": "1d6 + 2" },
      { "name": "Conjuração", "desc": "Pode conjurar Parar o Tempo e Cone de Frio." }
    ],
    "traits": [
      { "name": "Resistência Mágica", "desc": "Vantagem contra magias e efeitos mágicos." }
    ]
  },
  {
    "id": "barbed_devil",
    "name": "Diabo Farpado",
    "category": "Corruptor",
    "size": "Médio",
    "challenge_rating": "5",
    "combat": {
      "hp": { "current": 110, "max": 110 },
      "ca": 15,
      "speed": "30ft",
      "initiative_mod": 3
    },
    "attributes": {
      "str": 16, "dex": 17, "con": 18,
      "int": 12, "wis": 14, "cha": 14
    },
    "visuals": {
      "token_img": "/tokens/enemies/barbed_devil.jpg",
      "aura_preset": "barbed_skin",
      "scale": 1.1
    },
    "actions": [
      { "name": "Multiataque", "desc": "Três ataques: um com garra, um com cauda e um com pancada." },
      { "name": "Arremessar Chama", "mod": "+6", "damage": "3d6", "type": "Fogo" }
    ],
    "traits": [
      { "name": "Pele Farpada", "desc": "Criaturas que o agarram sofrem 1d10 de dano perfurante." }
    ]
  },
  {
    "id": "barlgura",
    "name": "Barlgura",
    "category": "Corruptor",
    "size": "Grande",
    "challenge_rating": "5",
    "combat": {
      "hp": { "current": 68, "max": 68 },
      "ca": 15,
      "speed": "40ft, escalada 40ft",
      "initiative_mod": 2
    },
    "attributes": {
      "str": 18, "dex": 15, "con": 16,
      "int": 7, "wis": 14, "cha": 9
    },
    "visuals": {
      "token_img": "/tokens/enemies/barlgura.jpg",
      "aura_preset": null,
      "scale": 1.5
    },
    "actions": [
      { "name": "Mordida", "mod": "+7", "damage": "2d6 + 4" },
      { "name": "Punhos", "mod": "+7", "damage": "1d10 + 4" }
    ],
    "traits": [
      { "name": "Salto Permanente", "desc": "Sua distância de salto é triplicada." }
    ]
  },{
    "id": "ancient_brass_dragon",
    "name": "Dragão de Latão Ancião",
    "category": "Dragão",
    "size": "Gargantuesco",
    "challenge_rating": "20",
    "combat": { "hp": { "current": 297, "max": 297 }, "ca": 20, "speed": "40ft, voo 80ft, escavação 40ft", "initiative_mod": 0 },
    "attributes": { "str": 27, "dex": 10, "con": 25, "int": 16, "wis": 15, "cha": 19 },
    "visuals": { "token_img": "/tokens/enemies/ancient_brass_dragon.jpg", "aura_preset": "heat_haze", "scale": 2.5 },
    "actions": [
      { "name": "Sopro de Fogo", "desc": "Linha de 27m causando 16d6 de dano de fogo." },
      { "name": "Sopro de Sono", "desc": "Cone de 27m, criaturas devem passar em TR de CON ou caem inconscientes." }
    ],
    "traits": [{ "name": "Resistência Lendária", "desc": "Pode escolher passar em TR falho (3/dia)." }]
  },
  {
    "id": "ancient_gold_dragon",
    "name": "Dragão de Ouro Ancião",
    "category": "Dragão",
    "size": "Gargantuesco",
    "challenge_rating": "24",
    "combat": { "hp": { "current": 546, "max": 546 }, "ca": 22, "speed": "40ft, voo 80ft, natação 40ft", "initiative_mod": 2 },
    "attributes": { "str": 30, "dex": 14, "con": 29, "int": 18, "wis": 17, "cha": 28 },
    "visuals": { "token_img": "/tokens/enemies/ancient_gold_dragon.jpg", "aura_preset": "holy_aura", "scale": 3.0 },
    "actions": [
      { "name": "Sopro de Fogo", "desc": "Cone de 27m causando 13d10 de dano de fogo." },
      { "name": "Sopro de Enfraquecimento", "desc": "Criaturas no cone tem desvantagem em jogadas de Força." }
    ],
    "traits": [{ "name": "Anfíbio", "desc": "Pode respirar ar e água." }]
  },
  {
    "id": "ancient_silver_dragon",
    "name": "Dragão de Prata Ancião",
    "category": "Dragão",
    "size": "Gargantuesco",
    "challenge_rating": "23",
    "combat": { "hp": { "current": 487, "max": 487 }, "ca": 22, "speed": "40ft, voo 80ft", "initiative_mod": 0 },
    "attributes": { "str": 30, "dex": 10, "con": 29, "int": 18, "wis": 15, "cha": 23 },
    "visuals": { "token_img": "/tokens/enemies/ancient_silver_dragon.jpg", "aura_preset": "cold_aura", "scale": 2.5 },
    "actions": [
      { "name": "Sopro de Frio", "desc": "Cone de 27m causando 15d8 de dano de frio." },
      { "name": "Sopro de Paralisia", "desc": "Criaturas no cone devem passar em TR de CON ou ficam paralisadas." }
    ],
    "traits": [{ "name": "Caminhar nas Nuvens", "desc": "Pode andar sobre nuvens ou névoa como se fosse solo sólido." }]
  },
  {
    "id": "azer",
    "name": "Azer",
    "category": "Elemental",
    "size": "Médio",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 39, "max": 39 }, "ca": 17, "speed": "30ft", "initiative_mod": 1 },
    "attributes": { "str": 17, "dex": 12, "con": 15, "int": 12, "wis": 13, "cha": 10 },
    "visuals": { "token_img": "/tokens/enemies/azer.jpg", "aura_preset": "burning_aura", "scale": 1.0 },
    "actions": [{ "name": "Martelo de Guerra", "mod": "+5", "damage": "1d8 + 3 + 1d6 fogo" }],
    "traits": [{ "name": "Corpo Aquecido", "desc": "Criaturas que tocam o Azer sofrem 1d10 de dano de fogo." }]
  },
  {
    "id": "bearded_devil",
    "name": "Diabo Barbado",
    "category": "Corruptor",
    "size": "Médio",
    "challenge_rating": "3",
    "combat": { "hp": { "current": 52, "max": 52 }, "ca": 13, "speed": "30ft", "initiative_mod": 2 },
    "attributes": { "str": 16, "dex": 15, "con": 18, "int": 9, "wis": 11, "cha": 11 },
    "visuals": { "token_img": "/tokens/enemies/bearded_devil.jpg", "aura_preset": null, "scale": 1.1 },
    "actions": [
      { "name": "Glaive", "mod": "+5", "damage": "1d10 + 3", "desc": "O alvo não pode recuperar HP até passar em TR de CON." },
      { "name": "Barba", "mod": "+5", "damage": "1d8 + 3", "desc": "Alvo deve passar em TR CON ou ficar envenenado." }
    ],
    "traits": [{ "name": "Frenesi de Batalha", "desc": "Vantagem em ataques se estiver com menos de metade do HP." }]
  },
  {
    "id": "behir",
    "name": "Behir",
    "category": "Monstruosidade",
    "size": "Enorme",
    "challenge_rating": "11",
    "combat": { "hp": { "current": 168, "max": 168 }, "ca": 17, "speed": "50ft, escalada 40ft", "initiative_mod": 3 },
    "attributes": { "str": 28, "dex": 16, "con": 18, "int": 7, "wis": 14, "cha": 12 },
    "visuals": { "token_img": "/tokens/enemies/behir.jpg", "aura_preset": "lightning_discharge", "scale": 2.2 },
    "actions": [
      { "name": "Sopro de Relâmpago", "desc": "Linha de 6m causando 12d10 de dano elétrico." },
      { "name": "Engolir", "desc": "Tenta engolir uma criatura Grande ou menor agarrada." }
    ],
    "traits": [{ "name": "Escalada Aracnídea", "desc": "Pode subir superfícies difíceis sem testes." }]
  },
  {
    "id": "blue_slaad",
    "name": "Slaad Azul",
    "category": "Aberração",
    "size": "Grande",
    "challenge_rating": "7",
    "combat": { "hp": { "current": 123, "max": 123 }, "ca": 15, "speed": "30ft", "initiative_mod": 2 },
    "attributes": { "str": 20, "dex": 15, "con": 18, "int": 7, "wis": 7, "cha": 9 },
    "visuals": { "token_img": "/tokens/enemies/blue_slaad.jpg", "aura_preset": "chaos_aura", "scale": 1.5 },
    "actions": [
      { "name": "Garras", "mod": "+8", "damage": "2d6 + 5", "desc": "O alvo contrai a doença de Slaad (reduz HP máximo)." }
    ],
    "traits": [{ "name": "Regeneração", "desc": "Recupera 10 HP no início do seu turno." }]
  },
  {
    "id": "clay_golem",
    "name": "Golem de Argila",
    "category": "Constructo",
    "size": "Grande",
    "challenge_rating": "9",
    "combat": { "hp": { "current": 133, "max": 133 }, "ca": 14, "speed": "20ft", "initiative_mod": -1 },
    "attributes": { "str": 20, "dex": 9, "con": 18, "int": 3, "wis": 8, "cha": 1 },
    "visuals": { "token_img": "/tokens/enemies/clay_golem.jpg", "aura_preset": "stone_skin", "scale": 1.6 },
    "actions": [{ "name": "Pancada", "mod": "+8", "damage": "2d10 + 5", "desc": "Reduz o HP máximo do alvo permanentemente." }],
    "traits": [{ "name": "Acelerar", "desc": "Pode usar uma ação bônus para ganhar o efeito da magia Velocidade." }]
  },
  {
    "id": "cloaker",
    "name": "Manto (Cloaker)",
    "category": "Aberração",
    "size": "Grande",
    "challenge_rating": "8",
    "combat": { "hp": { "current": 78, "max": 78 }, "ca": 14, "speed": "10ft, voo 40ft", "initiative_mod": 2 },
    "attributes": { "str": 17, "dex": 15, "con": 12, "int": 13, "wis": 12, "cha": 14 },
    "visuals": { "token_img": "/tokens/enemies/cloaker.jpg", "aura_preset": "shadow_aura", "scale": 1.4 },
    "actions": [
      { "name": "Gemido", "desc": "Provoca medo ou desorientação em quem ouve." },
      { "name": "Fantasmas", "desc": "Cria duplicatas de si mesmo como Imagem Espelhada." }
    ],
    "traits": [{ "name": "Transferência de Dano", "desc": "Enquanto anexado a uma criatura, transfere metade do dano sofrido para ela." }]
  },
  {
    "id": "couatl",
    "name": "Couatl",
    "category": "Celestial",
    "size": "Médio",
    "challenge_rating": "4",
    "combat": { "hp": { "current": 97, "max": 97 }, "ca": 19, "speed": "30ft, voo 90ft", "initiative_mod": 5 },
    "attributes": { "str": 16, "dex": 20, "con": 17, "int": 18, "wis": 20, "cha": 18 },
    "visuals": { "token_img": "/tokens/enemies/couatl.jpg", "aura_preset": "divine_glow", "scale": 1.2 },
    "actions": [{ "name": "Mordida", "mod": "+8", "damage": "1d6 + 5", "desc": "Alvo deve passar em TR de CON ou cair inconsciente por 24h." }],
    "traits": [{ "name": "Escudo Psíquico", "desc": "Sua mente não pode ser lida e é imune a dano psíquico." }]
  },{
    "id": "death_knight",
    "name": "Cavaleiro da Morte",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "17",
    "combat": { "hp": { "current": 180, "max": 180 }, "ca": 20, "speed": "30ft", "initiative_mod": 0 },
    "attributes": { "str": 20, "dex": 11, "con": 20, "int": 12, "wis": 16, "cha": 18 },
    "visuals": { "token_img": "/tokens/enemies/death_knight.jpg", "aura_preset": "unholy_aura", "scale": 1.1 },
    "actions": [
      { "name": "Espada Longa", "mod": "+11", "damage": "1d8+5 + 4d8 necrótico" },
      { "name": "Orbe de Fogo do Inferno", "desc": "Explosão de 6m de raio causando 20d6 de dano (fogo/necrótico)." }
    ],
    "traits": [
      { "name": "Resistência Mágica", "desc": "Vantagem contra magias." },
      { "name": "Mestre de Armas", "desc": "Pode aparar ataques com sua espada para +6 CA." }
    ]
  },
  {
    "id": "demilich",
    "name": "Demilich",
    "category": "Morto-Vivo",
    "size": "Minúsculo",
    "challenge_rating": "18",
    "combat": { "hp": { "current": 80, "max": 80 }, "ca": 20, "speed": "0ft, voo 30ft", "initiative_mod": 5 },
    "attributes": { "str": 1, "dex": 20, "con": 10, "int": 20, "wis": 17, "cha": 20 },
    "visuals": { "token_img": "/tokens/enemies/demilich.jpg", "aura_preset": "soul_drain", "scale": 0.6 },
    "actions": [
      { "name": "Uivo", "desc": "Criaturas em 9m devem passar em TR de CON ou caem a 0 HP." },
      { "name": "Dreno de Energia", "mod": "+11", "damage": "6d6 necrótico", "desc": "Demilich recupera HP igual ao dano." }
    ],
    "traits": [{ "name": "Resistência Lendária", "desc": "Pode escolher passar em TR falho (3/dia)." }]
  },
  {
    "id": "displacer_beast",
    "name": "Besta Deslocadora",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "3",
    "combat": { "hp": { "current": 85, "max": 85 }, "ca": 13, "speed": "40ft", "initiative_mod": 2 },
    "attributes": { "str": 18, "dex": 15, "con": 16, "int": 6, "wis": 12, "cha": 8 },
    "visuals": { "token_img": "/tokens/enemies/displacer_beast.jpg", "aura_preset": "displacement_blur", "scale": 1.4 },
    "actions": [{ "name": "Tentáculos", "mod": "+6", "damage": "2d6 + 4", "type": "Concussão" }],
    "traits": [
      { "name": "Deslocamento", "desc": "Ataques contra ela têm desvantagem a menos que ela sofra dano." },
      { "name": "Esquiva Sobrenatural", "desc": "Reduz dano de área pela metade em sucessos de TR." }
    ]
  },
  {
    "id": "drider",
    "name": "Drider",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "6",
    "combat": { "hp": { "current": 123, "max": 123 }, "ca": 19, "speed": "30ft, escalada 30ft", "initiative_mod": 3 },
    "attributes": { "str": 16, "dex": 16, "con": 18, "int": 13, "wis": 14, "cha": 12 },
    "visuals": { "token_img": "/tokens/enemies/drider.jpg", "aura_preset": null, "scale": 1.6 },
    "actions": [
      { "name": "Espada Longa", "mod": "+6", "damage": "1d8+3 + 1d8 veneno" },
      { "name": "Arco Longo", "mod": "+6", "damage": "1d8+3 + 1d8 veneno" }
    ],
    "traits": [{ "name": "Escalada Aracnídea", "desc": "Pode andar em paredes e tetos." }]
  },
  {
    "id": "flameskull",
    "name": "Crânio Flamejante",
    "category": "Morto-Vivo",
    "size": "Diminuto",
    "challenge_rating": "4",
    "combat": { "hp": { "current": 40, "max": 40 }, "ca": 13, "speed": "0ft, voo 40ft", "initiative_mod": 3 },
    "attributes": { "str": 1, "dex": 17, "con": 14, "int": 16, "wis": 10, "cha": 11 },
    "visuals": { "token_img": "/tokens/enemies/flameskull.jpg", "aura_preset": "fire_aura", "scale": 0.7 },
    "actions": [
      { "name": "Raio de Fogo", "mod": "+5", "damage": "3d6 fogo" },
      { "name": "Conjuração", "desc": "Pode usar Bola de Fogo e Mísseis Mágicos." }
    ],
    "traits": [{ "name": "Rejuvenescimento", "desc": "Recupera todo o HP após 1 hora a menos que seja aspergido com água benta." }]
  },
  {
    "id": "flesh_golem",
    "name": "Golem de Carne",
    "category": "Constructo",
    "size": "Médio",
    "challenge_rating": "5",
    "combat": { "hp": { "current": 93, "max": 93 }, "ca": 9, "speed": "30ft", "initiative_mod": -1 },
    "attributes": { "str": 19, "dex": 9, "con": 18, "int": 6, "wis": 10, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/flesh_golem.jpg", "aura_preset": null, "scale": 1.2 },
    "actions": [{ "name": "Pancada", "mod": "+7", "damage": "2d8 + 4", "type": "Concussão" }],
    "traits": [
      { "name": "Aversão ao Fogo", "desc": "Se sofrer dano de fogo, tem desvantagem em ataques e testes até o final do próximo turno." },
      { "name": "Absorção de Relâmpago", "desc": "Dano elétrico cura o golem em vez de feri-lo." }
    ]
  },
  {
    "id": "frost_giant",
    "name": "Gigante do Gelo",
    "category": "Gigante",
    "size": "Enorme",
    "challenge_rating": "8",
    "combat": { "hp": { "current": 138, "max": 138 }, "ca": 15, "speed": "40ft", "initiative_mod": -1 },
    "attributes": { "str": 23, "dex": 9, "con": 21, "int": 9, "wis": 10, "cha": 12 },
    "visuals": { "token_img": "/tokens/enemies/frost_giant.jpg", "aura_preset": "cold_mist", "scale": 2.2 },
    "actions": [
      { "name": "Machado Grande", "mod": "+9", "damage": "3d12 + 6" },
      { "name": "Rocha", "mod": "+9", "damage": "4d10 + 6", "range": "60/240ft" }
    ],
    "traits": [{ "name": "Imunidade a Frio", "desc": "Não sofre dano de gelo." }]
  },
  {
    "id": "iron_golem",
    "name": "Golem de Ferro",
    "category": "Constructo",
    "size": "Grande",
    "challenge_rating": "16",
    "combat": { "hp": { "current": 210, "max": 210 }, "ca": 20, "speed": "30ft", "initiative_mod": -1 },
    "attributes": { "str": 24, "dex": 9, "con": 20, "int": 3, "wis": 11, "cha": 1 },
    "visuals": { "token_img": "/tokens/enemies/iron_golem.jpg", "aura_preset": "metallic_sheen", "scale": 1.8 },
    "actions": [
      { "name": "Espada Larga", "mod": "+13", "damage": "3d10 + 7" },
      { "name": "Sopro Venenoso", "desc": "Cone de 4.5m causando 10d8 de dano de veneno." }
    ],
    "traits": [{ "name": "Absorção de Fogo", "desc": "Dano de fogo cura o golem." }]
  },
  {
    "id": "medusa",
    "name": "Medusa",
    "category": "Monstruosidade",
    "size": "Médio",
    "challenge_rating": "6",
    "combat": { "hp": { "current": 127, "max": 127 }, "ca": 15, "speed": "30ft", "initiative_mod": 2 },
    "attributes": { "str": 10, "dex": 15, "con": 16, "int": 12, "wis": 13, "cha": 15 },
    "visuals": { "token_img": "/tokens/enemies/medusa.jpg", "aura_preset": "petrifying_gaze", "scale": 1.0 },
    "actions": [
      { "name": "Cabelo de Serpente", "mod": "+5", "damage": "1d4+2 + 4d6 veneno" },
      { "name": "Arco Longo", "mod": "+5", "damage": "1d8+2 + 2d6 veneno" }
    ],
    "traits": [{ "name": "Olhar Petrificante", "desc": "Criaturas que iniciarem o turno a até 9m devem resistir ou serão transformadas em pedra." }]
  },
  {
    "id": "tarrasque",
    "name": "Tarrasque",
    "category": "Monstruosidade",
    "size": "Gargantuesco",
    "challenge_rating": "30",
    "combat": { "hp": { "current": 676, "max": 676 }, "ca": 25, "speed": "40ft", "initiative_mod": 0 },
    "attributes": { "str": 30, "dex": 11, "con": 30, "int": 3, "wis": 11, "cha": 11 },
    "visuals": { "token_img": "/tokens/enemies/tarrasque.jpg", "aura_preset": "earthquake_step", "scale": 3.5 },
    "actions": [
      { "name": "Multiataque", "desc": "Faz cinco ataques: uma mordida, duas garras, um chifre e uma cauda." },
      { "name": "Engolir", "desc": "Engole uma criatura Gigante ou menor." }
    ],
    "traits": [
      { "name": "Carapaça Refletora", "desc": "Qualquer magia de linha ou projétil mágico é refletido de volta." },
      { "name": "Resistência Lendária", "desc": "Passa em TRs falhos (3/dia)." }
    ]
  },
  {
    "id": "wraith",
    "name": "Aparição (Wraith)",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "5",
    "combat": { "hp": { "current": 67, "max": 67 }, "ca": 13, "speed": "0ft, voo 60ft", "initiative_mod": 3 },
    "attributes": { "str": 6, "dex": 16, "con": 16, "int": 12, "wis": 14, "cha": 15 },
    "visuals": { "token_img": "/tokens/enemies/wraith.jpg", "aura_preset": "darkness_aura", "scale": 1.1 },
    "actions": [{ "name": "Toque Drenante", "mod": "+6", "damage": "4d8 + 3 necrótico", "desc": "Reduz o HP máximo do alvo." }],
    "traits": [
      { "name": "Movimentação Etérea", "desc": "Pode atravessar objetos sólidos." },
      { "name": "Criar Espectro", "desc": "Transforma um humanoide morto em espectro sob seu controle." }
    ]
  },{
    "id": "beholder_zombie",
    "name": "Zumbi Observador",
    "category": "Morto-Vivo",
    "size": "Grande",
    "challenge_rating": "5",
    "combat": { "hp": { "current": 93, "max": 93 }, "ca": 15, "speed": "0ft, voo 20ft", "initiative_mod": -1 },
    "attributes": { "str": 10, "dex": 8, "con": 16, "int": 3, "wis": 8, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/beholder_zombie.jpg", "aura_preset": "undead_miasma", "scale": 1.5 },
    "actions": [
      { "name": "Mordida", "mod": "+5", "damage": "4d6", "type": "Perfurante" },
      { "name": "Raio Ocular", "desc": "Dispara um raio aleatório: Medo, Paralisia, Envelhecimento ou Desintegração." }
    ],
    "traits": [{ "name": "Fortitude Morta-Viva", "desc": "Pode resistir à morte se o dano não for radiante ou crítico." }]
  },
  {
    "id": "death_slaad",
    "name": "Slaad da Morte",
    "category": "Aberração",
    "size": "Médio",
    "challenge_rating": "10",
    "combat": { "hp": { "current": 170, "max": 170 }, "ca": 18, "speed": "30ft", "initiative_mod": 2 },
    "attributes": { "str": 20, "dex": 15, "con": 19, "int": 15, "wis": 10, "cha": 14 },
    "visuals": { "token_img": "/tokens/enemies/death_slaad.jpg", "aura_preset": "chaos_field", "scale": 1.1 },
    "actions": [
      { "name": "Multiataque", "desc": "Três ataques: uma mordida e duas garras." },
      { "name": "Conjuração", "desc": "Pode conjurar Bola de Fogo e Nuvem Incendiária." }
    ],
    "traits": [
      { "name": "Regeneração", "desc": "Recupera 10 HP no início do turno." },
      { "name": "Resistência Mágica", "desc": "Vantagem contra magias." }
    ]
  },
  {
    "id": "stone_golem",
    "name": "Golem de Pedra",
    "category": "Constructo",
    "size": "Grande",
    "challenge_rating": "10",
    "combat": { "hp": { "current": 178, "max": 178 }, "ca": 17, "speed": "30ft", "initiative_mod": -1 },
    "attributes": { "str": 22, "dex": 9, "con": 20, "int": 3, "wis": 11, "cha": 1 },
    "visuals": { "token_img": "/tokens/enemies/stone_golem.jpg", "aura_preset": "heavy_armor", "scale": 1.7 },
    "actions": [
      { "name": "Pancada", "mod": "+10", "damage": "3d8 + 6" },
      { "name": "Lentidão", "desc": "Alvos próximos devem passar em TR Sabedoria ou ficam sob efeito de Lentidão." }
    ],
    "traits": [{ "name": "Imunidade Psíquica", "desc": "Imune a veneno e dano psíquico." }]
  },
  {
    "id": "vampire",
    "name": "Vampiro",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "13",
    "combat": { "hp": { "current": 144, "max": 144 }, "ca": 16, "speed": "30ft", "initiative_mod": 4 },
    "attributes": { "str": 18, "dex": 18, "con": 18, "int": 17, "wis": 15, "cha": 18 },
    "visuals": { "token_img": "/tokens/enemies/vampire.jpg", "aura_preset": "blood_mist", "scale": 1.0 },
    "actions": [
      { "name": "Mordida", "mod": "+9", "damage": "1d6+4 + 3d6 necrótico", "desc": "Recupera HP igual ao dano necrótico." },
      { "name": "Olhar Fascinante", "desc": "Pode encantar uma criatura que olhe em seus olhos." }
    ],
    "traits": [
      { "name": "Regeneração", "desc": "Recupera 20 HP por turno se não estiver sob luz solar." },
      { "name": "Fuga Nebulosa", "desc": "Transforma-se em névoa ao chegar a 0 HP em vez de morrer." }
    ]
  },
  {
    "id": "yuan_ti_abomination",
    "name": "Yuan-ti Abominação",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "7",
    "combat": { "hp": { "current": 127, "max": 127 }, "ca": 15, "speed": "40ft, natação 40ft", "initiative_mod": 3 },
    "attributes": { "str": 19, "dex": 16, "con": 17, "int": 17, "wis": 15, "cha": 18 },
    "visuals": { "token_img": "/tokens/enemies/yuan_ti_abomination.jpg", "aura_preset": "poison_cloud", "scale": 1.6 },
    "actions": [
      { "name": "Cimitarra", "mod": "+7", "damage": "2d6 + 4" },
      { "name": "Constrição", "mod": "+7", "damage": "2d10 + 4", "desc": "Alvo fica agarrado e impedido." }
    ],
    "traits": [
      { "name": "Resistência Mágica", "desc": "Vantagem contra magias." },
      { "name": "Forma de Serpente", "desc": "Pode se transformar em uma serpente Grande." }
    ]
  },
  {
    "id": "lizard_king_queen",
    "name": "Rei/Rainha Homem-Lagarto",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "4",
    "combat": { "hp": { "current": 78, "max": 78 }, "ca": 15, "speed": "30ft, natação 30ft", "initiative_mod": 1 },
    "attributes": { "str": 17, "dex": 12, "con": 15, "int": 11, "wis": 12, "cha": 15 },
    "visuals": { "token_img": "/tokens/enemies/lizard_kingqueen.jpg", "aura_preset": "war_cry", "scale": 1.2 },
    "actions": [
      { "name": "Tridente", "mod": "+5", "damage": "1d8+3 + 1d8 perfurante" },
      { "name": "Mordida", "mod": "+5", "damage": "1d6 + 3" }
    ],
    "traits": [{ "name": "Frenesi do Rei", "desc": "Pode fazer um ataque bônus se atingir com o tridente." }]
  },
  {
    "id": "githyanki_knight",
    "name": "Cavaleiro Githyanki",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "8",
    "combat": { "hp": { "current": 91, "max": 91 }, "ca": 18, "speed": "30ft", "initiative_mod": 2 },
    "attributes": { "str": 16, "dex": 14, "con": 15, "int": 14, "wis": 14, "cha": 15 },
    "visuals": { "token_img": "/tokens/enemies/githyanki.jpg", "aura_preset": "psychic_barrier", "scale": 1.0 },
    "actions": [{ "name": "Espada de Prata", "mod": "+9", "damage": "2d6+3 + 3d6 psíquico" }],
    "traits": [{ "name": "Inato", "desc": "Pode conjurar Salto, Passos sem Pegadas e Enevoador." }]
  },
  {
    "id": "balor",
    "name": "Balor",
    "category": "Corruptor",
    "size": "Enorme",
    "challenge_rating": "19",
    "combat": { "hp": { "current": 262, "max": 262 }, "ca": 19, "speed": "40ft, voo 80ft", "initiative_mod": 2 },
    "attributes": { "str": 26, "dex": 15, "con": 22, "int": 20, "wis": 16, "cha": 22 },
    "visuals": { "token_img": "/tokens/enemies/demon_balor.jpg", "aura_preset": "fire_aura", "scale": 2.4 },
    "actions": [
      { "name": "Espada de Relâmpago", "mod": "+14", "damage": "3d8+8 + 3d8 elétrico" },
      { "name": "Chicote de Fogo", "mod": "+14", "damage": "2d6+8 + 3d6 fogo" }
    ],
    "traits": [
      { "name": "Aura de Fogo", "desc": "Causa 3d6 de fogo em quem começa o turno adjacente." },
      { "name": "Morte Explosiva", "desc": "Explode ao morrer, causando 20d6 de dano de fogo em 9m." }
    ]
  },{
    "id": "allosaurus",
    "name": "Alossauro",
    "category": "Besta",
    "size": "Grande",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 51, "max": 51 }, "ca": 13, "speed": "60ft", "initiative_mod": 1 },
    "attributes": { "str": 19, "dex": 13, "con": 17, "int": 2, "wis": 12, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/allosaurus.jpg", "aura_preset": null, "scale": 1.7 },
    "actions": [
      { "name": "Mordida", "mod": "+6", "damage": "2d10 + 4" },
      { "name": "Garra", "mod": "+6", "damage": "1d8 + 4" }
    ],
    "traits": [{ "name": "Bote", "desc": "Se mover 9m e atingir com mordida, o alvo deve passar em TR de Força ou cair caído." }]
  },
  {
    "id": "ape",
    "name": "Macaco (Ape)",
    "category": "Besta",
    "size": "Médio",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 19, "max": 19 }, "ca": 12, "speed": "30ft, escalada 30ft", "initiative_mod": 2 },
    "attributes": { "str": 16, "dex": 14, "con": 14, "int": 6, "wis": 12, "cha": 7 },
    "visuals": { "token_img": "/tokens/enemies/ape.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [
      { "name": "Punho", "mod": "+5", "damage": "1d6 + 3" },
      { "name": "Pedra", "mod": "+5", "damage": "1d6 + 3", "range": "25/50ft" }
    ],
    "traits": []
  },
  {
    "id": "axe_beak",
    "name": "Bico de Machado",
    "category": "Besta",
    "size": "Grande",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 19, "max": 19 }, "ca": 11, "speed": "50ft", "initiative_mod": 1 },
    "attributes": { "str": 14, "dex": 12, "con": 12, "int": 2, "wis": 10, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/axe_beak.jpg", "aura_preset": null, "scale": 1.4 },
    "actions": [{ "name": "Bico", "mod": "+4", "damage": "1d8 + 2" }],
    "traits": []
  },
  {
    "id": "duodrone",
    "name": "Duodrone",
    "category": "Constructo",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 11, "max": 11 }, "ca": 15, "speed": "30ft", "initiative_mod": 1 },
    "attributes": { "str": 11, "dex": 13, "con": 12, "int": 8, "wis": 10, "cha": 7 },
    "visuals": { "token_img": "/tokens/enemies/duodrone.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Javalin", "mod": "+3", "damage": "1d6 + 1" }],
    "traits": [{ "name": "Mente Axiomática", "desc": "Não pode ser compelido a agir contra a ordem de seus superiores." }]
  },
  {
    "id": "guard",
    "name": "Guarda",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1/8",
    "combat": { "hp": { "current": 11, "max": 11 }, "ca": 16, "speed": "30ft", "initiative_mod": 1 },
    "attributes": { "str": 13, "dex": 12, "con": 12, "int": 10, "wis": 11, "cha": 10 },
    "visuals": { "token_img": "/tokens/enemies/guard.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Lança", "mod": "+3", "damage": "1d6 + 1" }],
    "traits": []
  },
  {
    "id": "noble",
    "name": "Nobre",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1/8",
    "combat": { "hp": { "current": 9, "max": 9 }, "ca": 15, "speed": "30ft", "initiative_mod": 1 },
    "attributes": { "str": 11, "dex": 12, "con": 11, "int": 12, "wis": 14, "cha": 16 },
    "visuals": { "token_img": "/tokens/enemies/noble.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Rapieira", "mod": "+3", "damage": "1d8 + 1" }],
    "traits": [{ "name": "Reação: Aparar", "desc": "Adiciona +2 na CA contra um ataque corpo-a-corpo." }]
  },
  {
    "id": "skeleton",
    "name": "Esqueleto",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 13, "max": 13 }, "ca": 13, "speed": "30ft", "initiative_mod": 2 },
    "attributes": { "str": 10, "dex": 14, "con": 15, "int": 6, "wis": 8, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/skeleton.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [
      { "name": "Espada Curta", "mod": "+4", "damage": "1d6 + 2" },
      { "name": "Arco Curto", "mod": "+4", "damage": "1d6 + 2" }
    ],
    "traits": [{ "name": "Vulnerabilidade", "desc": "Sofre dano dobrado de concussão." }]
  },
  {
    "id": "spy",
    "name": "Espião",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1",
    "combat": { "hp": { "current": 27, "max": 27 }, "ca": 12, "speed": "30ft", "initiative_mod": 2 },
    "attributes": { "str": 10, "dex": 15, "con": 10, "int": 12, "wis": 14, "cha": 16 },
    "visuals": { "token_img": "/tokens/enemies/scout.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Espada Curta", "mod": "+4", "damage": "1d6 + 2" }],
    "traits": [{ "name": "Ataque Furtivo", "desc": "Causa +2d6 de dano extra se tiver vantagem no ataque." }]
  },
  {
    "id": "thug",
    "name": "Valentão (Thug)",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 32, "max": 32 }, "ca": 11, "speed": "30ft", "initiative_mod": 0 },
    "attributes": { "str": 15, "dex": 11, "con": 14, "int": 10, "wis": 10, "cha": 11 },
    "visuals": { "token_img": "/tokens/enemies/thug.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Maça", "mod": "+4", "damage": "1d6 + 2" }],
    "traits": [{ "name": "Táticas de Matilha", "desc": "Vantagem no ataque se houver um aliado próximo ao alvo." }]
  },
  {
    "id": "warhorse",
    "name": "Cavalo de Guerra",
    "category": "Besta",
    "size": "Grande",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 19, "max": 19 }, "ca": 11, "speed": "60ft", "initiative_mod": 1 },
    "attributes": { "str": 18, "dex": 12, "con": 13, "int": 2, "wis": 12, "cha": 7 },
    "visuals": { "token_img": "/tokens/enemies/warhorse.jpg", "aura_preset": null, "scale": 1.5 },
    "actions": [{ "name": "Casco", "mod": "+6", "damage": "2d6 + 4" }],
    "traits": [{ "name": "Investida Atropelante", "desc": "Se mover 6m e atingir, o alvo deve passar em TR Força ou cair caído." }]
  },{
    "id": "giant_fire_beetle",
    "name": "Besouro de Fogo Gigante",
    "category": "Besta",
    "size": "Pequeno",
    "challenge_rating": "0",
    "combat": { "hp": { "current": 4, "max": 4 }, "ca": 13, "speed": "30ft", "initiative_mod": 0 },
    "attributes": { "str": 8, "dex": 10, "con": 12, "int": 1, "wis": 7, "cha": 3 },
    "visuals": { "token_img": "/tokens/enemies/giant_fire_beetle.jpg", "aura_preset": "dim_light", "scale": 0.8 },
    "actions": [{ "name": "Bordada", "mod": "+1", "damage": "1d6 - 1" }],
    "traits": [{ "name": "Glândulas de Iluminação", "desc": "Emite luz plena em 3m e penumbra por mais 3m." }]
  },
  {
    "id": "giant_centipede",
    "name": "Centopeia Gigante",
    "category": "Besta",
    "size": "Pequeno",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 4, "max": 4 }, "ca": 13, "speed": "30ft, escalada 30ft", "initiative_mod": 2 },
    "attributes": { "str": 5, "dex": 14, "con": 12, "int": 1, "wis": 7, "cha": 3 },
    "visuals": { "token_img": "/tokens/enemies/giant_centipede.jpg", "aura_preset": null, "scale": 0.8 },
    "actions": [{ "name": "Mordida", "mod": "+4", "damage": "1d4 + 2", "desc": "Alvo deve passar em TR de CON CD 11 ou sofre 3d6 de veneno." }],
    "traits": []
  },
  {
    "id": "giant_wasp",
    "name": "Vespa Gigante",
    "category": "Besta",
    "size": "Médio",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 13, "max": 13 }, "ca": 12, "speed": "10ft, voo 50ft", "initiative_mod": 2 },
    "attributes": { "str": 10, "dex": 14, "con": 10, "int": 1, "wis": 10, "cha": 3 },
    "visuals": { "token_img": "/tokens/enemies/giant_wasp.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Ferrão", "mod": "+4", "damage": "1d6 + 2", "desc": "Causa +2d6 de veneno. Se o HP cair a 0, o alvo fica estável mas paralisado." }],
    "traits": []
  },
  {
    "id": "monodrone",
    "name": "Monodrone",
    "category": "Constructo",
    "size": "Médio",
    "challenge_rating": "1/8",
    "combat": { "hp": { "current": 5, "max": 5 }, "ca": 15, "speed": "30ft, voo 30ft", "initiative_mod": 1 },
    "attributes": { "str": 10, "dex": 13, "con": 12, "int": 4, "wis": 10, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/monodrone.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Adaga", "mod": "+3", "damage": "1d4 + 1" }],
    "traits": [{ "name": "Mente Axiomática", "desc": "Não pode ser compelido a agir contra as leis de Mechanus." }]
  },
  {
    "id": "dust_mephit",
    "name": "Mephit da Poeira",
    "category": "Elemental",
    "size": "Pequeno",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 17, "max": 17 }, "ca": 12, "speed": "30ft, voo 30ft", "initiative_mod": 2 },
    "attributes": { "str": 5, "dex": 14, "con": 10, "int": 9, "wis": 11, "cha": 10 },
    "visuals": { "token_img": "/tokens/enemies/dust_mephit.jpg", "aura_preset": "sand_swirl", "scale": 0.8 },
    "actions": [
      { "name": "Sopro de Poeira", "desc": "Cone de 4.5m, alvo deve passar em TR de DES ou fica cego." },
      { "name": "Conjuração (1/dia)", "desc": "Pode conjurar Imagem Silenciosa." }
    ],
    "traits": [{ "name": "Explosão de Morte", "desc": "Ao morrer, explode em poeira ofuscante." }]
  },
  {
    "id": "steam_mephit",
    "name": "Mephit do Vapor",
    "category": "Elemental",
    "size": "Pequeno",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 21, "max": 21 }, "ca": 10, "speed": "30ft, voo 30ft", "initiative_mod": 0 },
    "attributes": { "str": 5, "dex": 11, "con": 10, "int": 11, "wis": 10, "cha": 12 },
    "visuals": { "token_img": "/tokens/enemies/steam_mephit.jpg", "aura_preset": "steam_cloud", "scale": 0.8 },
    "actions": [
      { "name": "Sopro de Vapor", "mod": "+2", "damage": "1d8 fogo", "desc": "Cone de 4.5m." },
      { "name": "Conjuração (1/dia)", "desc": "Pode conjurar Mãos Flamejantes." }
    ],
    "traits": [{ "name": "Explosão de Morte", "desc": "Ao morrer, explode em vapor escaldante." }]
  },
  {
    "id": "will_o_wisp",
    "name": "Fogo Fátuo (Will-o'-Wisp)",
    "category": "Morto-Vivo",
    "size": "Minúsculo",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 22, "max": 22 }, "ca": 19, "speed": "0ft, voo 50ft", "initiative_mod": 4 },
    "attributes": { "str": 1, "dex": 28, "con": 10, "int": 13, "wis": 14, "cha": 11 },
    "visuals": { "token_img": "/tokens/enemies/will_o_wisp.jpg", "aura_preset": "eerie_light", "scale": 0.6 },
    "actions": [
      { "name": "Choque Chocante", "mod": "+4", "damage": "2d8 relâmpago" },
      { "name": "Consumir Vida", "desc": "Tenta matar uma criatura com 0 HP e recupera 3d6 de HP." }
    ],
    "traits": [
      { "name": "Efêmero", "desc": "Pode ocupar o espaço de outra criatura." },
      { "name": "Invisibilidade", "desc": "Pode ficar invisível como ação bônus." }
    ]
  },
  {
    "id": "swarm_of_bats",
    "name": "Enxame de Morcegos",
    "category": "Enxame",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 22, "max": 22 }, "ca": 12, "speed": "0ft, voo 30ft", "initiative_mod": 2 },
    "attributes": { "str": 5, "dex": 15, "con": 10, "int": 2, "wis": 12, "cha": 4 },
    "visuals": { "token_img": "/tokens/enemies/swarm_bats.jpg", "aura_preset": null, "scale": 1.2 },
    "actions": [{ "name": "Mordidas", "mod": "+4", "damage": "2d4", "desc": "Dano cai para 1d4 se o enxame tiver metade do HP ou menos." }],
    "traits": [{ "name": "Enxame", "desc": "Pode ocupar o espaço de outra criatura e vice-versa." }]
  },
  {
    "id": "quipper",
    "name": "Quipper (Piranha)",
    "category": "Besta",
    "size": "Diminuto",
    "challenge_rating": "0",
    "combat": { "hp": { "current": 1, "max": 1 }, "ca": 13, "speed": "0ft, natação 40ft", "initiative_mod": 3 },
    "attributes": { "str": 2, "dex": 16, "con": 9, "int": 1, "wis": 7, "cha": 2 },
    "visuals": { "token_img": "/tokens/enemies/quipper.jpg", "aura_preset": null, "scale": 0.5 },
    "actions": [{ "name": "Mordida", "mod": "+5", "damage": "1" }],
    "traits": [{ "name": "Frenesi Sangrento", "desc": "Vantagem em ataques contra qualquer criatura que não esteja com HP máximo." }]
  },
  {
    "id": "rug_of_smothering",
    "name": "Tapete Sufocante",
    "category": "Constructo",
    "size": "Grande",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 33, "max": 33 }, "ca": 12, "speed": "10ft", "initiative_mod": 2 },
    "attributes": { "str": 17, "dex": 14, "con": 10, "int": 1, "wis": 3, "cha": 1 },
    "visuals": { "token_img": "/tokens/enemies/rug_smothering.jpg", "aura_preset": null, "scale": 1.5 },
    "actions": [{ "name": "Sufocar", "mod": "+5", "damage": "2d6 + 3", "desc": "Alvo fica agarrado, impedido e cego." }],
    "traits": [{ "name": "Transferência de Dano", "desc": "Enquanto agarra uma criatura, sofre apenas metade do dano (a outra metade vai para o alvo)." }]
  },{
    "id": "ghoul",
    "name": "Ghoul (Carniçal)",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "1",
    "combat": { "hp": { "current": 22, "max": 22 }, "ca": 12, "speed": "30ft", "initiative_mod": 2 },
    "attributes": { "str": 13, "dex": 15, "con": 10, "int": 7, "wis": 10, "cha": 6 },
    "visuals": { "token_img": "/tokens/enemies/ghoul.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [
      { "name": "Mordida", "mod": "+2", "damage": "2d6 + 2" },
      { "name": "Garras", "mod": "+4", "damage": "2d4 + 2", "desc": "Alvo deve passar em TR de CON CD 10 ou fica paralisado." }
    ],
    "traits": []
  },
  {
    "id": "ghast",
    "name": "Ghast (Carniçal Atroz)",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 36, "max": 36 }, "ca": 13, "speed": "30ft", "initiative_mod": 3 },
    "attributes": { "str": 16, "dex": 17, "con": 10, "int": 11, "wis": 10, "cha": 8 },
    "visuals": { "token_img": "/tokens/enemies/ghast.jpg", "aura_preset": "stench_aura", "scale": 1.1 },
    "actions": [
      { "name": "Mordida", "mod": "+3", "damage": "2d8 + 3" },
      { "name": "Garras", "mod": "+5", "damage": "2d6 + 3", "desc": "Alvo deve passar em TR de CON CD 10 ou fica paralisado." }
    ],
    "traits": [{ "name": "Fedor", "desc": "Criaturas a até 1,5m devem passar em TR de CON ou ficam enjoadas." }]
  },
  {
    "id": "black_pudding",
    "name": "Pudim Negro",
    "category": "Limo",
    "size": "Grande",
    "challenge_rating": "4",
    "combat": { "hp": { "current": 85, "max": 85 }, "ca": 7, "speed": "20ft, escalada 20ft", "initiative_mod": -3 },
    "attributes": { "str": 16, "dex": 5, "con": 16, "int": 1, "wis": 6, "cha": 1 },
    "visuals": { "token_img": "/tokens/enemies/black_pudding.jpg", "aura_preset": "corrosive_ooze", "scale": 1.6 },
    "actions": [{ "name": "Pseudópode", "mod": "+5", "damage": "1d8+3 + 4d8 ácido", "desc": "Pode destruir armaduras de metal." }],
    "traits": [
      { "name": "Amorfo", "desc": "Pode passar por frestas de até 2,5cm." },
      { "name": "Dividir", "desc": "Se sofrer dano elétrico ou cortante e for Grande, divide-se em dois Limos menores." }
    ]
  },
  {
    "id": "ochre_jelly",
    "name": "Geleia Ocre",
    "category": "Limo",
    "size": "Grande",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 45, "max": 45 }, "ca": 8, "speed": "10ft, escalada 10ft", "initiative_mod": -2 },
    "attributes": { "str": 15, "dex": 6, "con": 14, "int": 2, "wis": 6, "cha": 1 },
    "visuals": { "token_img": "/tokens/enemies/ochre_jelly.jpg", "aura_preset": null, "scale": 1.4 },
    "actions": [{ "name": "Pseudópode", "mod": "+4", "damage": "2d6 + 2", "type": "Concussão + Ácido" }],
    "traits": [{ "name": "Dividir", "desc": "Pode se dividir em duas Geleias Médias se sofrer dano cortante ou elétrico." }]
  },
  {
    "id": "dretch",
    "name": "Dretch",
    "category": "Corruptor",
    "size": "Pequeno",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 18, "max": 18 }, "ca": 11, "speed": "20ft", "initiative_mod": 0 },
    "attributes": { "str": 11, "dex": 11, "con": 14, "int": 5, "wis": 8, "cha": 3 },
    "visuals": { "token_img": "/tokens/enemies/demon_dretch.jpg", "aura_preset": null, "scale": 0.8 },
    "actions": [{ "name": "Nuvem de Fedor", "desc": "Cria uma nuvem de gás venenoso de 3m de raio." }],
    "traits": []
  },
  {
    "id": "erinyes",
    "name": "Erínia",
    "category": "Corruptor",
    "size": "Médio",
    "challenge_rating": "12",
    "combat": { "hp": { "current": 153, "max": 153 }, "ca": 18, "speed": "30ft, voo 60ft", "initiative_mod": 3 },
    "attributes": { "str": 18, "dex": 16, "con": 18, "int": 14, "wis": 14, "cha": 18 },
    "visuals": { "token_img": "/tokens/enemies/erinyes.jpg", "aura_preset": "unholy_protection", "scale": 1.1 },
    "actions": [
      { "name": "Espada Longa", "mod": "+8", "damage": "1d8+4 + 3d8 veneno" },
      { "name": "Arco Longo", "mod": "+7", "damage": "1d8+3 + 3d8 veneno" }
    ],
    "traits": [{ "name": "Resistência Mágica", "desc": "Vantagem contra magias." }]
  },
  {
    "id": "mule",
    "name": "Mula",
    "category": "Besta",
    "size": "Médio",
    "challenge_rating": "1/8",
    "combat": { "hp": { "current": 11, "max": 11 }, "ca": 10, "speed": "40ft", "initiative_mod": 0 },
    "attributes": { "str": 14, "dex": 10, "con": 13, "int": 2, "wis": 10, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/horse.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Casco", "mod": "+2", "damage": "1d4 + 2" }],
    "traits": [{ "name": "Bestas de Carga", "desc": "Sua capacidade de carga é dobrada." }]
  },
  {
    "id": "zombie",
    "name": "Zumbi",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 22, "max": 22 }, "ca": 8, "speed": "20ft", "initiative_mod": -2 },
    "attributes": { "str": 13, "dex": 6, "con": 16, "int": 3, "wis": 6, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/zombie.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Pancada", "mod": "+3", "damage": "1d6 + 1" }],
    "traits": [{ "name": "Fortitude Morta-Viva", "desc": "Pode resistir à morte se o dano não for radiante ou crítico." }]
  },{
    "id": "solar",
    "name": "Solar",
    "category": "Celestial",
    "size": "Grande",
    "challenge_rating": "21",
    "combat": { "hp": { "current": 243, "max": 243 }, "ca": 21, "speed": "50ft, voo 150ft", "initiative_mod": 6 },
    "attributes": { "str": 26, "dex": 22, "con": 26, "int": 25, "wis": 25, "cha": 30 },
    "visuals": { "token_img": "/tokens/enemies/solar.jpg", "aura_preset": "holy_radiance", "scale": 1.8 },
    "actions": [
      { "name": "Espada Grande Angelical", "mod": "+15", "damage": "4d6+8 + 6d8 radiante" },
      { "name": "Arco da Destruição", "mod": "+13", "damage": "2d6+6 + 6d8 radiante", "desc": "Alvo deve passar em TR de CON ou morre instantaneamente se tiver 100 HP ou menos." }
    ],
    "traits": [
      { "name": "Resistência Mágica", "desc": "Vantagem contra magias." },
      { "name": "Armas Angélicas", "desc": "Seus ataques causam 6d8 de dano radiante extra (já incluso)." }
    ]
  },
  {
    "id": "rakshasa",
    "name": "Rakshasa",
    "category": "Corruptor",
    "size": "Médio",
    "challenge_rating": "13",
    "combat": { "hp": { "current": 110, "max": 110 }, "ca": 16, "speed": "40ft", "initiative_mod": 3 },
    "attributes": { "str": 14, "dex": 17, "con": 18, "int": 13, "wis": 16, "cha": 20 },
    "visuals": { "token_img": "/tokens/enemies/rakshasa.jpg", "aura_preset": "magic_immunity", "scale": 1.1 },
    "actions": [
      { "name": "Garra", "mod": "+7", "damage": "2d6 + 2", "desc": "O alvo é amaldiçoado e não recupera HP em descansos." }
    ],
    "traits": [
      { "name": "Imunidade Mágica Limitada", "desc": "Imune a magias de 6º nível ou inferior, a menos que deseje ser afetado." },
      { "name": "Vulnerabilidade a Armas Perfurantes Abençoadas", "desc": "Sofre dano crítico de armas perfurantes wielded por bons alinhamentos." }
    ]
  },
  {
    "id": "storm_giant",
    "name": "Gigante da Tempestade",
    "category": "Gigante",
    "size": "Gargantuesco",
    "challenge_rating": "13",
    "combat": { "hp": { "current": 230, "max": 230 }, "ca": 16, "speed": "50ft, natação 50ft", "initiative_mod": 2 },
    "attributes": { "str": 29, "dex": 14, "con": 20, "int": 16, "wis": 18, "cha": 18 },
    "visuals": { "token_img": "/tokens/enemies/storm_giant.jpg", "aura_preset": "lightning_storm", "scale": 2.8 },
    "actions": [
      { "name": "Espada Grande", "mod": "+14", "damage": "6d6 + 9" },
      { "name": "Relâmpago", "desc": "Dispara um raio em um ponto a 150m causando 12d8 de dano elétrico." }
    ],
    "traits": [{ "name": "Anfíbio", "desc": "Pode respirar ar e água." }]
  },
  {
    "id": "abominable_yeti",
    "name": "Yeti Abominável",
    "category": "Monstruosidade",
    "size": "Enorme",
    "challenge_rating": "9",
    "combat": { "hp": { "current": 137, "max": 137 }, "ca": 15, "speed": "40ft, escalada 40ft", "initiative_mod": 0 },
    "attributes": { "str": 24, "dex": 10, "con": 22, "int": 9, "wis": 13, "cha": 9 },
    "visuals": { "token_img": "/tokens/enemies/yeti.jpg", "aura_preset": "snow_storm", "scale": 2.2 },
    "actions": [
      { "name": "Olhar Gélido", "desc": "Alvo deve passar em TR de CON ou fica paralisado pelo frio." },
      { "name": "Sopro de Gelo", "desc": "Cone de 9m causando 10d6 de dano de frio." }
    ],
    "traits": [{ "name": "Camuflagem na Neve", "desc": "Vantagem em Furtividade em terrenos nevados." }]
  },
  {
    "id": "giant_shark",
    "name": "Tubarão Gigante",
    "category": "Besta",
    "size": "Gargantuesco",
    "challenge_rating": "5",
    "combat": { "hp": { "current": 126, "max": 126 }, "ca": 13, "speed": "0ft, natação 60ft", "initiative_mod": 0 },
    "attributes": { "str": 23, "dex": 11, "con": 21, "int": 1, "wis": 10, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/giant_shark.jpg", "aura_preset": null, "scale": 2.5 },
    "actions": [{ "name": "Mordida", "mod": "+9", "damage": "3d10 + 6" }],
    "traits": [
      { "name": "Frenesi Sangrento", "desc": "Vantagem em ataques contra criaturas feridas." },
      { "name": "Respirar na Água", "desc": "Só respira debaixo d'água." }
    ]
  },
  {
    "id": "invisible_stalker",
    "name": "Perseguidor Invisível",
    "category": "Elemental",
    "size": "Médio",
    "challenge_rating": "6",
    "combat": { "hp": { "current": 104, "max": 104 }, "ca": 14, "speed": "50ft, voo 50ft", "initiative_mod": 4 },
    "attributes": { "str": 16, "dex": 19, "con": 14, "int": 10, "wis": 15, "cha": 11 },
    "visuals": { "token_img": "/tokens/enemies/invisible_stalker.jpg", "aura_preset": "air_distortion", "scale": 1.0 },
    "actions": [{ "name": "Pancada", "mod": "+6", "damage": "2d8 + 3" }],
    "traits": [
      { "name": "Invisibilidade Invisível", "desc": "É permanentemente invisível." },
      { "name": "Rastreador Implacável", "desc": "Sabe a localização do seu alvo em qualquer lugar do mesmo plano." }
    ]
  },
  {
    "id": "oni",
    "name": "Oni",
    "category": "Gigante",
    "size": "Grande",
    "challenge_rating": "7",
    "combat": { "hp": { "current": 110, "max": 110 }, "ca": 16, "speed": "30ft, voo 30ft", "initiative_mod": 0 },
    "attributes": { "str": 19, "dex": 11, "con": 16, "int": 14, "wis": 12, "cha": 15 },
    "visuals": { "token_img": "/tokens/enemies/oni.jpg", "aura_preset": "dark_glamour", "scale": 1.5 },
    "actions": [
      { "name": "Glaive", "mod": "+7", "damage": "2d10 + 4" },
      { "name": "Cone de Frio (1/dia)", "desc": "Causa 8d8 de dano de frio." }
    ],
    "traits": [
      { "name": "Regeneração", "desc": "Recupera 10 HP no início do turno." },
      { "name": "Mudar Forma", "desc": "Pode se transformar em humanoides ou gigantes específicos." }
    ]
  },
  {
    "id": "shield_guardian",
    "name": "Guardião de Escudo",
    "category": "Constructo",
    "size": "Grande",
    "challenge_rating": "7",
    "combat": { "hp": { "current": 142, "max": 142 }, "ca": 17, "speed": "30ft", "initiative_mod": -1 },
    "attributes": { "str": 18, "dex": 8, "con": 18, "int": 7, "wis": 10, "cha": 3 },
    "visuals": { "token_img": "/tokens/enemies/shield_guardian.jpg", "aura_preset": "protective_aura", "scale": 1.6 },
    "actions": [{ "name": "Pancada", "mod": "+7", "damage": "2d6 + 4" }],
    "traits": [
      { "name": "Regeneração", "desc": "Recupera 10 HP por turno." },
      { "name": "Vínculo de Dano", "desc": "Transfere metade do dano sofrido pelo mestre para si." }
    ]
  },{
    "id": "pteranodon",
    "name": "Pteranodonte",
    "category": "Besta",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 13, "max": 13 }, "ca": 13, "speed": "10ft, voo 60ft", "initiative_mod": 2 },
    "attributes": { "str": 12, "dex": 15, "con": 10, "int": 2, "wis": 9, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/pteranodon.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Bico", "mod": "+3", "damage": "1d6 + 1" }],
    "traits": [{ "name": "Mergulho", "desc": "Não provoca ataques de oportunidade ao voar para fora do alcance de um inimigo." }]
  },
  {
    "id": "kuo_toa",
    "name": "Kuo-toa",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 18, "max": 18 }, "ca": 13, "speed": "30ft, natação 30ft", "initiative_mod": 0 },
    "attributes": { "str": 13, "dex": 10, "con": 11, "int": 11, "wis": 10, "cha": 8 },
    "visuals": { "token_img": "/tokens/enemies/kuo_toa.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [
      { "name": "Lança", "mod": "+3", "damage": "1d6 + 1" },
      { "name": "Rede", "desc": "Alvo fica impedido até se libertar." }
    ],
    "traits": [
      { "name": "Sentido Incisivo", "desc": "Percebe criaturas invisíveis ou no plano etéreo a até 9m." },
      { "name": "Pele Escorregadia", "desc": "Tem vantagem para escapar de agarrar." }
    ]
  },
  {
    "id": "gibbering_mouther",
    "name": "Tagarela (Gibbering Mouther)",
    "category": "Aberração",
    "size": "Médio",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 67, "max": 67 }, "ca": 9, "speed": "10ft, natação 10ft", "initiative_mod": -1 },
    "attributes": { "str": 10, "dex": 8, "con": 16, "int": 3, "wis": 10, "cha": 6 },
    "visuals": { "token_img": "/tokens/enemies/gibbering_mouther.jpg", "aura_preset": "madness_aura", "scale": 1.2 },
    "actions": [
      { "name": "Mordidas", "mod": "+2", "damage": "5d6" },
      { "name": "Cuspe de Cegueira", "desc": "Explosão química que cega criaturas em 1,5m." }
    ],
    "traits": [
      { "name": "Balbucio", "desc": "Criaturas em 6m devem passar em TR de Sabedoria ou ficam confusas." },
      { "name": "Terreno Aberrante", "desc": "O chão em volta dela é terreno difícil." }
    ]
  },
  {
    "id": "griffon",
    "name": "Grifo",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 59, "max": 59 }, "ca": 12, "speed": "30ft, voo 80ft", "initiative_mod": 2 },
    "attributes": { "str": 18, "dex": 15, "con": 16, "int": 2, "wis": 13, "cha": 8 },
    "visuals": { "token_img": "/tokens/enemies/griffon.jpg", "aura_preset": null, "scale": 1.5 },
    "actions": [{ "name": "Multiataque", "desc": "Faz um ataque de bico e um de garras." }],
    "traits": [{ "name": "Visão Aguçada", "desc": "Vantagem em testes de Percepção visual." }]
  },
  {
    "id": "ankheg",
    "name": "Ankheg",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 39, "max": 39 }, "ca": 14, "speed": "30ft, escavação 10ft", "initiative_mod": 0 },
    "attributes": { "str": 17, "dex": 11, "con": 13, "int": 1, "wis": 13, "cha": 6 },
    "visuals": { "token_img": "/tokens/enemies/ankheg.jpg", "aura_preset": "acid_drip", "scale": 1.6 },
    "actions": [
      { "name": "Mordida", "mod": "+5", "damage": "2d6+3 + 1d6 ácido", "desc": "Alvo fica agarrado." },
      { "name": "Jato de Ácido (Recarga 6)", "desc": "Linha de 9m causando 3d6 de dano ácido." }
    ],
    "traits": []
  },
  {
    "id": "hell_hound",
    "name": "Cão Infernal",
    "category": "Corruptor",
    "size": "Médio",
    "challenge_rating": "3",
    "combat": { "hp": { "current": 45, "max": 45 }, "ca": 15, "speed": "50ft", "initiative_mod": 1 },
    "attributes": { "str": 17, "dex": 12, "con": 14, "int": 6, "wis": 13, "cha": 6 },
    "visuals": { "token_img": "/tokens/enemies/hell_hound.jpg", "aura_preset": "fire_breath", "scale": 1.1 },
    "actions": [
      { "name": "Mordida", "mod": "+5", "damage": "1d8+3 + 2d6 fogo" },
      { "name": "Sopro de Fogo (Recarga 5-6)", "desc": "Cone de 4.5m causando 6d6 de dano de fogo." }
    ],
    "traits": [{ "name": "Táticas de Matilha", "desc": "Vantagem no ataque se houver um aliado próximo ao alvo." }]
  },
  {
    "id": "giant_elk",
    "name": "Alce Gigante",
    "category": "Besta",
    "size": "Enorme",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 42, "max": 42 }, "ca": 14, "speed": "60ft", "initiative_mod": 3 },
    "attributes": { "str": 19, "dex": 16, "con": 14, "int": 7, "wis": 14, "cha": 10 },
    "visuals": { "token_img": "/tokens/enemies/giant_elk.jpg", "aura_preset": null, "scale": 2.1 },
    "actions": [
      { "name": "Chifrada", "mod": "+6", "damage": "4d6 + 4" },
      { "name": "Casco", "mod": "+6", "damage": "4d8 + 4" }
    ],
    "traits": [{ "name": "Investida Atropelante", "desc": "Se mover 6m e atingir, causa dano extra e pode derrubar o alvo." }]
  },
  {
    "id": "pegasus",
    "name": "Pégaso",
    "category": "Celestial",
    "size": "Grande",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 59, "max": 59 }, "ca": 12, "speed": "60ft, voo 90ft", "initiative_mod": 2 },
    "attributes": { "str": 18, "dex": 15, "con": 16, "int": 10, "wis": 15, "cha": 13 },
    "visuals": { "token_img": "/tokens/enemies/pegasus.jpg", "aura_preset": "divine_wind", "scale": 1.5 },
    "actions": [{ "name": "Cascos", "mod": "+6", "damage": "2d6 + 4" }],
    "traits": []
  },
  {
    "id": "yochlol",
    "name": "Yochlol (Demônio Aranha)",
    "category": "Corruptor",
    "size": "Médio",
    "challenge_rating": "10",
    "combat": { "hp": { "current": 136, "max": 136 }, "ca": 15, "speed": "30ft, escalada 30ft", "initiative_mod": 2 },
    "attributes": { "str": 15, "dex": 14, "con": 18, "int": 13, "wis": 15, "cha": 15 },
    "visuals": { "token_img": "/tokens/enemies/demon_yochlol.jpg", "aura_preset": "web_mist", "scale": 1.2 },
    "actions": [
      { "name": "Pancada", "mod": "+6", "damage": "1d10+2 + 6d6 veneno" },
      { "name": "Névoa Tóxica", "desc": "Transforma-se em uma névoa que envenena criaturas." }
    ],
    "traits": [{ "name": "Mudar Forma", "desc": "Pode se transformar em uma drow ou uma aranha gigante." }]
  },
  {
    "id": "tyrannosaurus_rex",
    "name": "Tiranossauro Rex",
    "category": "Besta",
    "size": "Gargantuesco",
    "challenge_rating": "8",
    "combat": { "hp": { "current": 136, "max": 136 }, "ca": 13, "speed": "50ft", "initiative_mod": 0 },
    "attributes": { "str": 25, "dex": 10, "con": 19, "int": 2, "wis": 12, "cha": 9 },
    "visuals": { "token_img": "/tokens/enemies/tyrannosaurus_rex.jpg", "aura_preset": "frightful_roar", "scale": 2.8 },
    "actions": [
      { "name": "Mordida", "mod": "+10", "damage": "4d12 + 7", "desc": "Alvo fica agarrado." },
      { "name": "Cauda", "mod": "+10", "damage": "3d8 + 7" }
    ],
    "traits": []
  },{
    "id": "grell",
    "name": "Grell",
    "category": "Aberração",
    "size": "Médio",
    "challenge_rating": "3",
    "combat": { "hp": { "current": 55, "max": 55 }, "ca": 12, "speed": "10ft, voo 30ft", "initiative_mod": 2 },
    "attributes": { "str": 15, "dex": 14, "con": 13, "int": 12, "wis": 11, "cha": 9 },
    "visuals": { "token_img": "/tokens/enemies/grell.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [
      { "name": "Tentáculos", "mod": "+4", "damage": "1d10 + 2", "desc": "Alvo deve passar em TR de CON CD 11 ou fica paralisado." },
      { "name": "Bico", "mod": "+4", "damage": "2d4 + 2" }
    ],
    "traits": [{ "name": "Percepção Cega", "desc": "Possui percepção cega em um raio de 18m." }]
  },
  {
    "id": "xorn",
    "name": "Xorn",
    "category": "Elemental",
    "size": "Médio",
    "challenge_rating": "5",
    "combat": { "hp": { "current": 73, "max": 73 }, "ca": 19, "speed": "20ft, escavação 20ft", "initiative_mod": 0 },
    "attributes": { "str": 17, "dex": 10, "con": 22, "int": 11, "wis": 10, "cha": 11 },
    "visuals": { "token_img": "/tokens/enemies/xorn.jpg", "aura_preset": "stone_skin", "scale": 1.1 },
    "actions": [
      { "name": "Multiataque", "desc": "Faz três ataques de garras e um de mordida." },
      { "name": "Mordida", "mod": "+6", "damage": "3d6 + 3" }
    ],
    "traits": [
      { "name": "Misturar-se à Rocha", "desc": "Pode atravessar rocha sólida sem perturbá-la." },
      { "name": "Sentido de Tesouro", "desc": "Sabe a localização exata de metais e pedras preciosas em 18m." }
    ]
  },
  {
    "id": "young_black_dragon",
    "name": "Dragão Negro Jovem",
    "category": "Dragão",
    "size": "Grande",
    "challenge_rating": "7",
    "combat": { "hp": { "current": 127, "max": 127 }, "ca": 18, "speed": "40ft, voo 80ft", "initiative_mod": 2 },
    "attributes": { "str": 19, "dex": 14, "con": 17, "int": 12, "wis": 11, "cha": 15 },
    "visuals": { "token_img": "/tokens/enemies/black_dragon.jpg", "aura_preset": "acid_pool", "scale": 1.8 },
    "actions": [{ "name": "Sopro Ácido", "desc": "Linha de 9m causando 11d8 de dano ácido." }],
    "traits": [{ "name": "Anfíbio", "desc": "Pode respirar ar e água." }]
  },
  {
    "id": "young_blue_dragon",
    "name": "Dragão Azul Jovem",
    "category": "Dragão",
    "size": "Grande",
    "challenge_rating": "9",
    "combat": { "hp": { "current": 152, "max": 152 }, "ca": 18, "speed": "40ft, voo 80ft", "initiative_mod": 0 },
    "attributes": { "str": 21, "dex": 10, "con": 19, "int": 14, "wis": 13, "cha": 17 },
    "visuals": { "token_img": "/tokens/enemies/blue_dragon.jpg", "aura_preset": "lightning_aura", "scale": 1.9 },
    "actions": [{ "name": "Sopro Elétrico", "desc": "Linha de 18m causando 10d10 de dano elétrico." }],
    "traits": []
  },
  {
    "id": "young_green_dragon",
    "name": "Dragão Verde Jovem",
    "category": "Dragão",
    "size": "Grande",
    "challenge_rating": "8",
    "combat": { "hp": { "current": 136, "max": 136 }, "ca": 18, "speed": "40ft, voo 80ft", "initiative_mod": 1 },
    "attributes": { "str": 19, "dex": 12, "con": 17, "int": 16, "wis": 13, "cha": 15 },
    "visuals": { "token_img": "/tokens/enemies/green_dragon.jpg", "aura_preset": "poison_cloud", "scale": 1.8 },
    "actions": [{ "name": "Sopro Venenoso", "desc": "Cone de 9m causando 12d6 de dano de veneno." }],
    "traits": [{ "name": "Anfíbio", "desc": "Pode respirar ar e água." }]
  },
  {
    "id": "vrock",
    "name": "Vrock",
    "category": "Corruptor",
    "size": "Grande",
    "challenge_rating": "6",
    "combat": { "hp": { "current": 104, "max": 104 }, "ca": 15, "speed": "20ft, voo 60ft", "initiative_mod": 2 },
    "attributes": { "str": 17, "dex": 15, "con": 18, "int": 8, "wis": 13, "cha": 8 },
    "visuals": { "token_img": "/tokens/enemies/demon_vrock.jpg", "aura_preset": "spore_cloud", "scale": 1.6 },
    "actions": [
      { "name": "Grito Atordoante", "desc": "Emite um grito que atordoa criaturas em 6m." },
      { "name": "Esporos", "desc": "Causa 1d10 de dano por turno em criaturas próximas." }
    ],
    "traits": [{ "name": "Resistência Mágica", "desc": "Vantagem contra magias." }]
  },
  {
    "id": "panther",
    "name": "Pantera",
    "category": "Besta",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 13, "max": 13 }, "ca": 12, "speed": "50ft, escalada 40ft", "initiative_mod": 2 },
    "attributes": { "str": 14, "dex": 15, "con": 10, "int": 3, "wis": 14, "cha": 7 },
    "visuals": { "token_img": "/tokens/enemies/panther.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Garras", "mod": "+4", "damage": "1d4 + 2" }],
    "traits": [
      { "name": "Bote", "desc": "Se mover 6m e atingir, pode derrubar o alvo." },
      { "name": "Olfato Aguçado", "desc": "Vantagem em Percepção pelo faro." }
    ]
  },
  {
    "id": "cat",
    "name": "Gato",
    "category": "Besta",
    "size": "Diminuto",
    "challenge_rating": "0",
    "combat": { "hp": { "current": 2, "max": 2 }, "ca": 12, "speed": "40ft, escalada 30ft", "initiative_mod": 2 },
    "attributes": { "str": 3, "dex": 15, "con": 10, "int": 3, "wis": 12, "cha": 7 },
    "visuals": { "token_img": "/tokens/enemies/cat.jpg", "aura_preset": null, "scale": 0.5 },
    "actions": [{ "name": "Garras", "mod": "+0", "damage": "1" }],
    "traits": [{ "name": "Olfato Aguçado", "desc": "Vantagem em Percepção pelo faro." }]
  },
  {
    "id": "rat",
    "name": "Rato",
    "category": "Besta",
    "size": "Diminuto",
    "challenge_rating": "0",
    "combat": { "hp": { "current": 1, "max": 1 }, "ca": 10, "speed": "20ft", "initiative_mod": 0 },
    "attributes": { "str": 2, "dex": 11, "con": 9, "int": 2, "wis": 10, "cha": 4 },
    "visuals": { "token_img": "/tokens/enemies/rat.jpg", "aura_preset": null, "scale": 0.4 },
    "actions": [{ "name": "Mordida", "mod": "+0", "damage": "1" }],
    "traits": [{ "name": "Olfato Aguçado", "desc": "Vantagem em Percepção pelo faro." }]
  },
  {
    "id": "raven",
    "name": "Corvo",
    "category": "Besta",
    "size": "Diminuto",
    "challenge_rating": "0",
    "combat": { "hp": { "current": 1, "max": 1 }, "ca": 12, "speed": "10ft, voo 50ft", "initiative_mod": 2 },
    "attributes": { "str": 2, "dex": 14, "con": 8, "int": 2, "wis": 12, "cha": 6 },
    "visuals": { "token_img": "/tokens/enemies/raven.jpg", "aura_preset": null, "scale": 0.5 },
    "actions": [{ "name": "Bicada", "mod": "+4", "damage": "1" }],
    "traits": [{ "name": "Mimetismo", "desc": "Pode imitar sons simples." }]
  },{
    "id": "lizardfolk",
    "name": "Homem-Lagarto",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 22, "max": 22 }, "ca": 15, "speed": "30ft, natação 30ft", "initiative_mod": 0 },
    "attributes": { "str": 15, "dex": 10, "con": 13, "int": 7, "wis": 12, "cha": 7 },
    "visuals": { "token_img": "/tokens/enemies/lizardfolk.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [
      { "name": "Multiataque", "desc": "Faz dois ataques: um com a mordida e outro com porrete ou escudo." },
      { "name": "Mordida", "mod": "+4", "damage": "1d6 + 2" }
    ],
    "traits": [{ "name": "Prender a Respiração", "desc": "Pode prender a respiração por até 15 minutos." }]
  },
  {
    "id": "quadrone",
    "name": "Quadrone",
    "category": "Constructo",
    "size": "Médio",
    "challenge_rating": "1",
    "combat": { "hp": { "current": 22, "max": 22 }, "ca": 16, "speed": "30ft, voo 30ft", "initiative_mod": 1 },
    "attributes": { "str": 12, "dex": 13, "con": 12, "int": 10, "wis": 10, "cha": 7 },
    "visuals": { "token_img": "/tokens/enemies/quadrone.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [
      { "name": "Multiataque", "desc": "Faz dois ataques de arco curto ou quatro ataques de braços." },
      { "name": "Arco Curto", "mod": "+3", "damage": "1d6 + 1" }
    ],
    "traits": [{ "name": "Mente Axiomática", "desc": "Não pode ser compelido a agir contra as leis de Mechanus." }]
  },
  {
    "id": "pentadrone",
    "name": "Pentadrone",
    "category": "Constructo",
    "size": "Grande",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 32, "max": 32 }, "ca": 16, "speed": "40ft", "initiative_mod": 1 },
    "attributes": { "str": 15, "dex": 13, "con": 12, "int": 10, "wis": 10, "cha": 7 },
    "visuals": { "token_img": "/tokens/enemies/pentadrone.jpg", "aura_preset": null, "scale": 1.4 },
    "actions": [
      { "name": "Multiataque", "desc": "Faz cinco ataques de braços." },
      { "name": "Gás de Paralisia", "desc": "Exala gás em um cone de 1,5m; alvo deve passar em TR de CON ou fica paralisado." }
    ],
    "traits": []
  },
  {
    "id": "hill_giant",
    "name": "Gigante das Colinas",
    "category": "Gigante",
    "size": "Enorme",
    "challenge_rating": "5",
    "combat": { "hp": { "current": 105, "max": 105 }, "ca": 13, "speed": "40ft", "initiative_mod": -1 },
    "attributes": { "str": 21, "dex": 8, "con": 19, "int": 5, "wis": 9, "cha": 6 },
    "visuals": { "token_img": "/tokens/enemies/hill_giant.jpg", "aura_preset": null, "scale": 2.2 },
    "actions": [
      { "name": "Grande Clava", "mod": "+8", "damage": "3d8 + 5" },
      { "name": "Rocha", "mod": "+8", "damage": "4d10 + 5", "range": "60/240ft" }
    ],
    "traits": []
  },
  {
    "id": "ettin",
    "name": "Ettin",
    "category": "Gigante",
    "size": "Grande",
    "challenge_rating": "4",
    "combat": { "hp": { "current": 85, "max": 85 }, "ca": 12, "speed": "40ft", "initiative_mod": -1 },
    "attributes": { "str": 21, "dex": 8, "con": 17, "int": 6, "wis": 10, "cha": 8 },
    "visuals": { "token_img": "/tokens/enemies/ettin.jpg", "aura_preset": null, "scale": 1.6 },
    "actions": [{ "name": "Multiataque", "desc": "Faz dois ataques: um com o machado de batalha e um com o mangual." }],
    "traits": [
      { "name": "Duas Cabeças", "desc": "Tem vantagem em testes de Percepção e em TR contra ficar cego, surdo, atordoado ou inconsciente." },
      { "name": "Acordar Vigilante", "desc": "Enquanto dorme, uma das cabeças está sempre acordada." }
    ]
  },
  {
    "id": "gnoll_pack_lord",
    "name": "Gnoll Senhor da Matilha",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 49, "max": 49 }, "ca": 15, "speed": "30ft", "initiative_mod": 2 },
    "attributes": { "str": 16, "dex": 14, "con": 13, "int": 8, "wis": 11, "cha": 12 },
    "visuals": { "token_img": "/tokens/enemies/gnoll.jpg", "aura_preset": "leader_aura", "scale": 1.1 },
    "actions": [
      { "name": "Multiataque", "desc": "Faz dois ataques de maça ou arco longo." },
      { "name": "Incitamento à Frenesi", "desc": "Um aliado gnoll que possa ver o pack lord pode usar sua reação para fazer um ataque." }
    ],
    "traits": [{ "name": "Frenesi Sangrento", "desc": "Quando reduz uma criatura a 0 HP, pode se mover metade do deslocamento e atacar." }]
  },
  {
    "id": "hobgoblin",
    "name": "Hobgoblin",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 11, "max": 11 }, "ca": 18, "speed": "30ft", "initiative_mod": 1 },
    "attributes": { "str": 13, "dex": 12, "con": 12, "int": 10, "wis": 10, "cha": 9 },
    "visuals": { "token_img": "/tokens/enemies/hobgoblin.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Espada Longa", "mod": "+3", "damage": "1d8 + 1" }],
    "traits": [{ "name": "Vantagem Marcial", "desc": "Causa +2d6 de dano se o alvo estiver a 1,5m de um aliado do hobgoblin." }]
  },
  {
    "id": "mummy",
    "name": "Múmia",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "3",
    "combat": { "hp": { "current": 58, "max": 58 }, "ca": 11, "speed": "20ft", "initiative_mod": -1 },
    "attributes": { "str": 16, "dex": 8, "con": 15, "int": 6, "wis": 10, "cha": 12 },
    "visuals": { "token_img": "/tokens/enemies/mummy.jpg", "aura_preset": "sand_aura", "scale": 1.0 },
    "actions": [
      { "name": "Olhar Apavorante", "desc": "Alvo deve passar em TR de Sabedoria ou fica amedrontado e paralisado." },
      { "name": "Pancada Putrefata", "mod": "+5", "damage": "2d6+3 + 3d6 necrótico", "desc": "O alvo contrai a maldição da podridão da múmia." }
    ],
    "traits": [{ "name": "Vulnerabilidade ao Fogo", "desc": "Sofre dano dobrado de fogo." }]
  },{
    "id": "planetar",
    "name": "Planetário",
    "category": "Celestial",
    "size": "Grande",
    "challenge_rating": "16",
    "combat": { "hp": { "current": 200, "max": 200 }, "ca": 19, "speed": "40ft, voo 120ft", "initiative_mod": 5 },
    "attributes": { "str": 24, "dex": 20, "con": 24, "int": 19, "wis": 22, "cha": 25 },
    "visuals": { "token_img": "/tokens/enemies/planetar.jpg", "aura_preset": "holy_glow", "scale": 1.7 },
    "actions": [
      { "name": "Espada Grande Angelical", "mod": "+12", "damage": "4d6+7 + 5d8 radiante" }
    ],
    "traits": [
      { "name": "Consciência Divina", "desc": "Sabe quando ouve uma mentira." },
      { "name": "Armas Angélicas", "desc": "Ataques causam 5d8 radiante extra (incluso)." }
    ]
  },
  {
    "id": "chuul",
    "name": "Chuul",
    "category": "Aberração",
    "size": "Grande",
    "challenge_rating": "4",
    "combat": { "hp": { "current": 93, "max": 93 }, "ca": 16, "speed": "30ft, natação 30ft", "initiative_mod": 0 },
    "attributes": { "str": 19, "dex": 10, "con": 16, "int": 5, "wis": 11, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/chuul.jpg", "aura_preset": null, "scale": 1.6 },
    "actions": [
      { "name": "Pinças", "mod": "+6", "damage": "2d6 + 4", "desc": "Alvo fica agarrado." },
      { "name": "Tentáculos", "desc": "Alvo agarrado deve passar em TR CON ou fica paralisado." }
    ],
    "traits": [{ "name": "Sentido de Magia", "desc": "Detecta magia a até 36m." }]
  },
  {
    "id": "roper",
    "name": "Roper",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "5",
    "combat": { "hp": { "current": 93, "max": 93 }, "ca": 20, "speed": "10ft, escalada 10ft", "initiative_mod": -1 },
    "attributes": { "str": 18, "dex": 8, "con": 17, "int": 7, "wis": 16, "cha": 6 },
    "visuals": { "token_img": "/tokens/enemies/roper.jpg", "aura_preset": "stone_skin", "scale": 1.5 },
    "actions": [
      { "name": "Gavinhas", "mod": "+7", "desc": "Agarra até 4 criaturas a 15m de distância." },
      { "name": "Mordida", "mod": "+7", "damage": "4d8 + 4" }
    ],
    "traits": [
      { "name": "Falsa Aparência", "desc": "Parece uma estalactite ou estalagmite enquanto imóvel." },
      { "name": "Gavinhas Agarradoras", "desc": "Pode puxar criaturas agarradas 7,5m por turno." }
    ]
  },
  {
    "id": "triceratops",
    "name": "Tricerátops",
    "category": "Besta",
    "size": "Enorme",
    "challenge_rating": "5",
    "combat": { "hp": { "current": 95, "max": 95 }, "ca": 13, "speed": "50ft", "initiative_mod": -1 },
    "attributes": { "str": 22, "dex": 9, "con": 17, "int": 2, "wis": 11, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/triceratops.jpg", "aura_preset": null, "scale": 2.2 },
    "actions": [{ "name": "Chifrada", "mod": "+9", "damage": "4d8 + 6" }],
    "traits": [{ "name": "Investida Atropelante", "desc": "Se mover 6m e atingir, o alvo pode cair caído e sofrer um ataque de pisoteio." }]
  },
  {
    "id": "deva",
    "name": "Deva",
    "category": "Celestial",
    "size": "Médio",
    "challenge_rating": "10",
    "combat": { "hp": { "current": 136, "max": 136 }, "ca": 17, "speed": "30ft, voo 90ft", "initiative_mod": 4 },
    "attributes": { "str": 18, "dex": 18, "con": 18, "int": 17, "wis": 20, "cha": 20 },
    "visuals": { "token_img": "/tokens/enemies/deva.jpg", "aura_preset": "holy_light", "scale": 1.1 },
    "actions": [
      { "name": "Maça de Armas", "mod": "+8", "damage": "1d6+4 + 4d8 radiante" }
    ],
    "traits": [{ "name": "Mudar Forma", "desc": "Pode se transformar em humanoide ou besta de CR 10 ou menor." }]
  },
  {
    "id": "scout",
    "name": "Batedor (Scout)",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 16, "max": 16 }, "ca": 13, "speed": "30ft", "initiative_mod": 2 },
    "attributes": { "str": 11, "dex": 14, "con": 12, "int": 11, "wis": 13, "cha": 11 },
    "visuals": { "token_img": "/tokens/enemies/scout.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [
      { "name": "Espada Curta", "mod": "+4", "damage": "1d6 + 2" },
      { "name": "Arco Longo", "mod": "+4", "damage": "1d8 + 2" }
    ],
    "traits": [{ "name": "Explorador", "desc": "Vantagem em testes de Sobrevivência e Natureza." }]
  },
  {
    "id": "remanhaz_young",
    "name": "Remorhaz Jovem",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "5",
    "combat": { "hp": { "current": 93, "max": 93 }, "ca": 14, "speed": "30ft, escavação 20ft", "initiative_mod": 1 },
    "attributes": { "str": 18, "dex": 13, "con": 18, "int": 3, "wis": 10, "cha": 4 },
    "visuals": { "token_img": "/tokens/enemies/remorhaz.jpg", "aura_preset": "heat_aura", "scale": 1.6 },
    "actions": [{ "name": "Mordida", "mod": "+7", "damage": "2d10+4 + 2d6 fogo" }],
    "traits": [{ "name": "Corpo Aquecido", "desc": "Criaturas que o tocam sofrem 2d6 de fogo." }]
  },
  {
    "id": "mummy_lord",
    "name": "Lorde Múmia",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "15",
    "combat": { "hp": { "current": 97, "max": 97 }, "ca": 17, "speed": "20ft", "initiative_mod": 0 },
    "attributes": { "str": 18, "dex": 10, "con": 17, "int": 11, "wis": 18, "cha": 16 },
    "visuals": { "token_img": "/tokens/enemies/mummy_lord.jpg", "aura_preset": "sand_storm", "scale": 1.1 },
    "actions": [
      { "name": "Pancada Apodrecedora", "mod": "+9", "damage": "3d6+4 + 6d6 necrótico" },
      { "name": "Canalizar Energia Negativa", "desc": "Impede cura em área por um turno." }
    ],
    "traits": [{ "name": "Resistência Mágica", "desc": "Vantagem contra magias." }]
  },{
    "id": "grimlock",
    "name": "Grimlock",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 11, "max": 11 }, "ca": 11, "speed": "30ft", "initiative_mod": 1 },
    "attributes": { "str": 16, "dex": 12, "con": 12, "int": 9, "wis": 8, "cha": 6 },
    "visuals": { "token_img": "/tokens/enemies/grimlock.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Maça de Pedra", "mod": "+5", "damage": "1d6 + 3" }],
    "traits": [
      { "name": "Percepção Cega", "desc": "Pode perceber o ambiente em 9m sem usar os olhos." },
      { "name": "Camuflagem de Pedra", "desc": "Vantagem em Furtividade em terrenos rochosos." }
    ]
  },
  {
    "id": "hook_horror",
    "name": "Horror de Gancho",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "3",
    "combat": { "hp": { "current": 75, "max": 75 }, "ca": 15, "speed": "30ft, escalada 30ft", "initiative_mod": 0 },
    "attributes": { "str": 18, "dex": 10, "con": 15, "int": 6, "wis": 12, "cha": 7 },
    "visuals": { "token_img": "/tokens/enemies/hook_horror.jpg", "aura_preset": null, "scale": 1.5 },
    "actions": [{ "name": "Ganchos", "mod": "+6", "damage": "2d6 + 4", "desc": "Faz dois ataques de ganchos." }],
    "traits": [{ "name": "Ecolocalização", "desc": "Não pode usar percepção cega se estiver surdo." }]
  },
  {
    "id": "ice_mephit",
    "name": "Mephit do Gelo",
    "category": "Elemental",
    "size": "Pequeno",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 21, "max": 21 }, "ca": 11, "speed": "30ft, voo 30ft", "initiative_mod": 1 },
    "attributes": { "str": 7, "dex": 13, "con": 10, "int": 9, "wis": 11, "cha": 12 },
    "visuals": { "token_img": "/tokens/enemies/ice_mephit.jpg", "aura_preset": "cold_aura", "scale": 0.8 },
    "actions": [
      { "name": "Sopro de Gelo", "desc": "Cone de 4.5m causando 2d4 de frio e reduzindo velocidade." },
      { "name": "Conjuração (1/dia)", "desc": "Pode conjurar Nuvem de Nevoeiro." }
    ],
    "traits": [{ "name": "Explosão de Morte", "desc": "Explode em estilhaços de gelo ao morrer." }]
  },
  {
    "id": "magma_mephit",
    "name": "Mephit de Magma",
    "category": "Elemental",
    "size": "Pequeno",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 22, "max": 22 }, "ca": 11, "speed": "30ft, voo 30ft", "initiative_mod": 0 },
    "attributes": { "str": 8, "dex": 12, "con": 12, "int": 7, "wis": 10, "cha": 10 },
    "visuals": { "token_img": "/tokens/enemies/magma_mephit.jpg", "aura_preset": "burning_aura", "scale": 0.8 },
    "actions": [{ "name": "Sopro de Fogo", "desc": "Cone de 4.5m causando 2d6 de dano de fogo." }],
    "traits": [{ "name": "Vulnerabilidade ao Frio", "desc": "Sofre dano dobrado de gelo." }]
  },
  {
    "id": "giant_toad",
    "name": "Sapo Gigante",
    "category": "Besta",
    "size": "Grande",
    "challenge_rating": "1",
    "combat": { "hp": { "current": 39, "max": 39 }, "ca": 11, "speed": "20ft, natação 40ft", "initiative_mod": 1 },
    "attributes": { "str": 15, "dex": 13, "con": 13, "int": 2, "wis": 10, "cha": 3 },
    "visuals": { "token_img": "/tokens/enemies/giant_toad.jpg", "aura_preset": null, "scale": 1.4 },
    "actions": [{ "name": "Mordida", "mod": "+4", "damage": "1d10 + 2", "desc": "Alvo fica agarrado e pode ser engolido no próximo turno." }],
    "traits": [{ "name": "Salto Prolongado", "desc": "Seu salto longo é de até 6m." }]
  },
  {
    "id": "riding_horse",
    "name": "Cavalo de Montaria",
    "category": "Besta",
    "size": "Grande",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 13, "max": 13 }, "ca": 10, "speed": "60ft", "initiative_mod": 0 },
    "attributes": { "str": 16, "dex": 10, "con": 12, "int": 2, "wis": 11, "cha": 7 },
    "visuals": { "token_img": "/tokens/enemies/horse.jpg", "aura_preset": null, "scale": 1.4 },
    "actions": [{ "name": "Casco", "mod": "+5", "damage": "2d4 + 3" }],
    "traits": []
  },
  {
    "id": "winter_wolf",
    "name": "Lobo do Inverno",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "3",
    "combat": { "hp": { "current": 75, "max": 75 }, "ca": 13, "speed": "50ft", "initiative_mod": 1 },
    "attributes": { "str": 18, "dex": 13, "con": 14, "int": 7, "wis": 12, "cha": 8 },
    "visuals": { "token_img": "/tokens/enemies/winter_wolf.jpg", "aura_preset": "cold_aura", "scale": 1.5 },
    "actions": [
      { "name": "Mordida", "mod": "+6", "damage": "2d6+4 + 1d6 frio" },
      { "name": "Sopro de Gelo (Recarga 5-6)", "desc": "Cone de 4.5m causando 4d8 de frio." }
    ],
    "traits": [{ "name": "Camuflagem na Neve", "desc": "Vantagem em Furtividade no gelo/neve." }]
  },
  {
    "id": "wight",
    "name": "Inumano (Wight)",
    "category": "Morto-Vivo",
    "size": "Médio",
    "challenge_rating": "3",
    "combat": { "hp": { "current": 45, "max": 45 }, "ca": 14, "speed": "30ft", "initiative_mod": 2 },
    "attributes": { "str": 15, "dex": 14, "con": 16, "int": 10, "wis": 13, "cha": 15 },
    "visuals": { "token_img": "/tokens/enemies/wight.jpg", "aura_preset": "undead_aura", "scale": 1.0 },
    "actions": [
      { "name": "Espada Longa", "mod": "+4", "damage": "1d8 + 2" },
      { "name": "Dreno de Vida", "mod": "+4", "damage": "1d6+2 necrótico", "desc": "Reduz o HP máximo do alvo." }
    ],
    "traits": [{ "name": "Sensibilidade à Luz Solar", "desc": "Desvantagem em ataques sob o sol." }]
  },{
    "id": "adult_blue_dracolich",
    "name": "Dracolich Azul Adulto",
    "category": "Morto-Vivo",
    "size": "Enorme",
    "challenge_rating": "17",
    "combat": { "hp": { "current": 225, "max": 225 }, "ca": 19, "speed": "40ft, voo 80ft", "initiative_mod": 0 },
    "attributes": { "str": 25, "dex": 10, "con": 23, "int": 16, "wis": 15, "cha": 19 },
    "visuals": { "token_img": "/tokens/enemies/dracolich.jpg", "aura_preset": "necrotic_lightning", "scale": 2.2 },
    "actions": [
      { "name": "Sopro de Relâmpago", "desc": "Linha de 18m causando 12d10 de relâmpago." }
    ],
    "traits": [
      { "name": "Resistência Mágica", "desc": "Vantagem contra magias." },
      { "name": "Resistência Lendária", "desc": "Pode escolher passar em TR falho (3/dia)." }
    ]
  },
  {
    "id": "cambion",
    "name": "Cambion",
    "category": "Corruptor",
    "size": "Médio",
    "challenge_rating": "5",
    "combat": { "hp": { "current": 82, "max": 82 }, "ca": 19, "speed": "30ft, voo 60ft", "initiative_mod": 4 },
    "attributes": { "str": 18, "dex": 18, "con": 16, "int": 14, "wis": 12, "cha": 16 },
    "visuals": { "token_img": "/tokens/enemies/cambion.jpg", "aura_preset": "fiery_wings", "scale": 1.1 },
    "actions": [
      { "name": "Lança de Fogo", "mod": "+7", "damage": "1d6+4 + 1d6 fogo" },
      { "name": "Raio de Fogo", "mod": "+7", "damage": "4d6 fogo" }
    ],
    "traits": [{ "name": "Sopro do Abismo", "desc": "Pode conjurar magias inatas como Escuridão e Alterar-se." }]
  },
  {
    "id": "carrion_crawler",
    "name": "Rastejante Carrancudo",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 51, "max": 51 }, "ca": 13, "speed": "30ft, escalada 30ft", "initiative_mod": 1 },
    "attributes": { "str": 14, "dex": 13, "con": 16, "int": 1, "wis": 12, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/carrion_crawler.jpg", "aura_preset": null, "scale": 1.5 },
    "actions": [
      { "name": "Tentáculos", "mod": "+8", "desc": "Alvo deve passar em TR de CON CD 13 ou fica paralisado." },
      { "name": "Mordida", "mod": "+4", "damage": "2d4 + 2" }
    ],
    "traits": [{ "name": "Olfato Aguçado", "desc": "Vantagem em Percepção pelo cheiro de carniça." }]
  },
  {
    "id": "githzerai_zerth",
    "name": "Githzerai Zerth",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "6",
    "combat": { "hp": { "current": 84, "max": 84 }, "ca": 17, "speed": "30ft", "initiative_mod": 4 },
    "attributes": { "str": 13, "dex": 18, "con": 15, "int": 13, "wis": 17, "cha": 12 },
    "visuals": { "token_img": "/tokens/enemies/githzerai.jpg", "aura_preset": "psychic_aura", "scale": 1.0 },
    "actions": [
      { "name": "Golpe Desarmado", "mod": "+7", "damage": "2d8 + 4" },
      { "name": "Conjuração Inata", "desc": "Pode usar Escudo Bruxo e Ver o Invisível." }
    ],
    "traits": [{ "name": "Defesa Psíquica", "desc": "Soma Sabedoria na CA (incluso)." }]
  },
  {
    "id": "magmin",
    "name": "Magmin",
    "category": "Elemental",
    "size": "Pequeno",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 9, "max": 9 }, "ca": 14, "speed": "20ft", "initiative_mod": 2 },
    "attributes": { "str": 7, "dex": 15, "con": 12, "int": 8, "wis": 11, "cha": 10 },
    "visuals": { "token_img": "/tokens/enemies/magmin.jpg", "aura_preset": "burning_aura", "scale": 0.8 },
    "actions": [
      { "name": "Toque Ígneo", "mod": "+4", "damage": "2d6 fogo", "desc": "Pode incendiar objetos inflamáveis." }
    ],
    "traits": [{ "name": "Explosão de Morte", "desc": "Ao morrer, explode em fogo em 1,5m." }]
  },
  {
    "id": "nothic",
    "name": "Nótico",
    "category": "Aberração",
    "size": "Médio",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 45, "max": 45 }, "ca": 15, "speed": "30ft", "initiative_mod": 3 },
    "attributes": { "str": 14, "dex": 16, "con": 16, "int": 13, "wis": 10, "cha": 8 },
    "visuals": { "token_img": "/tokens/enemies/nothic.jpg", "aura_preset": "weird_gaze", "scale": 1.0 },
    "actions": [
      { "name": "Olhar Apodrecedor", "desc": "TR de CON CD 12 ou sofre 3d6 dano necrótico." },
      { "name": "Garras", "mod": "+4", "damage": "1d6 + 2" }
    ],
    "traits": [{ "name": "Visão Estranha", "desc": "Pode ler segredos de uma criatura que consiga ver." }]
  },
  {
    "id": "otyugh",
    "name": "Otyugh",
    "category": "Aberração",
    "size": "Grande",
    "challenge_rating": "5",
    "combat": { "hp": { "current": 114, "max": 114 }, "ca": 14, "speed": "20ft", "initiative_mod": 0 },
    "attributes": { "str": 16, "dex": 11, "con": 19, "int": 6, "wis": 13, "cha": 6 },
    "visuals": { "token_img": "/tokens/enemies/otyugh.jpg", "aura_preset": "stench_aura", "scale": 1.7 },
    "actions": [
      { "name": "Tentáculos", "mod": "+6", "damage": "2d8+3", "desc": "Alvo fica agarrado." }
    ],
    "traits": [{ "name": "Telepatia Limitada", "desc": "Pode transmitir imagens e sentimentos a até 36m." }]
  },
  {
    "id": "spectator",
    "name": "Espectador",
    "category": "Aberração",
    "size": "Médio",
    "challenge_rating": "3",
    "combat": { "hp": { "current": 39, "max": 39 }, "ca": 14, "speed": "0ft, voo 30ft", "initiative_mod": 2 },
    "attributes": { "str": 8, "dex": 14, "con": 14, "int": 13, "wis": 14, "cha": 11 },
    "visuals": { "token_img": "/tokens/enemies/spectator.jpg", "aura_preset": "eye_rays", "scale": 1.0 },
    "actions": [
      { "name": "Raios Oculares", "desc": "Dispara 2 raios: Confusão, Paralisia, Medo ou Ferimento." }
    ],
    "traits": [{ "name": "Refletir Magia", "desc": "Se passar em TR contra magia, pode refleti-la em outro alvo." }]
  },
  {
    "id": "young_white_dragon",
    "name": "Dragão Branco Jovem",
    "category": "Dragão",
    "size": "Grande",
    "challenge_rating": "6",
    "combat": { "hp": { "current": 133, "max": 133 }, "ca": 17, "speed": "40ft, voo 80ft, natação 40ft", "initiative_mod": 0 },
    "attributes": { "str": 18, "dex": 10, "con": 18, "int": 6, "wis": 11, "cha": 12 },
    "visuals": { "token_img": "/tokens/enemies/white_dragon.jpg", "aura_preset": "cold_aura", "scale": 1.8 },
    "actions": [{ "name": "Sopro de Gelo", "desc": "Cone de 9m causando 10d8 de frio." }],
    "traits": [{ "name": "Caminhar no Gelo", "desc": "Pode andar em superfícies geladas sem testes." }]
  },{
    "id": "animated_armor",
    "name": "Armadura Animada",
    "category": "Constructo",
    "size": "Médio",
    "challenge_rating": "1",
    "combat": { "hp": { "current": 33, "max": 33 }, "ca": 18, "speed": "25ft", "initiative_mod": 0 },
    "attributes": { "str": 14, "dex": 11, "con": 13, "int": 1, "wis": 3, "cha": 1 },
    "visuals": { "token_img": "/tokens/enemies/animated_armor.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Pancada", "mod": "+4", "damage": "1d6 + 2" }],
    "traits": [
      { "name": "Antimancia", "desc": "Fica incapacitada se estiver dentro de um campo antimagia." },
      { "name": "Falsa Aparência", "desc": "Parece uma armadura comum enquanto está imóvel." }
    ]
  },
  {
    "id": "death_tyrant",
    "name": "Tirano da Morte (Death Tyrant)",
    "category": "Morto-Vivo",
    "size": "Grande",
    "challenge_rating": "14",
    "combat": { "hp": { "current": 187, "max": 187 }, "ca": 19, "speed": "0ft, voo 20ft", "initiative_mod": 2 },
    "attributes": { "str": 10, "dex": 14, "con": 14, "int": 19, "wis": 15, "cha": 19 },
    "visuals": { "token_img": "/tokens/enemies/death_tyrant.jpg", "aura_preset": "negative_energy_cone", "scale": 1.6 },
    "actions": [{ "name": "Raios Oculares", "desc": "Dispara 3 raios aleatórios (Morte, Paralisia, etc)." }],
    "traits": [{ "name": "Olhar de Energia Negativa", "desc": "Criaturas em um cone de 45m não podem recuperar HP." }]
  },
  {
    "id": "deep_gnome_svirfneblin",
    "name": "Gnomo das Profundezas",
    "category": "Humanoide",
    "size": "Pequeno",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 16, "max": 16 }, "ca": 15, "speed": "20ft", "initiative_mod": 2 },
    "attributes": { "str": 15, "dex": 14, "con": 14, "int": 12, "wis": 10, "cha": 9 },
    "visuals": { "token_img": "/tokens/enemies/deep_gnome.jpg", "aura_preset": null, "scale": 0.8 },
    "actions": [{ "name": "Picareta de Guerra", "mod": "+4", "damage": "1d8 + 2" }],
    "traits": [{ "name": "Camuflagem na Pedra", "desc": "Vantagem em Furtividade em terrenos rochosos." }]
  },
  {
    "id": "faerie_dragon",
    "name": "Dragão Fadado",
    "category": "Dragão",
    "size": "Minúsculo",
    "challenge_rating": "1",
    "combat": { "hp": { "current": 14, "max": 14 }, "ca": 15, "speed": "10ft, voo 60ft", "initiative_mod": 5 },
    "attributes": { "str": 3, "dex": 20, "con": 13, "int": 14, "wis": 12, "cha": 16 },
    "visuals": { "token_img": "/tokens/enemies/faerie_dragon.jpg", "aura_preset": "euphoria_breath", "scale": 0.6 },
    "actions": [{ "name": "Sopro de Euforia", "desc": "Alvo deve passar em TR de SAB ou fica incapaz de atacar." }],
    "traits": [
      { "name": "Invisibilidade Superior", "desc": "Pode ficar invisível como ação bônus." },
      { "name": "Resistência Mágica", "desc": "Vantagem contra magias." }
    ]
  },
  {
    "id": "flumph",
    "name": "Flumph",
    "category": "Aberração",
    "size": "Pequeno",
    "challenge_rating": "1/8",
    "combat": { "hp": { "current": 7, "max": 7 }, "ca": 12, "speed": "5ft, voo 30ft", "initiative_mod": 2 },
    "attributes": { "str": 6, "dex": 15, "con": 10, "int": 14, "wis": 15, "cha": 11 },
    "visuals": { "token_img": "/tokens/enemies/flumph.jpg", "aura_preset": "telepathy_field", "scale": 0.7 },
    "actions": [{ "name": "Tentáculos", "mod": "+4", "damage": "1d4 + 2 + 1d4 ácido" }],
    "traits": [{ "name": "Telepatia Sensível", "desc": "Sente as emoções de criaturas a até 18m." }]
  },
  {
    "id": "homunculus",
    "name": "Homúnculo",
    "category": "Constructo",
    "size": "Minúsculo",
    "challenge_rating": "0",
    "combat": { "hp": { "current": 5, "max": 5 }, "ca": 13, "speed": "20ft, voo 40ft", "initiative_mod": 2 },
    "attributes": { "str": 4, "dex": 15, "con": 11, "int": 10, "wis": 10, "cha": 7 },
    "visuals": { "token_img": "/tokens/enemies/homunculus.jpg", "aura_preset": null, "scale": 0.5 },
    "actions": [{ "name": "Mordida", "mod": "+4", "damage": "1", "desc": "Alvo deve passar em TR CON ou fica envenenado." }],
    "traits": [{ "name": "Vínculo Telepático", "desc": "Mestre e homúnculo compartilham sentidos enquanto no mesmo plano." }]
  },
  {
    "id": "merrow",
    "name": "Merrow",
    "category": "Monstruosidade",
    "size": "Grande",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 45, "max": 45 }, "ca": 13, "speed": "10ft, natação 40ft", "initiative_mod": 0 },
    "attributes": { "str": 18, "dex": 10, "con": 15, "int": 8, "wis": 10, "cha": 9 },
    "visuals": { "token_img": "/tokens/enemies/merrow.jpg", "aura_preset": null, "scale": 1.4 },
    "actions": [
      { "name": "Arpão", "mod": "+6", "damage": "2d6 + 4", "desc": "Puxa o alvo para perto." }
    ],
    "traits": [{ "name": "Anfíbio", "desc": "Pode respirar ar e água." }]
  },
  {
    "id": "piercer",
    "name": "Perfurador (Piercer)",
    "category": "Monstruosidade",
    "size": "Médio",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 22, "max": 22 }, "ca": 15, "speed": "5ft, escalada 5ft", "initiative_mod": -4 },
    "attributes": { "str": 10, "dex": 3, "con": 15, "int": 1, "wis": 7, "cha": 3 },
    "visuals": { "token_img": "/tokens/enemies/piercer.jpg", "aura_preset": null, "scale": 0.9 },
    "actions": [{ "name": "Queda", "mod": "+3", "damage": "1d6 por cada 3m de queda" }],
    "traits": [{ "name": "Falsa Aparência", "desc": "Parece uma estalactite comum no teto." }]
  },
  {
    "id": "shrieker",
    "name": "Gritador (Shrieker)",
    "category": "Planta",
    "size": "Médio",
    "challenge_rating": "0",
    "combat": { "hp": { "current": 13, "max": 13 }, "ca": 5, "speed": "0ft", "initiative_mod": -5 },
    "attributes": { "str": 1, "dex": 1, "con": 10, "int": 1, "wis": 3, "cha": 1 },
    "visuals": { "token_img": "/tokens/enemies/shrieker.jpg", "aura_preset": "sound_waves", "scale": 1.0 },
    "actions": [],
    "traits": [{ "name": "Grito", "desc": "Emite um som agudo se houver luz ou criaturas em 9m." }]
  },
  {
    "id": "violet_fungus",
    "name": "Fungo Violeta",
    "category": "Planta",
    "size": "Médio",
    "challenge_rating": "1/4",
    "combat": { "hp": { "current": 18, "max": 18 }, "ca": 5, "speed": "5ft", "initiative_mod": -5 },
    "attributes": { "str": 3, "dex": 1, "con": 10, "int": 1, "wis": 3, "cha": 1 },
    "visuals": { "token_img": "/tokens/enemies/violet_fungus.jpg", "aura_preset": "rot_aura", "scale": 1.0 },
    "actions": [{ "name": "Apêndices", "mod": "+2", "damage": "1d8 necrótico" }],
    "traits": [{ "name": "Falsa Aparência", "desc": "Parece um fungo comum enquanto imóvel." }]
  },{
    "id": "crocodile",
    "name": "Crocodilo",
    "category": "Besta",
    "size": "Grande",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 19, "max": 19 }, "ca": 12, "speed": "20ft, natação 30ft", "initiative_mod": 0 },
    "attributes": { "str": 15, "dex": 10, "con": 13, "int": 2, "wis": 10, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/crocodile.jpg", "aura_preset": null, "scale": 1.4 },
    "actions": [{ "name": "Mordida", "mod": "+4", "damage": "1d10 + 2", "desc": "Alvo fica agarrado." }],
    "traits": [{ "name": "Prender a Respiração", "desc": "Pode prender a respiração por 15 minutos." }]
  },
  {
    "id": "dao",
    "name": "Dao (Gênio da Terra)",
    "category": "Elemental",
    "size": "Grande",
    "challenge_rating": "11",
    "combat": { "hp": { "current": 187, "max": 187 }, "ca": 18, "speed": "30ft, voo 30ft, escavação 30ft", "initiative_mod": 0 },
    "attributes": { "str": 23, "dex": 10, "con": 24, "int": 12, "wis": 13, "cha": 14 },
    "visuals": { "token_img": "/tokens/enemies/dao.jpg", "aura_preset": "sand_storm", "scale": 1.6 },
    "actions": [{ "name": "Punho", "mod": "+10", "damage": "2d10 + 6" }],
    "traits": [{ "name": "Conjuração Inata", "desc": "Pode usar Muralha de Pedra e Mudar Forma." }]
  },
  {
    "id": "giant_octopus",
    "name": "Polvo Gigante",
    "category": "Besta",
    "size": "Grande",
    "challenge_rating": "1",
    "combat": { "hp": { "current": 52, "max": 52 }, "ca": 11, "speed": "10ft, natação 60ft", "initiative_mod": 1 },
    "attributes": { "str": 17, "dex": 13, "con": 13, "int": 4, "wis": 10, "cha": 4 },
    "visuals": { "token_img": "/tokens/enemies/octopus.jpg", "aura_preset": null, "scale": 1.7 },
    "actions": [{ "name": "Tentáculos", "mod": "+5", "damage": "2d6 + 3", "desc": "Alvo fica agarrado." }],
    "traits": [{ "name": "Nuvem de Tinta", "desc": "Cria área de escuridão na água." }]
  },
  {
    "id": "plesiosaurus",
    "name": "Plesiossauro",
    "category": "Besta",
    "size": "Grande",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 68, "max": 68 }, "ca": 13, "speed": "20ft, natação 40ft", "initiative_mod": 2 },
    "attributes": { "str": 18, "dex": 15, "con": 16, "int": 2, "wis": 12, "cha": 5 },
    "visuals": { "token_img": "/tokens/enemies/plesiosaurus.jpg", "aura_preset": null, "scale": 1.8 },
    "actions": [{ "name": "Mordida", "mod": "+6", "damage": "3d6 + 4" }],
    "traits": []
  },
  {
    "id": "sahuagin",
    "name": "Sahuagin",
    "category": "Humanoide",
    "size": "Médio",
    "challenge_rating": "1/2",
    "combat": { "hp": { "current": 22, "max": 22 }, "ca": 12, "speed": "30ft, natação 40ft", "initiative_mod": 0 },
    "attributes": { "str": 13, "dex": 11, "con": 12, "int": 12, "wis": 13, "cha": 9 },
    "visuals": { "token_img": "/tokens/enemies/sahuagin.jpg", "aura_preset": null, "scale": 1.0 },
    "actions": [{ "name": "Lança", "mod": "+3", "damage": "1d6 + 1" }],
    "traits": [{ "name": "Frenesi Sangrento", "desc": "Vantagem contra alvos feridos." }]
  },
  {
    "id": "sahuagin_baron",
    "name": "Barão Sahuagin",
    "category": "Humanoide",
    "size": "Grande",
    "challenge_rating": "5",
    "combat": { "hp": { "current": 76, "max": 76 }, "ca": 16, "speed": "30ft, natação 50ft", "initiative_mod": 2 },
    "attributes": { "str": 19, "dex": 14, "con": 16, "int": 14, "wis": 13, "cha": 17 },
    "visuals": { "token_img": "/tokens/enemies/sahuagin_baron.jpg", "aura_preset": "blood_aura", "scale": 1.5 },
    "actions": [{ "name": "Tridente", "mod": "+7", "damage": "2d6 + 4" }],
    "traits": [{ "name": "Comandante de Tubarões", "desc": "Pode comandar tubarões telepaticamente." }]
  },
  {
    "id": "sea_hag",
    "name": "Bruxa do Mar",
    "category": "Corruptor",
    "size": "Médio",
    "challenge_rating": "2",
    "combat": { "hp": { "current": 52, "max": 52 }, "ca": 14, "speed": "30ft, natação 40ft", "initiative_mod": 1 },
    "attributes": { "str": 16, "dex": 13, "con": 16, "int": 12, "wis": 12, "cha": 13 },
    "visuals": { "token_img": "/tokens/enemies/sea_hag.jpg", "aura_preset": "horrific_appearance", "scale": 1.1 },
    "actions": [{ "name": "Olhar da Morte", "desc": "Alvo amedrontado deve passar em TR ou cai a 0 HP." }],
    "traits": [{ "name": "Aparência Horripilante", "desc": "Criaturas que a veem podem ficar amedrontadas." }]
  },
  {
    "id": "water_weird",
    "name": "Estranheza da Água",
    "category": "Elemental",
    "size": "Grande",
    "challenge_rating": "3",
    "combat": { "hp": { "current": 58, "max": 58 }, "ca": 13, "speed": "0ft, natação 60ft", "initiative_mod": 3 },
    "attributes": { "str": 17, "dex": 16, "con": 13, "int": 11, "wis": 10, "cha": 10 },
    "visuals": { "token_img": "/tokens/enemies/water_weird.jpg", "aura_preset": "water_trap", "scale": 1.4 },
    "actions": [{ "name": "Constrição", "mod": "+5", "damage": "3d6 + 3", "desc": "Alvo fica agarrado." }],
    "traits": [{ "name": "Invisível na Água", "desc": "Fica invisível enquanto estiver mergulhada." }]
  },
  {
    "id": "hawk",
    "name": "Falcão",
    "category": "Besta",
    "size": "Minúsculo",
    "challenge_rating": "0",
    "combat": { "hp": { "current": 1, "max": 1 }, "ca": 13, "speed": "10ft, voo 60ft", "initiative_mod": 3 },
    "attributes": { "str": 5, "dex": 16, "con": 8, "int": 2, "wis": 14, "cha": 6 },
    "visuals": { "token_img": "/tokens/enemies/hawk.jpg", "aura_preset": null, "scale": 0.5 },
    "actions": [{ "name": "Garras", "mod": "+5", "damage": "1" }],
    "traits": [{ "name": "Visão Aguçada", "desc": "Vantagem em Percepção visual." }]
  }
]