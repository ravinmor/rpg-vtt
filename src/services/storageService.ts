type StorageServiceOptions<T> = {
    defaultValue: T;
    storage?: Storage;
};

function resolveStorage(storage?: Storage) {
    return storage ?? window.localStorage;
}

export function readStorageItem<T>(key: string, options: StorageServiceOptions<T>): T {
    const storage = resolveStorage(options.storage);
    const rawValue = storage.getItem(key);

    if (rawValue === null) {
        return options.defaultValue;
    }

    try {
        return JSON.parse(rawValue) as T;
    } catch (error) {
        console.error(`Erro ao ler item "${key}" do storage:`, error);
        return options.defaultValue;
    }
}

export function writeStorageItem<T>(key: string, value: T, storage?: Storage) {
    try {
        resolveStorage(storage).setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Erro ao salvar item "${key}" no storage:`, error);
    }
}

export function removeStorageItem(key: string, storage?: Storage) {
    try {
        resolveStorage(storage).removeItem(key);
    } catch (error) {
        console.error(`Erro ao remover item "${key}" do storage:`, error);
    }
}
