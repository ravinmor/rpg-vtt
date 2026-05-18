import { characters } from '../data/character';
import { saveCharacters } from '../repositories/characterRepository';

export function parseAndAddCharacters(data: any, onCharactersChanged: () => void) {
    const characterArray = Array.isArray(data) ? data : [data];
    let addedCount = 0;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    characterArray.forEach((characterData: any, index: number) => {
        if (!characterData.name) return;

        characters.push({
            ...characterData,
            id: `char_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
            x: characterData.x || centerX + index * 35,
            y: characterData.y || centerY + index * 35,
            initiative: characterData.initiative || 0,
            isTurn: false,
            statuses: characterData.statuses || [],
            radius: characterData.radius || 30,
            hp: characterData.hp !== undefined ? characterData.hp : (characterData.maxHp || 10),
        });
        addedCount++;
    });

    if (addedCount === 0) {
        alert('Nenhum personagem valido encontrado no JSON.');
        return;
    }

    saveCharacters(characters);
    closeImportModal();
    onCharactersChanged();
    (window as any).saveCurrentScenarioPage?.();
}

export function openImportModal() {
    const modal = document.getElementById('import-character-modal');
    if (!modal) return;

    (document.getElementById('import-file-input') as HTMLInputElement).value = '';
    (document.getElementById('import-json-textarea') as HTMLTextAreaElement).value = '';
    modal.style.display = 'flex';
}

export function closeImportModal() {
    const modal = document.getElementById('import-character-modal');
    if (modal) modal.style.display = 'none';
}

export function processImportedJson(onCharactersChanged: () => void) {
    const fileInput = document.getElementById('import-file-input') as HTMLInputElement;
    const textArea = document.getElementById('import-json-textarea') as HTMLTextAreaElement;

    if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                parseAndAddCharacters(JSON.parse(event.target?.result as string), onCharactersChanged);
            } catch {
                alert('Erro no arquivo JSON.');
            }
        };
        reader.readAsText(file);
        return;
    }

    if (!textArea.value.trim()) return;

    try {
        parseAndAddCharacters(JSON.parse(textArea.value.trim()), onCharactersChanged);
    } catch {
        alert('Erro no texto JSON colado.');
    }
}
