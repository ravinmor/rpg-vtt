export const BASE_GRID_SIZE = 50;

export const statusDefinitions = [
    { key: 'blinded', label: 'Cego' },
    { key: 'cursed', label: 'Amaldiçoado' },
    { key: 'deafened', label: 'Ensurdecido' },
    { key: 'frightened', label: 'Amedrontado' },
    { key: 'grappled', label: 'Agarrado' },
    { key: 'incapacitated', label: 'Incapacitado' },
    { key: 'invisible', label: 'Invisível' },
    { key: 'paralyzed', label: 'Paralisado' },
    { key: 'petrified', label: 'Petrificado' },
    { key: 'poisoned', label: 'Envenenado' },
    { key: 'prone', label: 'Caído' },
    { key: 'restrained', label: 'Contido' },
    { key: 'stunned', label: 'Atordoado' },
    { key: 'unconscious', label: 'Inconsciente' },
    { key: 'concentration', label: 'Concentração' },
    { key: 'dead', label: 'Morto' }
];

export const statusLabelMap = Object.fromEntries(
    statusDefinitions.map((status) => [status.key, status.label])
);