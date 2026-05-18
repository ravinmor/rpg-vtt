import { characters } from '../data/character';
import { statusDefinitions, statusLabelMap } from '../data/constants';
import { positiveStatuses } from '../data/positiveStatus';
import { saveCharacters } from '../repositories/characterRepository';
import { state } from '../state/globalState';

const characterMenu = document.getElementById('character-menu') as HTMLElement | null;
const characterMenuShell = document.getElementById('character-menu-shell') as HTMLElement | null;
const characterMenuName = document.getElementById('character-menu-name') as HTMLElement | null;
const characterMenuClass = document.getElementById('character-menu-class') as HTMLElement | null;
const characterMenuHp = document.getElementById('character-menu-hp') as HTMLElement | null;
const characterMenuToken = document.getElementById('character-menu-token') as HTMLElement | null;
const characterStatusGrid = document.getElementById('character-status-grid') as HTMLElement | null;
const sideCharacterName = document.getElementById('side-character-name') as HTMLElement | null;
const sideCharacterStatuses = document.getElementById('side-character-statuses') as HTMLElement | null;

function setCharacterToken(character: any) {
    if (!characterMenuToken) return;

    if (character.visuals?.token_img) {
        characterMenuToken.style.backgroundImage = `url('${character.visuals.token_img}')`;
        characterMenuToken.style.backgroundSize = 'cover';
        characterMenuToken.style.backgroundPosition = 'center';
        return;
    }

    characterMenuToken.style.backgroundImage = 'none';
    characterMenuToken.style.background = character.color;
}

export function getCharacterAtPosition(x: number, y: number) {
    for (let i = characters.length - 1; i >= 0; i--) {
        const character = characters[i];
        if (Math.hypot(x - character.x, y - character.y) <= character.radius * state.tokenScale) {
            return character;
        }
    }
    return null;
}

export function toggleStatus(characterId: string, statusKey: string) {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;

    if (!character.statuses.includes(statusKey)) {
        character.statuses.push(statusKey);
    } else {
        character.statuses = character.statuses.filter((status: string) => status !== statusKey);
    }

    updateCharacterPanels();
    saveCharacters(characters);
}

export function removeStatus(characterId: string, statusKey: string) {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;

    character.statuses = character.statuses.filter((status: string) => status !== statusKey);
    updateCharacterPanels();
}

export function renderCharacterStatusButtons(character: any) {
    if (!characterStatusGrid) return;

    characterStatusGrid.innerHTML = '';

    const negativeHeader = document.createElement('div');
    negativeHeader.className = 'status-section-header negative';
    negativeHeader.textContent = 'Condicoes';
    characterStatusGrid.appendChild(negativeHeader);

    const negativeWrap = document.createElement('div');
    negativeWrap.className = 'status-btn-group';
    characterStatusGrid.appendChild(negativeWrap);

    statusDefinitions.forEach((status) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `character-status-btn negative${character.statuses.includes(status.key) ? ' active' : ''}`;
        button.textContent = status.label;
        button.title = status.key;
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleStatus(character.id, status.key);
        });
        negativeWrap.appendChild(button);
    });

    const positiveHeader = document.createElement('div');
    positiveHeader.className = 'status-section-header positive';
    positiveHeader.textContent = 'Bencaos';
    characterStatusGrid.appendChild(positiveHeader);

    const positiveWrap = document.createElement('div');
    positiveWrap.className = 'status-btn-group';
    characterStatusGrid.appendChild(positiveWrap);

    Object.entries(positiveStatuses.positive_statuses).forEach(([key, data]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `character-status-btn positive${character.statuses.includes(key) ? ' active' : ''}`;
        button.textContent = (data as any).name_en;
        button.title = (data as any).description;
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleStatus(character.id, key);
        });
        positiveWrap.appendChild(button);
    });
}

