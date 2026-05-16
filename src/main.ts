import { characters } from './data/character';
import { statusDefinitions, statusLabelMap, BASE_GRID_SIZE, setDistanceUnit } from './data/constants';
import * as CombatLogic from './state/gameState';
import * as Renderer from './engine/renderer';
import { syncTokens } from './engine/characterDrawer';
import { syncEffects } from './engine/effectDrawer';
import { syncUI } from './engine/uiDrawer';
import { initMouseEvents } from './events/mouseHandlers';
import { state } from './state/globalState';
import * as RadialMenu from './ui/radialMenu';
import * as BestiaryUI from './ui/bestiaryUI';
import { loadFromLocalStorage } from './state/gameState';
import { initScene, app, viewport } from './engine/scene';
import { gizmo } from './engine/transformGizmo';
import { loadStatusIcons } from './utils/images';
import { createIcons, Map, Users, BookOpen, MousePointer2, Square, Circle, Triangle, Type, Grid3X3, Trash2, Sparkle, Brush, Hash, Copy, WandSparkles, Eye, EyeOff, Lock, Unlock, ChevronLeft, X, PenTool, Ruler } from 'lucide';
import { drawPenPreview, resetPen } from './engine/penTool';
import { drawRuler, resetRuler } from './engine/rulerTool'

// ======================================================
// CANVAS E CONTEXTO
// ======================================================
const canvas = document.getElementById('vttCanvas') as HTMLCanvasElement;

// ======================================================
// ELEMENTOS DE UI
// ======================================================
const menu              = document.getElementById('radial-menu')!;
const sideMenu          = document.getElementById('side-menu')!;
const characterMenu     = document.getElementById('character-menu')!;
const characterMenuShell  = document.getElementById('character-menu-shell')!;
const characterMenuName   = document.getElementById('character-menu-name')!;
const characterMenuClass  = document.getElementById('character-menu-class')!;
const characterMenuHp     = document.getElementById('character-menu-hp')!;
const characterHpInput = document.getElementById('character-hp-input') as HTMLInputElement;
const characterMenuToken  = document.getElementById('character-menu-token')!;
const characterStatusGrid = document.getElementById('character-status-grid')!;
const sideCharacterName   = document.getElementById('side-character-name')!;
const sideCharacterStatuses = document.getElementById('side-character-statuses')!;
const w = (window as any);

// ======================================================
// COORDENADAS DO MAPA
// ======================================================
export function getMapCoords(e: MouseEvent) {
    // PROTEÇÃO: Se o PixiJS ainda não carregou o viewport, usa a tela.
    // Se carregou, converte o clique da tela para o "mundo" do mapa.
    if (!viewport) return { x: e.clientX, y: e.clientY };
    return viewport.toWorld(e.clientX, e.clientY);
}

// ======================================================
// PERSONAGENS
// ======================================================
function getCharacterAtPosition(x: number, y: number) {
    for (let i = characters.length - 1; i >= 0; i--) {
        const character = characters[i];
        if (Math.hypot(x - character.x, y - character.y) <= character.radius * state.tokenScale) {
            return character;
        }
    }
    return null;
}

function updateCharacterPanels() {
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

// Carrega personagens: prioriza character.ts, cai para localStorage se vazio
if (characters.length === 0) {
    const savedChars = loadFromLocalStorage();
    if (savedChars.length > 0) {
        characters.push(...savedChars);
        console.log('Carregado do LocalStorage:', characters.length, 'personagens');
    }
} else {
    console.log('Usando character.ts:', characters.length, 'personagens');
}

// ======================================================
// CANVAS RESIZE
// ======================================================
function resize() {
    canvas.width  = w.innerWidth;
    canvas.height = w.innerHeight;
}
w.addEventListener('resize', resize);
resize();

function toggleStatus(characterId: string, statusKey: string) {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;

    if (!character.statuses.includes(statusKey)) {
        character.statuses.push(statusKey);
    } else {
        character.statuses = character.statuses.filter(s => s !== statusKey);
    }

    updateCharacterPanels();
    CombatLogic.saveToLocalStorage(characters);
}

function removeStatus(characterId: string, statusKey: string) {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;
    character.statuses = character.statuses.filter(s => s !== statusKey);
    updateCharacterPanels();
}

// ======================================================
// PAINEL LATERAL — STATUS DO PERSONAGEM
// ======================================================
function renderCharacterStatusButtons(character: any) {
    characterStatusGrid.innerHTML = '';

    statusDefinitions.forEach(status => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `character-status-btn${character.statuses.includes(status.key) ? ' active' : ''}`;
        button.textContent = status.label;
        button.addEventListener('click', e => {
            e.stopPropagation();
            toggleStatus(character.id, status.key);
        });
        characterStatusGrid.appendChild(button);
    });
}

