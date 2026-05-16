export const FEET_PER_CELL = 5        // 1 célula = 5 pés (padrão D&D)
export const BASE_GRID_SIZE = 64      // 1 célula = 64 pixels no zoom 1:1

export type DistanceUnit = 'ft' | 'm'

export let distanceUnit: DistanceUnit = 'ft'

export const statusDefinitions = [
    { key: 'blinded', label: 'Blinded' },
    { key: 'cursed', label: 'Cursed' },
    { key: 'deafened', label: 'Deafened' },
    { key: 'frightened', label: 'Frightened' },
    { key: 'grappled', label: 'Grappled' },
    { key: 'incapacitated', label: 'Incapacitated' },
    { key: 'paralyzed', label: 'Paralyzed' },
    { key: 'petrified', label: 'Petrified' },
    { key: 'poisoned', label: 'Poisoned' },
    { key: 'prone', label: 'Prone' },
    { key: 'restrained', label: 'Restrained' },
    { key: 'stunned', label: 'Stunned' },
    { key: 'unconscious', label: 'Unconscious' },
    { key: 'concentration', label: 'Concentration' },
    { key: 'dead', label: 'Dead' }
];

export const statusLabelMap = Object.fromEntries(
    statusDefinitions.map((status) => [status.key, status.label])
);

export function setDistanceUnit(unit: DistanceUnit) {
    distanceUnit = unit
}

export const TOKEN_SIZE = {
    tiny:   BASE_GRID_SIZE * 0.2,   // 12.8px — Tiny (rato, familiar)
    small:  BASE_GRID_SIZE * 0.3,   // 19.2px — Small (halfling, goblin)
    medium: BASE_GRID_SIZE * 0.4,   // 25.6px — Medium (humano, orc)
    large:  BASE_GRID_SIZE * 0.8,   // 51.2px — Large (ogro, cavalo)
    huge:   BASE_GRID_SIZE * 1.2,   // 76.8px — Huge (gigante, young dragon)
    gargan: BASE_GRID_SIZE * 1.6,   // 102.4px — Gargantuan (tarrasque)
}