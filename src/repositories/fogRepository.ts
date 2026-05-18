import { readStorageItem, writeStorageItem } from '../services/storageService';

const FOG_STORAGE_KEY = 'vtt_fog_state';

export type FogPersistenceData = {
    active: boolean;
    zones: Array<{
        id: string;
        polygon: { x: number; y: number }[];
        erased: { x: number; y: number; r: number }[];
    }>;
    polygon?: { x: number; y: number }[];
    erased?: { x: number; y: number; r: number }[];
};

export function saveFogState(data: FogPersistenceData) {
    writeStorageItem(FOG_STORAGE_KEY, data);
}

export function loadFogState(): FogPersistenceData | null {
    return readStorageItem<FogPersistenceData | null>(FOG_STORAGE_KEY, { defaultValue: null });
}