function renderSideCharacterStatuses(character: any) {
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
        button.addEventListener('click', e => {
            e.stopPropagation();
            removeStatus(character.id, status);
        });
        sideCharacterStatuses.appendChild(button);
    });
}

// ======================================================
// MENU DE PERSONAGEM — RENDERIZAÇÃO
// ======================================================
function updateCharacterMenu(character: any) {
    if (!character) return;

    characterMenuName.textContent = character.name;
    characterMenuClass.textContent = `${character.charClass || '-'} Nv. ${character.level || 1}`;

    let hpString = `${character.hp} / ${character.maxHp}`;
    if (character.tempHp > 0) hpString += ` (+${character.tempHp} Temp)`;
    characterMenuHp.textContent = hpString;

    if (character.visuals?.token_img) {
        characterMenuToken.style.backgroundImage = `url('${character.visuals.token_img}')`;
        characterMenuToken.style.backgroundSize = 'cover';
        characterMenuToken.style.backgroundPosition = 'center';
    } else {
        characterMenuToken.style.backgroundImage = 'none';
        (characterMenuToken as HTMLElement).style.background = character.color;
    }

    renderCharacterStatusButtons(character);

    // Estatísticas de combate
    const combatStatsDiv = document.getElementById('character-combat-stats');
    if (combatStatsDiv) {
        combatStatsDiv.innerHTML = `
            <div class="combat-stat-box"><span class="attr-label">CA</span><span class="attr-val">${character.ac || 10}</span></div>
            <div class="combat-stat-box"><span class="attr-label">Desloc.</span><span class="attr-val">${character.speed || 9}</span></div>
            <div class="combat-stat-box"><span class="attr-label">Percep. Pass.</span><span class="attr-val">${character.passivePerception || 10}</span></div>
        `;
    }

    // Atributos
    const attrGrid = document.getElementById('character-attributes');
    if (attrGrid) {
        const attrMap: Record<string, string> = { str: 'FOR', dex: 'DES', con: 'CON', int: 'INT', wis: 'SAB', cha: 'CAR' };
        attrGrid.innerHTML = Object.entries(attrMap).map(([key, label]) => {
            const val = character.attributes?.[key] || 0;
            const display = val >= 0 ? `+${val}` : val;
            return `<div class="attribute-box"><span class="attr-label">${label}</span><span class="attr-val">${display}</span></div>`;
        }).join('');
    }

    // Recursos e slots de magia
    const resourcesDiv = document.getElementById('character-resources');
    if (resourcesDiv) {
        const formatKey = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        let resHtml = '';

        if (character.resources) {
            for (const [key, val] of Object.entries(character.resources)) {
                const valStr = typeof val === 'object' ? `${(val as any).current} / ${(val as any).max}` : val;
                resHtml += `<div class="resource-item"><b>${formatKey(key)}:</b> ${valStr}</div>`;
            }
        }
        if (character.spellSlots) {
            for (const [key, val] of Object.entries(character.spellSlots)) {
                const levelStr = key.replace('level', 'Magia Nv ');
                resHtml += `<div class="resource-item"><b>${levelStr}:</b> ${(val as any).current} / ${(val as any).max}</div>`;
            }
        }

        resourcesDiv.innerHTML = `<div class="character-menu-subtitle">Recursos & Magias</div>${resHtml || '<div class="resource-item">Nenhum recurso especial.</div>'}`;
    }

    // Perícias
    const skillsDiv = document.getElementById('character-skills');
    if (skillsDiv) {
        const skillMap: Record<string, string> = {
            acrobatics: 'Acrobacia', animalHandling: 'Trato c/ Animais', arcana: 'Arcanismo',
            athletics: 'Atletismo', deception: 'Enganação', history: 'História',
            insight: 'Intuição', intimidation: 'Intimidação', investigation: 'Investigação',
            medicine: 'Medicina', nature: 'Natureza', perception: 'Percepção',
            performance: 'Atuação', persuasion: 'Persuasão', religion: 'Religião',
            sleightOfHand: 'Prestidigitação', stealth: 'Furtividade', survival: 'Sobrevivência'
        };

        const skillRows = character.skills
            ? Object.entries(character.skills).map(([key, val]) => {
                const display = (val as number) >= 0 ? `+${val}` : val;
                return `<div class="skill-item"><span>${skillMap[key] || key}</span><span>${display}</span></div>`;
            }).join('')
            : '';

        skillsDiv.innerHTML = `<div class="character-menu-subtitle">Perícias</div><div class="skills-grid">${skillRows}</div>`;
    }

    // Traits
    const traitsContainer = document.getElementById('character-traits-container');
    const traitsList = document.getElementById('character-traits');
    if (traitsContainer && traitsList) {
        if (character.traits?.length > 0) {
            traitsContainer.style.display = 'flex';
            traitsList.innerHTML = character.traits.map((t: any) => `
                <div class="feature-item">
                    <span class="feature-name">${t.name}.</span>
                    <span class="feature-desc">${t.desc || ''}</span>
                </div>
            `).join('');
        } else {
            traitsContainer.style.display = 'none';
        }
    }

    // Actions
    const actionsContainer = document.getElementById('character-actions-container');
    const actionsList = document.getElementById('character-actions');
    if (actionsContainer && actionsList) {
        if (character.actions?.length > 0) {
            actionsContainer.style.display = 'flex';
            actionsList.innerHTML = character.actions.map((a: any) => {
                let details = a.desc || '';
                if (a.damage) {
                    const modifier = a.mod ? `<strong>Acerto:</strong> ${a.mod}` : '';
                    const range    = a.range ? ` | <strong>Alcance:</strong> ${a.range}` : '';
                    const dmgType  = a.type ? `(${a.type})` : '';
                    details += `${modifier ? modifier + ' | ' : ''}<strong>Dano:</strong> ${a.damage} ${dmgType}${range}`;
                }
                return `<div class="feature-item"><span class="feature-name">${a.name}.</span><span class="feature-desc">${details}</span></div>`;
            }).join('');
        } else {
            actionsContainer.style.display = 'none';
        }
    }
}