export function renderSideCharacterStatuses(character: any) {
    if (!sideCharacterStatuses || !sideCharacterName) return;

    sideCharacterStatuses.innerHTML = '';

    if (!character) {
        sideCharacterName.textContent = 'Nenhum selecionado';
        return;
    }

    sideCharacterName.textContent = character.name;

    if (character.statuses.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'side-status-pill';
        empty.textContent = 'Sem status';
        sideCharacterStatuses.appendChild(empty);
        return;
    }

    character.statuses.forEach((status: string) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'side-status-pill';
        button.textContent = statusLabelMap[status] || status;
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            removeStatus(character.id, status);
        });
        sideCharacterStatuses.appendChild(button);
    });
}

export function updateCharacterMenu(character: any) {
    if (!character || !characterMenuName || !characterMenuClass || !characterMenuHp) return;

    characterMenuName.textContent = character.name;
    characterMenuClass.textContent = `${character.charClass || '-'} Nv. ${character.level || 1}`;

    let hpString = `${character.hp} / ${character.maxHp}`;
    if (character.tempHp > 0) hpString += ` (+${character.tempHp} Temp)`;
    characterMenuHp.textContent = hpString;

    setCharacterToken(character);
    renderCharacterStatusButtons(character);

    const combatStatsDiv = document.getElementById('character-combat-stats');
    if (combatStatsDiv) {
        combatStatsDiv.innerHTML = `
            <div class="combat-stat-box"><span class="attr-label">CA</span><span class="attr-val">${character.ac || 10}</span></div>
            <div class="combat-stat-box"><span class="attr-label">Desloc.</span><span class="attr-val">${character.speed || 9}</span></div>
            <div class="combat-stat-box"><span class="attr-label">Percep. Pass.</span><span class="attr-val">${character.passivePerception || 10}</span></div>
        `;
    }

    const attrGrid = document.getElementById('character-attributes');
    if (attrGrid) {
        const attrMap: Record<string, string> = { str: 'FOR', dex: 'DES', con: 'CON', int: 'INT', wis: 'SAB', cha: 'CAR' };
        attrGrid.innerHTML = Object.entries(attrMap).map(([key, label]) => {
            const value = character.attributes?.[key] || 0;
            const display = value >= 0 ? `+${value}` : value;
            return `<div class="attribute-box"><span class="attr-label">${label}</span><span class="attr-val">${display}</span></div>`;
        }).join('');
    }

    const resourcesDiv = document.getElementById('character-resources');
    if (resourcesDiv) {
        const formatKey = (text: string) => text.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
        let resourcesHtml = '';

        if (character.resources) {
            for (const [key, value] of Object.entries(character.resources)) {
                const displayValue = typeof value === 'object' ? `${(value as any).current} / ${(value as any).max}` : value;
                resourcesHtml += `<div class="resource-item"><b>${formatKey(key)}:</b> ${displayValue}</div>`;
            }
        }

        if (character.spellSlots) {
            for (const [key, value] of Object.entries(character.spellSlots)) {
                const levelLabel = key.replace('level', 'Magia Nv ');
                resourcesHtml += `<div class="resource-item"><b>${levelLabel}:</b> ${(value as any).current} / ${(value as any).max}</div>`;
            }
        }

        resourcesDiv.innerHTML = `<div class="character-menu-subtitle">Recursos & Magias</div>${resourcesHtml || '<div class="resource-item">Nenhum recurso especial.</div>'}`;
    }

    const skillsDiv = document.getElementById('character-skills');
    if (skillsDiv) {
        const skillMap: Record<string, string> = {
            acrobatics: 'Acrobacia',
            animalHandling: 'Trato c/ Animais',
            arcana: 'Arcanismo',
            athletics: 'Atletismo',
            deception: 'Enganacao',
            history: 'Historia',
            insight: 'Intuicao',
            intimidation: 'Intimidacao',
            investigation: 'Investigacao',
            medicine: 'Medicina',
            nature: 'Natureza',
            perception: 'Percepcao',
            performance: 'Atuacao',
            persuasion: 'Persuasao',
            religion: 'Religiao',
            sleightOfHand: 'Prestidigitacao',
            stealth: 'Furtividade',
            survival: 'Sobrevivencia',
        };

        const skillRows = character.skills
            ? Object.entries(character.skills).map(([key, value]) => {
                const display = (value as number) >= 0 ? `+${value}` : value;
                return `<div class="skill-item"><span>${skillMap[key] || key}</span><span>${display}</span></div>`;
            }).join('')
            : '';

        skillsDiv.innerHTML = `<div class="character-menu-subtitle">Pericias</div><div class="skills-grid">${skillRows}</div>`;
    }

    const traitsContainer = document.getElementById('character-traits-container');
    const traitsList = document.getElementById('character-traits');
    if (traitsContainer && traitsList) {
        if (character.traits?.length > 0) {
            traitsContainer.style.display = 'flex';
            traitsList.innerHTML = character.traits.map((trait: any) => `
                <div class="feature-item">
                    <span class="feature-name">${trait.name}.</span>
                    <span class="feature-desc">${trait.desc || ''}</span>
                </div>
            `).join('');
        } else {
            traitsContainer.style.display = 'none';
        }
    }

    const actionsContainer = document.getElementById('character-actions-container');
    const actionsList = document.getElementById('character-actions');
    if (actionsContainer && actionsList) {
        if (character.actions?.length > 0) {
            actionsContainer.style.display = 'flex';
            actionsList.innerHTML = character.actions.map((action: any) => {
                let details = action.desc || '';
                if (action.damage) {
                    const modifier = action.mod ? `<strong>Acerto:</strong> ${action.mod}` : '';
                    const range = action.range ? ` | <strong>Alcance:</strong> ${action.range}` : '';
                    const damageType = action.type ? `(${action.type})` : '';
                    details += `${modifier ? `${modifier} | ` : ''}<strong>Dano:</strong> ${action.damage} ${damageType}${range}`;
                }
                return `<div class="feature-item"><span class="feature-name">${action.name}.</span><span class="feature-desc">${details}</span></div>`;
            }).join('');
        } else {
            actionsContainer.style.display = 'none';
        }
    }
}

