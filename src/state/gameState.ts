// src/state/gameState.ts
import { characters } from '../data/character';
import { bestiaryDatabase } from '../data/bestiary';

// Estado do Combate
export let activeTurnIndex = -1;

/**
 * Altera o HP de um personagem e atualiza a interface
 */
export function changeHP(characterId, amount, updatePanelsCallback) {
    const character = characters.find((item) => item.id === characterId);
    if (!character) return;
    character.hp = Math.max(0, Math.min(character.maxHp, character.hp + amount));
    if (updatePanelsCallback) updatePanelsCallback();
}

/**
 * Ordena a iniciativa e inicia o primeiro turno
 */
export function sortInitiative(updateTurnCallback) {
    characters.sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
    // Resetamos para o primeiro da lista
    const firstIndex = 0; 
    if (updateTurnCallback) updateTurnCallback(firstIndex);
}

/**
 * Avança para o próximo turno
 */
export function nextTurn(updateTurnCallback) {
    if (characters.length === 0) return;
    const newIndex = (activeTurnIndex + 1) % characters.length;
    if (updateTurnCallback) updateTurnCallback(newIndex);
}

/**
 * Volta para o turno anterior
 */
export function prevTurn(updateTurnCallback) {
    if (characters.length === 0) return;
    const newIndex = (activeTurnIndex - 1 + characters.length) % characters.length;
    if (updateTurnCallback) updateTurnCallback(newIndex);
}

/**
 * Reseta o combate
 */
export function resetCombat(renderCallback) {
    activeTurnIndex = -1; // Zera o índice aqui dentro
    characters.forEach(c => {
        c.isTurn = false;
        c.initiative = 0;
    });
    if (renderCallback) renderCallback();
}
/**
 * Atualiza quem é o dono do turno atual
 */
export function updateActiveTurn(newIndex) {
    activeTurnIndex = newIndex;
    characters.forEach((char, index) => {
        char.isTurn = (index === activeTurnIndex);
    });
}

// Adicione ao final do src/state/gameState.ts

/**
 * Liga ou desliga um status de um personagem
 */
export function toggleStatus(characters, characterId, statusKey, callback) {
    const character = characters.find((item) => item.id === characterId);
    if (!character) return;

    if (!character.statuses.includes(statusKey)) {
        character.statuses.push(statusKey);
    } else {
        character.statuses = character.statuses.filter((s) => s !== statusKey);
    }
    if (callback) callback();
}

/**
 * Remove um status específico
 */
export function removeStatus(characters, characterId, statusKey, callback) {
    const character = characters.find((item) => item.id === characterId);
    if (!character) return;
    character.statuses = character.statuses.filter((s) => s !== statusKey);
    if (callback) callback();
}

// Adicionei o parâmetro 'onSpawnCallback'
export function spawnMonster(templateId, x, y, onSpawnCallback) {
    // 1. Usa o nome correto do import: bestiaryDatabase
    const template = bestiaryDatabase.find(m => m.id === templateId);

    if (!template) {
        console.warn(`Monstro com ID "${templateId}" não encontrado no bestiário.`);
        return null;
    }

    const newInstance = JSON.parse(JSON.stringify(template));

    const monsterToSpawn = {
        ...newInstance,
        
        id: `${template.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        isNPC: true,
        x: x,
        y: y,
        initiative: 0,
        isTurn: false,
        statuses: [],

        hp: template.combat.hp.max,
        maxHp: template.combat.hp.max,
        tempHp: 0,
        ac: template.combat.ca,
        speed: parseInt(template.combat.speed),
        
        radius: 30 * (template.visuals?.scale || 1),
        color: '#e74c3c' 
    };

    characters.push(monsterToSpawn);

    console.log(`Spawnado: ${monsterToSpawn.name} (ID: ${monsterToSpawn.id})`);

    // 2. Chama o callback passado pelo arquivo principal (main.ts)
    if (onSpawnCallback) {
        onSpawnCallback();
    }

    return monsterToSpawn;
}

export function deleteCharacter(characterId: string) {
    // Filtra o array removendo o personagem com o ID correspondente
    const index = characters.findIndex(c => c.id === characterId);
    if (index !== -1) {
        characters.splice(index, 1);
        return true;
    }
    return false;
}

export function registerNewCharacter(characterData: any) {
    // Aqui você pode adicionar validações se necessário
    characters.push(characterData);
    
    // Se você tiver um sistema de eventos para avisar que o estado mudou:
    // emitStateChange(); 
}