// ======================================================
// MENU DE PERSONAGEM — ABRIR / FECHAR
// ======================================================
function openCharacterMenu(character: any, x: number, y: number) {
    state.selectedCharacter = character;
    updateCharacterPanels();

    const tokenImgDiv = document.getElementById('character-menu-token');
    if (tokenImgDiv && character.visuals?.token_img) {
        tokenImgDiv.style.backgroundImage = `url('${character.visuals.token_img}')`;
        tokenImgDiv.style.backgroundSize = 'cover';
        tokenImgDiv.style.backgroundPosition = 'center';
    }

    characterMenu.style.display = 'flex';

    const rect = characterMenu.getBoundingClientRect();
    const padding = 18;
    const left = Math.min(Math.max(x + 18, padding), w.innerWidth  - rect.width  - padding);
    const top  = Math.min(Math.max(y - rect.height / 2, padding), w.innerHeight - rect.height - padding);

    characterMenu.style.left = `${left}px`;
    characterMenu.style.top  = `${top}px`;
}

function closeCharacterMenu(e: any = null) {
    if (e?.stopPropagation) e.stopPropagation();
    characterMenu.style.display = 'none';

    const editMode = document.getElementById('char-edit-mode');
    const viewMode = document.getElementById('char-view-mode');
    if (editMode && viewMode) {
        editMode.style.display = 'none';
        viewMode.style.display = 'flex';
    }
}

// ======================================================
// DRAG DOS MENUS FLUTUANTES
// ======================================================
function startCharacterMenuDrag(e: MouseEvent) {
    if ((e.target as HTMLElement).closest('button, input')) return;

    const rect = characterMenuShell.getBoundingClientRect();
    const isHeader = !!(e.target as HTMLElement).closest('#character-menu-header');
    if (e.clientY - rect.top > 26 && !isHeader) return;

    state.isDraggingCharacterMenu = true;
    state.characterMenuDragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
    e.stopPropagation();
}

