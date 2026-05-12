// src/ui/characterSheet.ts
import { statusDefinitions, statusLabelMap } from '../data/constants';

export function renderCharacterStatusButtons(character, onToggleCallback) {
    const grid = document.getElementById('character-status-grid');
    if (!grid) return;
    grid.innerHTML = '';

    statusDefinitions.forEach((status) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `character-status-btn${character.statuses.includes(status.key) ? ' active' : ''}`;
        button.textContent = status.label;
        button.onclick = (e) => {
            e.stopPropagation();
            onToggleCallback(character.id, status.key);
        };
        grid.appendChild(button);
    });
}

export function updateCharacterMenu(character) {
    if (!character) return;
    
    // Atualiza Nome, Classe e Token
    document.getElementById('character-menu-name')!.textContent = character.name;
    const classEl = document.getElementById('character-menu-class')!;
    classEl.textContent = `${character.charClass || '-'} Nv. ${character.level || 1}`;
    document.getElementById('character-menu-token')!.style.background = character.color;
    
    // HP
    let hpString = `${character.hp} / ${character.maxHp}`;
    if (character.tempHp > 0) hpString += ` (+${character.tempHp} Temp)`;
    document.getElementById('character-menu-hp')!.textContent = hpString;

    // Estatísticas de Combate
    const combatStatsDiv = document.getElementById('character-combat-stats')!;
    combatStatsDiv.innerHTML = `
        <div class="combat-stat-box"><span class="attr-label">CA</span><span class="attr-val">${character.ac || 10}</span></div>
        <div class="combat-stat-box"><span class="attr-label">Desloc.</span><span class="attr-val">${character.speed || 9}m</span></div>
    `;

    // Atributos (FOR, DES, etc.)
    const attrGrid = document.getElementById('character-attributes')!;
    const attrMap = { str: 'FOR', dex: 'DES', con: 'CON', int: 'INT', wis: 'SAB', cha: 'CAR' };
    attrGrid.innerHTML = Object.entries(attrMap).map(([key, label]) => {
        const val = character.attributes ? character.attributes[key] || 0 : 0;
        return `<div class="attribute-box"><span class="attr-label">${label}</span><span class="attr-val">${val >= 0 ? '+' : ''}${val}</span></div>`;
    }).join('');
}