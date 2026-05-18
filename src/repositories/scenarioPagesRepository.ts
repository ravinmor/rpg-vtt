import { readStorageItem, writeStorageItem } from '../services/storageService';
import type { ScenarioPagesStore } from '../types/scenarioPage';

const SCENARIO_PAGES_STORAGE_KEY = 'vtt_scenario_pages';

const defaultStore: ScenarioPagesStore = {
    activePageId: null,
    pages: [],
};

export function loadScenarioPagesStore(): ScenarioPagesStore {
    return readStorageItem<ScenarioPagesStore>(SCENARIO_PAGES_STORAGE_KEY, { defaultValue: defaultStore });
}

export function saveScenarioPagesStore(store: ScenarioPagesStore) {
    writeStorageItem(SCENARIO_PAGES_STORAGE_KEY, store);
}