function startEffectMenuDrag(e: MouseEvent) {
    if ((e.target as HTMLElement).closest('button, input, .menu-item')) return;

    const shell = document.querySelector('.effect-menu-shell') as HTMLElement;
    if (!shell) return;
    if (!(e.target as HTMLElement).closest('.effect-menu-header')) return;

    state.isDraggingEffectMenu = true;
    const rect = shell.getBoundingClientRect();
    state.effectMenuDragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
    e.stopPropagation();
}

document.querySelector('.effect-menu-shell')?.addEventListener('mousedown', startEffectMenuDrag as EventListener);
characterMenuShell.addEventListener('mousedown', startCharacterMenuDrag as EventListener);

// ======================================================
// CONTROLES DE CENA
// ======================================================
const updateIcons = () => {
    createIcons({
        icons: {
            Users,
            Copy,
            Sparkle,
            BookOpen,
            WandSparkles,
            MousePointer2,
            Brush,
            Hash,
            Square,
            Circle,
            Triangle,
            Type,
            Grid3X3,
            Trash2,
            Eye,
            EyeOff,
            Lock,
            Unlock,
            PenTool,
            Ruler
        }
    });
};

function toggleGrid() {
    state.showGrid = !state.showGrid;
    document.getElementById('btn-tool-grid')?.classList.toggle('active', state.showGrid);
};

// ======================================================
// FERRAMENTAS
// ======================================================
function setTool(toolName: string) {
    // Ao sair da caneta, limpa rascunhos que não receberam efeito
    // (mas só se o usuário não os selecionou depois — editingZone aponta para eles)
    if (toolName !== 'ruler') {
        resetRuler()
    }

    if (state.currentDrawMode === 'pen' && toolName !== 'pen') {
        state.activeZones = state.activeZones.filter((z: any) =>
            !z.isDraft || z === state.editingZone
        )
        resetPen()
    }
 
    state.currentDrawMode = toolName
 
    document.querySelectorAll('.tool-btn:not(.grid-toggle-btn)').forEach(btn => btn.classList.remove('active'))
    const activeBtn = document.getElementById(`btn-tool-${toolName}`) || document.getElementById(`tool-${toolName}`)
    activeBtn?.classList.add('active')
 
    state.editingZone        = null
    state.selectedCharacter  = null
    state.isDrawingCircle    = false
    state.isDrawingShape     = false
    state.gesturePoints      = []
    state.mouseDownTarget    = null
    state.mouseDownPoint     = null
    state.potentialZone      = null
    state.isDraggingToken    = false
    state.isDraggingZone     = false
    state.isResizing         = false
 
    closeCharacterMenu()
    if (menu) menu.style.display = 'none'
    updateCharacterPanels()
 
    if (typeof (window as any).renderLayersList === 'function') {
        ;(window as any).renderLayersList()
    }
}

// ======================================================
// INICIATIVA
// ======================================================
function renderInitiativeList() {
    const listContainer = document.getElementById('initiative-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    characters.forEach(char => {
        const item = document.createElement('div');
        item.className = `initiative-item ${char.isTurn ? 'active-turn' : ''}`;
        item.innerHTML = `
            <span class="char-name">${char.name}</span>
            <input type="number" class="init-input" value="${char.initiative}"
                onblur="updateCharInitiative('${char.id}', this.value)">
        `;
        listContainer.appendChild(item);
    });
}

function updateCharInitiative(id: string, value: string) {
    const char = characters.find(c => c.id === id);
    if (!char) return;
    char.initiative = parseInt(value, 10) || 0;
    CombatLogic.sortInitiative((idx: number) => {
        CombatLogic.updateActiveTurn(idx);
        renderInitiativeList();
    });
}

// ======================================================
// BESTIÁRIO
// ======================================================
function addMonsterFromSelect() {
    const select = document.getElementById('monster-select') as HTMLSelectElement;
    if (!select.value) { alert('Selecione um monstro no bestiário primeiro!'); return; }
    CombatLogic.spawnMonster(select.value, w.innerWidth / 2, w.innerHeight / 2, renderInitiativeList);
}

function removeMonsterFromMap() {
    if (!state.selectedCharacter) return;
    const deleted = CombatLogic.deleteCharacter(state.selectedCharacter.id);
    if (deleted) {
        state.selectedCharacter = null;
        closeCharacterMenu();
        renderInitiativeList();
        CombatLogic.saveToLocalStorage(characters);
    }
}

