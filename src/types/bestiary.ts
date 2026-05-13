// src/types/entities.ts

export interface CombatStats {
    hp: { current: number; max: number };
    ca: number;
    speed: string;
    initiative_mod: number;
}

export interface Monster {
    id: string;
    name: string;
    category: string;
    size: string;
    challenge_rating: string;
    combat: CombatStats;
    attributes?: Record<string, number>;
    visuals: {
        token_img: string;
        aura_preset: string | null;
        scale: number;
    };
    actions?: Array<{ name: string; mod?: string; damage?: string; type?: string; desc?: string; range?: string }>;
    traits?: Array<{ name: string; desc: string }>;
}