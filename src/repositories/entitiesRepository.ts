import { characters } from '../data/character';
import type { ScenarioPageEntitiesState } from '../types/scenarioPage';

export function snapshotEntitiesState(): ScenarioPageEntitiesState {
    return {
        characterPlacements: characters
            .filter((character) => !character.isNPC)
            .map((character) => ({
                id: character.id,
                x: character.x,
                y: character.y,
            })),
        npcs: JSON.parse(JSON.stringify(characters.filter((character) => character.isNPC))),
    };
}

export function restoreEntitiesState(entitiesState: ScenarioPageEntitiesState) {
    if ((entitiesState as any).characters) {
        const legacyCharacters = JSON.parse(JSON.stringify((entitiesState as any).characters || []));
        const globalCharacters = characters.filter((character) => !character.isNPC);
        const legacyPlayers = legacyCharacters.filter((character: any) => !character.isNPC);
        const legacyNpcs = legacyCharacters.filter((character: any) => character.isNPC);
        const placements = new Map(legacyPlayers.map((character: any) => [character.id, character]));

        globalCharacters.forEach((character) => {
            const placement = placements.get(character.id);
            if (!placement) return;
            character.x = placement.x;
            character.y = placement.y;
        });

        characters.splice(0, characters.length, ...globalCharacters, ...legacyNpcs);
        return;
    }

    const globalCharacters = characters.filter((character) => !character.isNPC);
    const placements = new Map(
        (entitiesState.characterPlacements || []).map((placement) => [placement.id, placement]),
    );

    globalCharacters.forEach((character) => {
        const placement = placements.get(character.id);
        if (!placement) return;
        character.x = placement.x;
        character.y = placement.y;
    });

    const npcs = JSON.parse(JSON.stringify(entitiesState.npcs || []));
    characters.splice(0, characters.length, ...globalCharacters, ...npcs);
}