// ======================================================
// IMPORTAÇÃO DE PERSONAGENS
// ======================================================
function parseAndAddCharacters(data: any) {
    const charArray = Array.isArray(data) ? data : [data];
    let addedCount = 0;

    const centerX = w.innerWidth  / 2;
    const centerY = w.innerHeight / 2;

    charArray.forEach((charData: any, index: number) => {
        if (!charData.name) return;

        characters.push({
            ...charData,
            id:         `char_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
            x:          charData.x || centerX + index * 35,
            y:          charData.y || centerY + index * 35,
            initiative: charData.initiative || 0,
            isTurn:     false,
            statuses:   charData.statuses || [],
            radius:     charData.radius   || 30,
            hp:         charData.hp !== undefined ? charData.hp : (charData.maxHp || 10),
        });
        addedCount++;
    });

    if (addedCount > 0) {
        CombatLogic.saveToLocalStorage(characters);
        console.log(`${addedCount} personagens importados.`);
        w.closeImportModal?.();
        renderInitiativeList();
    } else {
        alert('Nenhum personagem válido encontrado no JSON.');
    }
}

function openImportModal() {
    const modal = document.getElementById('import-character-modal');
    if (!modal) return;
    (document.getElementById('import-file-input')    as HTMLInputElement).value  = '';
    (document.getElementById('import-json-textarea') as HTMLTextAreaElement).value = '';
    modal.style.display = 'flex';
}

function closeImportModal() {
    const modal = document.getElementById('import-character-modal');
    if (modal) modal.style.display = 'none';
}

function processImportedJson() {
    const fileInput = document.getElementById('import-file-input')    as HTMLInputElement;
    const textArea  = document.getElementById('import-json-textarea') as HTMLTextAreaElement;

    if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = e => {
            try { parseAndAddCharacters(JSON.parse(e.target?.result as string)); }
            catch { alert('Erro no arquivo JSON.'); }
        };
        reader.readAsText(file);
    } else if (textArea.value.trim()) {
        try { parseAndAddCharacters(JSON.parse(textArea.value.trim())); }
        catch { alert('Erro no texto JSON colado.'); }
    }
}

// ======================================================
// EDIÇÃO INLINE DE PERSONAGEM
// ======================================================
function openEditCharacterModal() {
    const char = state.selectedCharacter;
    if (!char) return;

    (document.getElementById('edit-char-name')   as HTMLInputElement).value = char.name     || '';
    (document.getElementById('edit-char-hp')     as HTMLInputElement).value = char.hp       || 0;
    (document.getElementById('edit-char-maxhp')  as HTMLInputElement).value = char.maxHp    || 0;
    (document.getElementById('edit-char-temphp') as HTMLInputElement).value = char.tempHp   || 0;
    (document.getElementById('edit-char-ac')     as HTMLInputElement).value = char.ac       || 0;
    (document.getElementById('edit-char-speed')  as HTMLInputElement).value = char.speed    || 0;
    (document.getElementById('edit-char-init')   as HTMLInputElement).value = char.initiative || 0;
    (document.getElementById('edit-char-radius') as HTMLInputElement).value = char.radius   || 30;
    (document.getElementById('edit-char-img')    as HTMLInputElement).value = char.visuals?.token_img || char.avatar || '';

    document.getElementById('char-view-mode')!.style.display = 'none';
    document.getElementById('char-edit-mode')!.style.display = 'flex';
}

function closeEditCharacterModal() {
    document.getElementById('char-edit-mode')!.style.display = 'none';
    document.getElementById('char-view-mode')!.style.display = 'flex';
}

function saveCharacterEdit() {
    const char = state.selectedCharacter;
    if (!char) return;

    const get = (id: string) => document.getElementById(id) as HTMLInputElement;

    char.name      = get('edit-char-name').value.trim();
    char.maxHp     = parseInt(get('edit-char-maxhp').value)  || 1;
    char.hp        = Math.min(Math.max(0, parseInt(get('edit-char-hp').value) || 0), char.maxHp);
    char.tempHp    = parseInt(get('edit-char-temphp').value) || 0;
    char.ac        = parseInt(get('edit-char-ac').value)     || 10;
    char.speed     = parseInt(get('edit-char-speed').value)  || 0;
    char.initiative= parseInt(get('edit-char-init').value)   || 0;
    char.radius    = Math.max(10, parseInt(get('edit-char-radius').value) || 30);

    if (!char.visuals) char.visuals = {};
    char.visuals.token_img = get('edit-char-img').value.trim();

    closeEditCharacterModal();
    updateCharacterPanels();
    renderInitiativeList();

    const tokenImgDiv = document.getElementById('character-menu-token');
    if (tokenImgDiv && char.visuals.token_img) {
        tokenImgDiv.style.backgroundImage = `url('${char.visuals.token_img}')`;
    }

    CombatLogic.saveToLocalStorage(characters);
}

function renderLayersList() {
    const layersContainer = document.getElementById('layers-list'); // Container de Efeitos/Camadas
    const spellsContainer = document.getElementById('spells-list'); // VOCÊ PRECISA CRIAR ESTE ID NO HTML
    
    if (!layersContainer) return;

    // Limpa os dois
    layersContainer.innerHTML = '';
    if (spellsContainer) spellsContainer.innerHTML = '';

    // Inverte para manter a ordem visual (quem está no topo do array fica no topo da lista)
    const reversedZones = [...state.activeZones].reverse();

    reversedZones.forEach((zone) => {
        // Fallbacks de segurança
        if (zone.visible === undefined) zone.visible = true;
        if (zone.locked === undefined) zone.locked = false;
        if (!zone.name) zone.name = zone.type === 'spell_object' ? "Magia" : "Área";

        // Cria o HTML do item
        const itemHTML = `
            <div class="entity-item layer-item ${state.editingZone?.id === zone.id ? 'current' : ''}">
                <div class="entity-info" onclick="selectLayer('${zone.id}')">
                    <span class="entity-name">${zone.name}</span>
                    <span class="entity-sub">${zone.category}</span>
                </div>
                <div class="entity-actions">
                    <button class="entity-action-btn" onclick="toggleLayerVisibility('${zone.id}', event)">
                        <i data-lucide="${zone.visible !== false ? 'eye' : 'eye-off'}"></i>
                    </button>
                    <button class="entity-action-btn" onclick="toggleLayerLock('${zone.id}', event)">
                        <i data-lucide="${zone.locked ? 'lock' : 'unlock'}"></i>
                    </button>
                </div>
            </div>
        `;

        // DISTRIBUIÇÃO: Se for magia, vai para um lado. Se for efeito de área/desenho, vai para o outro.
        if (zone.type === 'spell_object') {
            if (spellsContainer) {
                spellsContainer.insertAdjacentHTML('beforeend', itemHTML);
            } else {
                // Se o spells-list não existir, joga tudo no layers-list para não sumir
                layersContainer.insertAdjacentHTML('beforeend', itemHTML);
            }
        } else {
            layersContainer.insertAdjacentHTML('beforeend', itemHTML);
        }
    });

    // Atualiza os ícones do Lucide
    if (w.updateIcons) {
        w.updateIcons();
    }
}

// ======================================================
// INICIALIZAÇÃO DA UI E LOOP
// ======================================================

const mouseTools = {
    getMapCoords,
    getCharacterAtPosition,
    updateCharacterPanels,
    closeCharacterMenu,
    openCharacterMenu,
    renderSideCharacterStatuses: (char: any) => renderSideCharacterStatuses(char),
    renderEffectMenu: RadialMenu.renderEffectMenu,
    showMenu: RadialMenu.showMenu
};

// ======================================================
// EXPOSIÇÃO GLOBAL (necessário para onclick no HTML)
// ======================================================

w.toggleSideMenu          = () => sideMenu.classList.toggle('collapsed');
w.toggleGrid              = toggleGrid;
w.setTool                 = setTool;
w.adjustZoom              = (delta: number) => {
    if (!viewport) return;
    if (delta === -1) viewport.animate({ scale: 1, time: 250 });
    else viewport.animate({ scale: viewport.scale.x + delta, time: 200 });
};
w.menuGoBack              = RadialMenu.menuGoBack;
w.closeMenu               = RadialMenu.closeMenu;
w.deleteEffect            = RadialMenu.deleteEffect;
w.clearArea               = RadialMenu.clearArea;
w.updateCharInitiative    = updateCharInitiative;
w.closeCharacterMenu      = closeCharacterMenu;
w.removeMonsterFromMap    = removeMonsterFromMap;
w.addMonsterFromSelect    = BestiaryUI.addMonsterFromSelect;
w.openImportModal         = openImportModal;
w.closeImportModal        = closeImportModal;
w.processImportedJson     = processImportedJson;
w.openEditCharacterModal  = openEditCharacterModal;
w.closeEditCharacterModal = closeEditCharacterModal;
w.saveCharacterEdit       = saveCharacterEdit;
w.renderLayersList        = renderLayersList;
w.createIcons             = createIcons;
w.updateIcons             = updateIcons
w.setUnit = (unit: 'ft' | 'm') => {
    setDistanceUnit(unit)
    document.getElementById('btn-unit-ft')?.classList.toggle('active', unit === 'ft')
    document.getElementById('btn-unit-m')?.classList.toggle('active', unit === 'm')
}
w.applyCharacterHp = (direction: number) => {
    if (!state.selectedCharacter) return;
    const amount = Math.max(0, Number(characterHpInput.value) || 0);
    CombatLogic.changeHP(state.selectedCharacter.id, amount * direction, () => {
        updateCharacterPanels();
        CombatLogic.saveToLocalStorage(characters);
    });
};
w.nextTurn = () => CombatLogic.nextTurn((idx: number) => {
    CombatLogic.updateActiveTurn(idx);
    renderInitiativeList();
});
w.prevTurn = () => CombatLogic.prevTurn((idx: number) => {
    CombatLogic.updateActiveTurn(idx);
    renderInitiativeList();
});
w.sortInitiative = () => CombatLogic.sortInitiative((idx: number) => {
    CombatLogic.updateActiveTurn(idx);
    renderInitiativeList();
});
w.resetCombat = () => CombatLogic.resetCombat(() => {
    renderInitiativeList();
});
w.spawn = (id: string) => {
    // Pega o centro exato de onde o mestre está olhando agora
    const center = viewport.center;
    CombatLogic.spawnMonster(id, center.x, center.y, renderInitiativeList);
};
w.selectLayer = (id: string) => {
    const zone = state.activeZones.find(z => z.id === id);
    if (zone) state.editingZone = zone;
    renderLayersList();
};
w.toggleLayerVisibility = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const zone = state.activeZones.find(z => z.id === id);
    if (zone) zone.visible = !zone.visible;
    renderLayersList();
};
w.toggleLayerLock = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const zone = state.activeZones.find(z => z.id === id);
    if (zone) zone.locked = !zone.locked;
    renderLayersList();
};

async function bootstrap() {
    await initScene(canvas);
    await loadStatusIcons()

    window.addEventListener('pointerdown', () => {
        console.log("Interação detectada, vídeos destravados.");
    }, { once: true });

    initMouseEvents(canvas, null as any, state, mouseTools);
    BestiaryUI.populateMonsterSelect();

    // Lógica correta:
    // - Se character.ts tem personagens, eles são a fonte da verdade
    // - localStorage só é usado para monstros spawnados (isNPC: true)
    //   e para salvar o estado de HP/status dos personagens entre sessões
    const savedChars = loadFromLocalStorage();

    if (savedChars.length > 0) {
        // Restaura HP e status dos personagens fixos do character.ts
        characters.forEach(char => {
            const saved = savedChars.find((s: any) => s.id === char.id)
            if (saved) {
                char.hp       = saved.hp
                char.tempHp   = saved.tempHp
                char.statuses = saved.statuses
                char.initiative = saved.initiative
                char.x        = saved.x
                char.y        = saved.y
            }
        })

        // Adiciona só os NPCs/monstros spawnados (não os personagens fixos)
        const spawnedNPCs = savedChars.filter((s: any) => 
            s.isNPC && !characters.find(c => c.id === s.id)
        )
        if (spawnedNPCs.length > 0) {
            characters.push(...spawnedNPCs)
        }
    }

    app.ticker.add(() => {
        state.concentrationPulse += 0.08
        Renderer.drawGrid(BASE_GRID_SIZE, state.gridScale)
        syncEffects(state.activeZones, state.editingZone)
        syncTokens(characters, state.tokenScale, state.selectedCharacter?.id, state.concentrationPulse)
        syncUI(state)
        gizmo.tick()
        drawPenPreview();
        drawRuler() 
    })
    syncEffects(state.activeZones, state.editingZone);
    renderInitiativeList();
}

updateIcons();
bootstrap();
renderSideCharacterStatuses(null);
renderInitiativeList();