export function updateCharacterPanels() {
    if (!state.selectedCharacter) {
        renderSideCharacterStatuses(null);
        return;
    }

    const current = characters.find(c => c.id === state.selectedCharacter.id);
    if (!current) return;

    state.selectedCharacter = current;
    updateCharacterMenu(current);
    renderSideCharacterStatuses(current);
}

export function openCharacterMenu(character: any, x: number, y: number) {
    if (!characterMenu) return;

    state.selectedCharacter = character;
    updateCharacterPanels();
    setCharacterToken(character);

    characterMenu.style.display = 'flex';

    const rect = characterMenu.getBoundingClientRect();
    const padding = 18;
    const left = Math.min(Math.max(x + 18, padding), window.innerWidth - rect.width - padding);
    const top = Math.min(Math.max(y - rect.height / 2, padding), window.innerHeight - rect.height - padding);

    characterMenu.style.left = `${left}px`;
    characterMenu.style.top = `${top}px`;
}

export function closeCharacterMenu(event: any = null) {
    if (event?.stopPropagation) event.stopPropagation();
    if (characterMenu) characterMenu.style.display = 'none';

    const editMode = document.getElementById('char-edit-mode');
    const viewMode = document.getElementById('char-view-mode');
    if (editMode && viewMode) {
        editMode.style.display = 'none';
        viewMode.style.display = 'flex';
    }
}

export function startCharacterMenuDrag(event: MouseEvent) {
    if (!characterMenuShell) return;
    if ((event.target as HTMLElement).closest('button, input')) return;

    const rect = characterMenuShell.getBoundingClientRect();
    const isHeader = !!(event.target as HTMLElement).closest('#character-menu-header');
    if (event.clientY - rect.top > 26 && !isHeader) return;

    state.isDraggingCharacterMenu = true;
    state.characterMenuDragOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    event.preventDefault();
    event.stopPropagation();
}

export function bindCharacterMenuDrag() {
    characterMenuShell?.addEventListener('mousedown', startCharacterMenuDrag as EventListener);
}
