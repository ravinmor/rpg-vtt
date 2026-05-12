// src/ui/bestiaryUI.ts
import { bestiaryDatabase } from '../data/bestiary';
import * as CombatLogic from '../state/gameState';

export function populateMonsterSelect() {
    const select = document.getElementById('monster-select') as HTMLSelectElement;
    if (!select) return;

    select.innerHTML = '<option value="">— Selecione uma Criatura —</option>';

    const categories: Record<string, any[]> = {};
    
    bestiaryDatabase.forEach(monster => {
        if (!categories[monster.category]) {
            categories[monster.category] = [];
        }
        categories[monster.category].push(monster);
    });

    Object.keys(categories).sort().forEach(category => {
        const group = document.createElement('optgroup');
        group.label = category;

        categories[category].forEach(monster => {
            const option = document.createElement('option');
            option.value = monster.id;
            option.textContent = `${monster.name} (CR ${monster.challenge_rating})`;
            group.appendChild(option);
        });

        select.appendChild(group);
    });
}

export function addMonsterFromSelect() {
    const select = document.getElementById('monster-select') as HTMLSelectElement;
    const monsterId = select.value;

    if (!monsterId) return;

    // Spawna no centro da tela
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    CombatLogic.spawnMonster(monsterId, centerX, centerY);
}