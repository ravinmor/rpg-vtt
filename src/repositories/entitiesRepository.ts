import { characters } from '../data/character';
import type { ScenarioPageEntitiesState } from '../types/scenarioPage';

export function snapshotEntitiesState(): ScenarioPageEntitiesState {
    return {
        characters: JSON.parse(JSON.stringify(characters)),
    };
}

export function restoreEntitiesState(entitiesState: ScenarioPageEntitiesState) {
    characters.splice(0, characters.length, ...(JSON.parse(JSON.stringify(entitiesState.characters || []))));
}
