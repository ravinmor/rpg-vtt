import { readStorageItem, writeStorageItem } from '../services/storageService';

const CHARACTERS_STORAGE_KEY = 'vtt_active_characters';

export function saveCharacters(characters: any[]) {
    writeStorageItem(CHARACTERS_STORAGE_KEY, characters.filter((character) => !character.isNPC));
}

export function loadCharacters(): any[] {
    return readStorageItem<any[]>(CHARACTERS_STORAGE_KEY, { defaultValue: [] }).filter((character) => !character.isNPC);
}
