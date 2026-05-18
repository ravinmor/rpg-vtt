import { readStorageItem, writeStorageItem } from '../services/storageService';

const SESSION_NOTES_STORAGE_KEY = 'vtt_session_notes';

export function saveSessionNotesContent(content: string) {
    writeStorageItem(SESSION_NOTES_STORAGE_KEY, content);
}

export function loadSessionNotesContent(): string {
    return readStorageItem<string>(SESSION_NOTES_STORAGE_KEY, { defaultValue: '' });
}
