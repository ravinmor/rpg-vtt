// Sub-tipos para manter o código limpo
export interface CharacterAttributes {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}

export interface CharacterSkills {
    acrobatics: number; animalHandling: number; arcana: number; athletics: number;
    deception: number; history: number; insight: number; intimidation: number;
    investigation: number; medicine: number; nature: number; perception: number;
    performance: number; persuasion: number; religion: number; sleightOfHand: number;
    stealth: number; survival: number;
}

export interface ResourceItem {
    current: number;
    max: number;
}

export interface CharacterVisuals {
    token_img?: string;
    aura_preset?: string | null;
    scale?: number;
}

export interface FeatureItem {
    name: string;
    desc?: string;
    mod?: string;
    damage?: string;
    type?: string;
    range?: string;
}

// O TIPO PRINCIPAL
export interface Character {
    // ── Identificação ──
    id: string | number;
    name: string;
    charClass: string;
    level: number;
    isNPC?: boolean; // Flag opcional para o código saber rapidamente quem é quem

    // ── Combate (Formato plano que o seu VTT já lê) ──
    hp: number;
    maxHp: number;
    tempHp: number;
    ac: number;
    speed: number;
    passivePerception: number;

    // ── Estatísticas ──
    attributes: CharacterAttributes;
    skills: CharacterSkills;

    // ── Recursos Dinâmicos e Magia ──
    // Permite tanto objetos {current, max} quanto strings diretas (ex: "3d6")
    resources?: Record<string, ResourceItem | string>; 
    spellSlots?: Record<string, ResourceItem>;
    
    // ── Habilidades e Ações (Paridade com Monstros) ──
    traits?: FeatureItem[];
    actions?: FeatureItem[];

    // ── Estado Atual (Buffs/Debuffs) ──
    statuses: string[];

    // ── Instância no Mapa (Dados que mudam a cada turno/movimento) ──
    x: number;
    y: number;
    radius: number;
    color: string;
    initiative: number;
    isTurn: boolean;

    // ── Visualização ──
    visuals?: CharacterVisuals;
}