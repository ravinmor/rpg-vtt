import { characters } from '../data/character';
import { state } from '../state/globalState';
import { saveCharacters } from '../repositories/characterRepository';
import { updateCharacterPanels } from './characterSheet';

export function openEditCharacterModal() {
    const character = state.selectedCharacter;
    if (!character) return;

    (document.getElementById('edit-char-name') as HTMLInputElement).value = character.name || '';
    (document.getElementById('edit-char-hp') as HTMLInputElement).value = String(character.hp || 0);
    (document.getElementById('edit-char-maxhp') as HTMLInputElement).value = String(character.maxHp || 0);
    (document.getElementById('edit-char-temphp') as HTMLInputElement).value = String(character.tempHp || 0);
    (document.getElementById('edit-char-ac') as HTMLInputElement).value = String(character.ac || 0);
    (document.getElementById('edit-char-speed') as HTMLInputElement).value = String(character.speed || 0);
    (document.getElementById('edit-char-init') as HTMLInputElement).value = String(character.initiative || 0);
    (document.getElementById('edit-char-radius') as HTMLInputElement).value = String(character.radius || 30);
    (document.getElementById('edit-char-img') as HTMLInputElement).value = character.visuals?.token_img || character.avatar || '';

    document.getElementById('char-view-mode')!.style.display = 'none';
    document.getElementById('char-edit-mode')!.style.display = 'flex';
}

export function closeEditCharacterModal() {
    document.getElementById('char-edit-mode')!.style.display = 'none';
    document.getElementById('char-view-mode')!.style.display = 'flex';
}

export function saveCharacterEdit(onCharacterUpdated: () => void) {
    const character = state.selectedCharacter;
    if (!character) return;

    const getInput = (id: string) => document.getElementById(id) as HTMLInputElement;

    character.name = getInput('edit-char-name').value.trim();
    character.maxHp = parseInt(getInput('edit-char-maxhp').value, 10) || 1;
    character.hp = Math.min(Math.max(0, parseInt(getInput('edit-char-hp').value, 10) || 0), character.maxHp);
    character.tempHp = parseInt(getInput('edit-char-temphp').value, 10) || 0;
    character.ac = parseInt(getInput('edit-char-ac').value, 10) || 10;
    character.speed = parseInt(getInput('edit-char-speed').value, 10) || 0;
    character.initiative = parseInt(getInput('edit-char-init').value, 10) || 0;
    character.radius = Math.max(10, parseInt(getInput('edit-char-radius').value, 10) || 30);

    if (!character.visuals) character.visuals = {};
    character.visuals.token_img = getInput('edit-char-img').value.trim();

    closeEditCharacterModal();
    updateCharacterPanels();
    onCharacterUpdated();

    const tokenImage = document.getElementById('character-menu-token');
    if (tokenImage && character.visuals.token_img) {
        (tokenImage as HTMLElement).style.backgroundImage = `url('${character.visuals.token_img}')`;
    }

    saveCharacters(characters);
}
