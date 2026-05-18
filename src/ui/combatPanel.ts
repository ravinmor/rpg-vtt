import { characters } from '../data/character';
import * as CombatLogic from '../state/gameState';
import { saveCharacters } from '../repositories/characterRepository';
import { state } from '../state/globalState';
import { closeCharacterMenu } from './characterSheet';

export function renderInitiativeList() {
    const listContainer = document.getElementById('initiative-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    characters.forEach((character) => {
        const item = document.createElement('div');
        item.className = `initiative-item ${character.isTurn ? 'active-turn' : ''}`;
        item.innerHTML = `
            <span class="char-name">${character.name}</span>
            <input type="number" class="init-input" value="${character.initiative}"
                onblur="updateCharInitiative('${character.id}', this.value)">
        `;
        listContainer.appendChild(item);
    });
}

export function updateCharInitiative(id: string, value: string) {
    const character = characters.find((item) => item.id === id);
    if (!character) return;

    character.initiative = parseInt(value, 10) || 0;
    CombatLogic.sortInitiative((index: number) => {
        CombatLogic.updateActiveTurn(index);
        renderInitiativeList();
    });
    (window as any).saveCurrentScenarioPage?.();
}

export function removeMonsterFromMap() {
    if (!state.selectedCharacter) return;

    const deleted = CombatLogic.deleteCharacter(state.selectedCharacter.id);
    if (!deleted) return;

    state.selectedCharacter = null;
    closeCharacterMenu();
    renderInitiativeList();
    saveCharacters(characters);
    (window as any).saveCurrentScenarioPage?.();
}
