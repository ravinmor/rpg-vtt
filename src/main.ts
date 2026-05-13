import { backgroundDefinitions } from './data/background';
import { characters } from './data/character';
import { menuDatabase } from './data/menu';
import { spellDatabase } from './data/spells'
import { createImage, loadStatusIcons } from './utils/images';
import { createVideo } from './utils/videos';
import { getBoundingBox, checkIntersection, isPointInPolygon, generateShapePath } from './utils/math';
import { 
    statusDefinitions, 
    statusLabelMap,
    BASE_GRID_SIZE 
} from './data/constants';
import * as CombatLogic from './state/gameState';
import * as Renderer from './engine/renderer'
import { drawCharacter, drawTurnHighlight } from './engine/characterDrawer';
import { drawActiveZones } from './engine/effectDrawer';
import * as UIDrawer from './engine/uiDrawer';
import { initMouseEvents } from './events/mouseHandlers';
import { state } from './state/globalState';
import * as RadialMenu from './ui/radialMenu';
import * as BestiaryUI from './ui/bestiaryUI';
import { loadFromLocalStorage } from './state/gameState';

// ======================================================
// CANVAS E RENDERIZAÇÃO
// ======================================================
const canvas = document.getElementById('vttCanvas');
const ctx = canvas.getContext('2d');

// ======================================================
// MENUS PRINCIPAIS
const menu = document.getElementById('radial-menu');
const sideMenu = document.getElementById('side-menu');
const characterMenu = document.getElementById('character-menu');

// ======================================================
// CONTROLES DE CENÁRIO
// =====================================================
const backgroundSelect = document.getElementById('background-select');

// ======================================================
// MENU DE PERSONAGEM
// ======================================================
const characterMenuShell = document.getElementById('character-menu-shell');
const characterMenuHeader = document.getElementById('character-menu-header');

const characterMenuName = document.getElementById('character-menu-name');
const characterMenuClass = document.getElementById('character-menu-class');

const characterMenuHp = document.getElementById('character-menu-hp');
const characterHpInput = document.getElementById('character-hp-input');

const characterMenuToken = document.getElementById('character-menu-token');

// ======================================================
// STATUS DO PERSONAGEM
// ======================================================
const characterStatusGrid = document.getElementById('character-status-grid');

const sideCharacterName = document.getElementById('side-character-name');
const sideCharacterStatuses = document.getElementById('side-character-statuses');

const mouseTools = {
    getMapCoords,
    getCharacterAtPosition,
    updateCharacterPanels,
    closeCharacterMenu,
    openCharacterMenu,
    renderSideCharacterStatuses,
    renderEffectMenu: RadialMenu.renderEffectMenu,
    showMenu: RadialMenu.showMenu
};

initMouseEvents(canvas, ctx, state, mouseTools);

const statusIcons = loadStatusIcons();

BestiaryUI.populateMonsterSelect();

const savedChars = loadFromLocalStorage();
if (savedChars.length > 0) {
    // IMPORTANTE: Limpar o array original mantendo a mesma referência
    characters.splice(0, characters.length); 
    characters.push(...savedChars);
    console.log("Dados carregados do LocalStorage:", characters.length, "personagens");
}

function toggleSideMenu() {
  sideMenu.classList.toggle('collapsed');
}

export const backgroundAssets = Object.fromEntries(
    Object.entries(backgroundDefinitions).map(([key, config]) => [
        key, 
        { 
            image: createImage(config.path), 
            repeat: config.repeat 
        }
    ])
);

function setBackground(type) {
    state.currentBackground = type;
}

function toggleGrid() {
    state.showGrid = !state.showGrid;
    document.getElementById('btn-grid').classList.toggle('active', state.showGrid);
}

function adjustZoom(delta) {
    if (delta === -1) state.gridScale = 1.0; // Reset
    else state.gridScale = Math.max(0.2, state.gridScale + delta); // Limite mínimo para não travar
}

function adjustTokenZoom(delta) {
    if (delta === -1) {
        state.tokenScale = 1.0; // Reset para o tamanho original (radius: 30)
    } else if (delta === 2) {
        state.tokenScale = 2.0; // Atalho para criaturas grandes
    } else {
        state.tokenScale = Math.min(Math.max(0.5, state.tokenScale + delta), 4.0); // Limite entre 0.5x e 4x
    }
}

function getMapCoords(e) {
    // Se você não estiver usando zoom global (apenas no grid), 
    // esta função deve apenas retornar o valor bruto para evitar erros.
    return {
        x: e.clientX,
        y: e.clientY
    };
}

function getCharacterAtPosition(x, y) {
    for (let i = characters.length - 1; i >= 0; i--) {
        const character = characters[i];
        // Multiplicamos o radius pelo tokenScale na checagem de distância
        if (Math.hypot(x - character.x, y - character.y) <= (character.radius * state.tokenScale)) {
            return character;
        }
    }
    return null;
}

function toggleStatus(characterId, statusKey) {
    const character = characters.find((item) => item.id === characterId);
    if (!character) return;

    if (!character.statuses.includes(statusKey)) {
        character.statuses.push(statusKey);
    } else {
        character.statuses = character.statuses.filter((status) => status !== statusKey);
    }

    updateCharacterPanels();
    // SALVA SEMPRE QUE UM STATUS MUDA
    CombatLogic.saveToLocalStorage(characters);
}

function removeStatus(characterId, statusKey) {
    const character = characters.find((item) => item.id === characterId);
    if (!character) return;
    character.statuses = character.statuses.filter((status) => status !== statusKey);
    updateCharacterPanels();
}

function renderCharacterStatusButtons(character) {
    characterStatusGrid.innerHTML = '';

    statusDefinitions.forEach((status) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `character-status-btn${character.statuses.includes(status.key) ? ' active' : ''}`;
        button.textContent = status.label;
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleStatus(character.id, status.key);
        });
        characterStatusGrid.appendChild(button);
    });
}

function renderSideCharacterStatuses(character) {
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

    character.statuses.forEach((status) => {
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

function updateCharacterMenu(character) {
    if (!character) return;
    
    // Básico
    characterMenuName.textContent = character.name;
    characterMenuClass.textContent = `${character.charClass || '-'} Nv. ${character.level || 1}`;
    
    // HP (incluindo HP Temporário)
    let hpString = `${character.hp} / ${character.maxHp}`;
    if (character.tempHp > 0) hpString += ` (+${character.tempHp} Temp)`;
    characterMenuHp.textContent = hpString;
    
    // Avatar/Cor
    if (character.visuals && character.visuals.token_img) {
        characterMenuToken.style.backgroundImage = `url('${character.visuals.token_img}')`;
        characterMenuToken.style.backgroundSize = 'cover';
        characterMenuToken.style.backgroundPosition = 'center';
    } else {
        characterMenuToken.style.backgroundImage = 'none';
        characterMenuToken.style.background = character.color;
    }
    
    // Atualiza botões de status
    if (typeof renderCharacterStatusButtons === 'function') {
        renderCharacterStatusButtons(character);
    }

    // 1. Estatísticas de Combate
    const combatStatsDiv = document.getElementById('character-combat-stats');
    if (combatStatsDiv) {
        combatStatsDiv.innerHTML = `
            <div class="combat-stat-box"><span class="attr-label">CA</span><span class="attr-val">${character.ac || 10}</span></div>
            <div class="combat-stat-box"><span class="attr-label">Desloc.</span><span class="attr-val">${character.speed || 9}</span></div>
            <div class="combat-stat-box"><span class="attr-label">Percep. Pass.</span><span class="attr-val">${character.passivePerception || 10}</span></div>
        `;
    }

    // 2. Atributos
    const attrGrid = document.getElementById('character-attributes');
    if (attrGrid) {
        const attrMap = { str: 'FOR', dex: 'DES', con: 'CON', int: 'INT', wis: 'SAB', cha: 'CAR' };
        let attrHtml = '';
        
        for (const [key, label] of Object.entries(attrMap)) {
            const val = character.attributes ? character.attributes[key] || 0 : 0;
            const displayVal = val >= 0 ? `+${val}` : val;
            attrHtml += `<div class="attribute-box"><span class="attr-label">${label}</span><span class="attr-val">${displayVal}</span></div>`;
        }
        attrGrid.innerHTML = attrHtml;
    }

    // 3. Recursos e Slots de Magia
    const resourcesDiv = document.getElementById('character-resources');
    if (resourcesDiv) {
        let resHtml = '';
        
        // Formata nomes camelCase para texto legível (ex: actionSurge -> Action Surge)
        const formatKey = (str) => str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

        if (character.resources) {
            for (const [key, val] of Object.entries(character.resources)) {
                const valStr = typeof val === 'object' ? `${val.current} / ${val.max}` : val;
                resHtml += `<div class="resource-item"><b>${formatKey(key)}:</b> ${valStr}</div>`;
            }
        }
        if (character.spellSlots) {
            for (const [key, val] of Object.entries(character.spellSlots)) {
                const levelStr = key.replace('level', 'Magia Nv ');
                resHtml += `<div class="resource-item"><b>${levelStr}:</b> ${val.current} / ${val.max}</div>`;
            }
        }
        if (resHtml === '') {
             resHtml = `<div class="resource-item">Nenhum recurso especial.</div>`;
        }
        resourcesDiv.innerHTML = `<div class="character-menu-subtitle">Recursos & Magias</div>${resHtml}`;
    }

    // 4. Perícias
    const skillsDiv = document.getElementById('character-skills');
    if (skillsDiv) {
        const skillMap = {
            acrobatics: 'Acrobacia', animalHandling: 'Trato c/ Animais', arcana: 'Arcanismo', athletics: 'Atletismo',
            deception: 'Enganação', history: 'História', insight: 'Intuição', intimidation: 'Intimidação',
            investigation: 'Investigação', medicine: 'Medicina', nature: 'Natureza', perception: 'Percepção',
            performance: 'Atuação', persuasion: 'Persuasão', religion: 'Religião', sleightOfHand: 'Prestidigitação',
            stealth: 'Furtividade', survival: 'Sobrevivência'
        };
        
        let skillHtml = '<div class="character-menu-subtitle">Perícias</div><div class="skills-grid">';
        if (character.skills) {
            for (const [key, val] of Object.entries(character.skills)) {
                const displayVal = val >= 0 ? `+${val}` : val;
                skillHtml += `<div class="skill-item"><span>${skillMap[key] || key}</span><span>${displayVal}</span></div>`;
            }
        }
        skillHtml += '</div>';
        skillsDiv.innerHTML = skillHtml;
    }

    // ==========================================
    // 5. RENDERIZAÇÃO DE TRAITS (HABILIDADES)
    // ==========================================
    const traitsContainer = document.getElementById('character-traits-container');
    const traitsList = document.getElementById('character-traits');
    
    if (traitsContainer && traitsList) {
        if (character.traits && character.traits.length > 0) {
            traitsContainer.style.display = 'flex';
            traitsList.innerHTML = character.traits.map(t => `
                <div class="feature-item">
                    <span class="feature-name">${t.name}.</span>
                    <span class="feature-desc">${t.desc || ''}</span>
                </div>
            `).join('');
        } else {
            traitsContainer.style.display = 'none';
        }
    }

    // ==========================================
    // 6. RENDERIZAÇÃO DE ACTIONS (AÇÕES E ATAQUES)
    // ==========================================
    const actionsContainer = document.getElementById('character-actions-container');
    const actionsList = document.getElementById('character-actions');
    
    if (actionsContainer && actionsList) {
        if (character.actions && character.actions.length > 0) {
            actionsContainer.style.display = 'flex';
            actionsList.innerHTML = character.actions.map(a => {
                let details = a.desc ? a.desc : '';
                
                // Formatação para ataques com armas/magias
                if (a.damage) {
                    const modifier = a.mod ? `<strong>Acerto:</strong> ${a.mod}` : '';
                    const range = a.range ? ` | <strong>Alcance:</strong> ${a.range}` : '';
                    const dmgType = a.type ? `(${a.type})` : '';
                    
                    const prefix = modifier ? `${modifier} | ` : '';
                    details += `${prefix}<strong>Dano:</strong> ${a.damage} ${dmgType} ${range}`;
                }
                
                return `
                <div class="feature-item">
                    <span class="feature-name">${a.name}.</span>
                    <span class="feature-desc">${details}</span>
                </div>
                `;
            }).join('');
        } else {
            actionsContainer.style.display = 'none';
        }
    }
}

function updateCharacterPanels() {
    if (!state.selectedCharacter) {
        renderSideCharacterStatuses(null);
        return;
    }

    const currentCharacter = characters.find((item) => item.id === state.selectedCharacter.id);
    if (!currentCharacter) return;

    state.selectedCharacter = currentCharacter;
    updateCharacterMenu(currentCharacter);
    renderSideCharacterStatuses(currentCharacter);
}

function openCharacterMenu(character, x, y) {
    state.selectedCharacter = character;
    
    // 1. Atualiza os textos, atributos e a IMAGEM do JSON
    updateCharacterPanels();

    // 2. Garante que a imagem do JSON apareça na div de token do menu
    const tokenImgDiv = document.getElementById('character-menu-token');
    if (tokenImgDiv && character.visuals && character.visuals.token_img) {
        tokenImgDiv.style.backgroundImage = `url('${character.visuals.token_img}')`;
        tokenImgDiv.style.backgroundSize = 'cover';
        tokenImgDiv.style.backgroundPosition = 'center';
    }

    // 3. Muda para 'flex' para o seu layout widescreen (horizontal) não quebrar
    characterMenu.style.display = 'flex';

    // 4. Posicionamento inteligente na tela
    const rect = characterMenu.getBoundingClientRect();
    const padding = 18;
    const left = Math.min(Math.max(x + 18, padding), window.innerWidth - rect.width - padding);
    const top = Math.min(Math.max(y - rect.height / 2, padding), window.innerHeight - rect.height - padding);

    characterMenu.style.left = `${left}px`;
    characterMenu.style.top = `${top}px`;
}

function closeCharacterMenu(e: any = null) {
    if (e && e.stopPropagation) e.stopPropagation();
    characterMenu.style.display = 'none';

    // FORÇA O RESET PARA O MODO LEITURA (Descarta as edições não salvas)
    const editMode = document.getElementById('char-edit-mode');
    const viewMode = document.getElementById('char-view-mode');
    
    if (editMode && viewMode) {
        editMode.style.display = 'none';
        viewMode.style.display = 'flex';
    }
}

function startCharacterMenuDrag(e) {
    if (e.target.closest('button, input')) return;

    const rect = characterMenuShell.getBoundingClientRect();
    const isTopEdge = e.clientY - rect.top <= 26;
    const isHeaderArea = !!e.target.closest('#character-menu-header');

    if (!isTopEdge && !isHeaderArea) return;

    state.isDraggingCharacterMenu = true;
    state.characterMenuDragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    e.preventDefault();
    e.stopPropagation();
}

function startEffectMenuDrag(e) {
    // Ignora o clique se for num botão (como fechar, voltar ou os próprios efeitos)
    if (e.target.closest('button, input, .menu-item')) return;

    const shell = document.querySelector('.effect-menu-shell');
    const rect = shell.getBoundingClientRect();
    const isHeaderArea = !!e.target.closest('.effect-menu-header');

    // Só permite iniciar o arraste se clicar no cabeçalho
    if (!isHeaderArea) return;

    state.isDraggingEffectMenu = true;
    state.effectMenuDragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    e.preventDefault();
    e.stopPropagation();
}

// Vincula o evento ao menu
document.querySelector('.effect-menu-shell').addEventListener('mousedown', startEffectMenuDrag);

characterMenuShell.addEventListener('mousedown', startCharacterMenuDrag);

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

function setTool(toolName) {
    state.currentDrawMode = toolName;
    
    // 1. Atualiza visualmente os botões
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    
    // Suporta tanto IDs antigos (tool-brush) quanto novos (btn-tool-brush)
    const activeBtn = document.getElementById(`btn-tool-${toolName}`) || document.getElementById(`tool-${toolName}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // 2. Limpa TODOS os estados de interação para evitar bugs fantasmas
    state.editingZone = null;
    state.selectedCharacter = null;
    state.isDrawingCircle = false;
    state.isDrawingShape = false;
    state.gesturePoints = [];
    state.mouseDownTarget = null;
    state.mouseDownPoint = null;
    state.potentialZone = null;
    state.isDraggingToken = false;
    state.isDraggingZone = false;
    state.isResizing = false;

    // 3. Fecha menus que estavam abertos
    closeCharacterMenu();
    if (menu) menu.style.display = 'none';
    
    // 4. Limpa a barra lateral de status
    updateCharacterPanels();
}

function renderInitiativeList() {
    const listContainer = document.getElementById('initiative-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    characters.forEach((char) => {
        const item = document.createElement('div');
        item.className = `initiative-item ${char.isTurn ? 'active-turn' : ''}`;
        item.innerHTML = `
            <span class="char-name">${char.name}</span>
            <input type="number" class="init-input" value="${char.initiative}" 
                onblur="updateCharInitiative(${char.id}, this.value)">
        `;
        listContainer.appendChild(item);
    });
}

function updateCharInitiative(id, value) {
    const char = characters.find(c => c.id === id);
    if (!char) return;

    char.initiative = parseInt(value, 10) || 0;
    
    // Chama a ordenação do estado
    CombatLogic.sortInitiative((idx) => {
        CombatLogic.updateActiveTurn(idx);
        renderInitiativeList();
    });
}

function addMonsterFromSelect() {
    const select = document.getElementById('monster-select') as HTMLSelectElement;
    const monsterId = select.value;

    if (!monsterId) {
        alert("Selecione um monstro no bestiário primeiro!");
        return;
    }

    // Spawna no centro da visão atual do Canvas
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    CombatLogic.spawnMonster(monsterId, centerX, centerY);
    
    // Opcional: Feedback visual ou fechar menu se for mobile
    console.log(`Monstro ${monsterId} conjurado no centro.`);
}

// A "Fábrica" que joga os personagens no mapa
function parseAndAddCharacters(data: any) {
    // Transforma num array se o usuário tiver colado só um único objeto {}
    const charArray = Array.isArray(data) ? data : [data];
    let addedCount = 0;

    // Pega o centro da tela para spawnar os jogadores onde o mestre está olhando
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    charArray.forEach((charData, index) => {
        // Validação básica: se não tiver nome, ignoramos
        if (!charData.name) return;

        // --- SOLUÇÃO DO ID AUTOMÁTICO ---
        // Combinamos timestamp e número aleatório para garantir unicidade total
        const autoGeneratedId = `char_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

        const newCharacter = {
            ...charData,
            id: autoGeneratedId, // Sobrescreve/Garante ID único para cada instância
            
            // Posicionamento inteligente com offset para não sobrepor tokens
            x: charData.x || centerX + (index * 35), 
            y: charData.y || centerY + (index * 35),
            
            // Garantias de estado inicial e valores padrão
            initiative: charData.initiative || 0,
            isTurn: false,
            statuses: charData.statuses || [],
            radius: charData.radius || 30,
            // Prioriza HP atual, se não houver usa maxHp, se não houver usa 10
            hp: charData.hp !== undefined ? charData.hp : (charData.maxHp || 10)
        };

        characters.push(newCharacter);
        addedCount++;
    });

    if (addedCount > 0) {
        // --- PERSISTÊNCIA NO LOCALSTORAGE ---
        // Salva a lista completa de personagens (os antigos + os novos importados)
        try {
            localStorage.setItem('vtt_active_characters', JSON.stringify(characters));
            console.log(`${addedCount} personagens importados e salvos no navegador.`);
        } catch (e) {
            console.error("Erro ao salvar no LocalStorage:", e);
        }

        // Fecha o modal de importação
        if (typeof window.closeImportModal === 'function') {
            window.closeImportModal();
        }
        
        // Atualiza a lista de iniciativa visualmente
        if (typeof renderInitiativeList === 'function') {
            renderInitiativeList();
        }

        // Caso tenha uma função de renderização do Canvas, chame-a aqui também
        // if (typeof renderCanvas === 'function') renderCanvas();

    } else {
        alert("Nenhum personagem válido encontrado no JSON.");
    }
}

function openImportModal() {
    console.log("Abrindo modal de importação...");
    const modal = document.getElementById('import-character-modal');
    if (modal) {
        (document.getElementById('import-file-input') as HTMLInputElement).value = '';
        (document.getElementById('import-json-textarea') as HTMLTextAreaElement).value = '';
        modal.style.display = 'flex';
    }
}

function closeImportModal() {
    const modal = document.getElementById('import-character-modal');
    if (modal) modal.style.display = 'none';
}

function processImportedJson() {
    const fileInput = document.getElementById('import-file-input') as HTMLInputElement;
    const textArea = document.getElementById('import-json-textarea') as HTMLTextAreaElement;

    if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                parseAndAddCharacters(json);
            } catch (error) {
                alert("Erro no arquivo JSON.");
            }
        };
        reader.readAsText(file);
    } else if (textArea.value.trim() !== '') {
        try {
            const json = JSON.parse(textArea.value.trim());
            parseAndAddCharacters(json);
        } catch (error) {
            alert("Erro no texto JSON colado.");
        }
    }
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

function animate() {
    state.concentrationPulse += 0.08;
    
    // 1. Camadas de Base e Efeitos
    Renderer.drawBackground(ctx, canvas, backgroundAssets, state.currentBackground);

    drawActiveZones(ctx, canvas, state.activeZones, state.editingZone);

    if (state.showGrid) Renderer.drawGrid(ctx, canvas, BASE_GRID_SIZE, state.gridScale);

    // 2. Personagens e Destaques
    drawTurnHighlight(ctx, characters, state.tokenScale, state.concentrationPulse);

    characters.forEach(char => {
        // Apague o "state." do statusIcons
        drawCharacter(ctx, char, state.tokenScale, state.selectedCharacter, statusIcons);
    });

    // 3. Previews de Interface (As novas funções)
    if (state.isDrawingShape) {
        UIDrawer.drawShapePreview(ctx, state.currentDrawMode, state.shapeStart, state.shapeEnd);
    }

    UIDrawer.drawGestureLine(ctx, state.gesturePoints, state.menuOpen);

    if (!state.menuOpen) {
        UIDrawer.drawIntersectionPoint(ctx, state.intersectionPoint);
    }

    if (state.menuOpen && !state.editingZone) {
        UIDrawer.drawAreaHighlight(ctx, state.lastCirclePath);
    }

    requestAnimationFrame(animate);
}

renderSideCharacterStatuses(null);
renderInitiativeList();
animate();

window.spawn = (id, x, y) => {
    CombatLogic.spawnMonster(id, x, y, renderInitiativeList);
};
// Expondo funções para o escopo global (necessário no Vite/Módulos)
window.toggleSideMenu = toggleSideMenu;
window.setBackground = setBackground;
window.toggleGrid = toggleGrid;
window.setTool = setTool;

window.menuGoBack = RadialMenu.menuGoBack;
window.closeMenu = RadialMenu.closeMenu;
window.deleteEffect = RadialMenu.deleteEffect;
window.clearArea = RadialMenu.clearArea;

window.updateCharInitiative = updateCharInitiative;
window.adjustZoom = adjustZoom;
window.adjustTokenZoom = adjustTokenZoom;
window.closeCharacterMenu = closeCharacterMenu;
window.addMonsterFromSelect = addMonsterFromSelect;
window.addMonsterFromSelect = BestiaryUI.addMonsterFromSelect;

window.nextTurn = () => CombatLogic.nextTurn((idx) => {
    CombatLogic.updateActiveTurn(idx);
    renderInitiativeList(); // A função de UI continua no main por enquanto
});

window.prevTurn = () => CombatLogic.prevTurn((idx) => {
    CombatLogic.updateActiveTurn(idx);
    renderInitiativeList();
});

window.sortInitiative = () => CombatLogic.sortInitiative((idx) => {
    CombatLogic.updateActiveTurn(idx);
    renderInitiativeList();
});

window.applyCharacterHp = (direction) => {
    if (!state.selectedCharacter) return;
    const amount = Math.max(0, Number(characterHpInput.value) || 0);
    CombatLogic.changeHP(state.selectedCharacter.id, amount * direction, () => {
        updateCharacterPanels();
        // SALVA SEMPRE QUE O HP MUDA
        CombatLogic.saveToLocalStorage(characters);
    });
};

window.resetCombat = () => {
    CombatLogic.resetCombat(() => {
        renderInitiativeList();
    });
};

window.removeMonsterFromMap = removeMonsterFromMap;

window.openEditCharacterModal = () => {
    const char = state.selectedCharacter;
    if (!char) return;

    // 1. Preenche todos os inputs com os dados da instância
    (document.getElementById('edit-char-name') as HTMLInputElement).value = char.name || '';
    (document.getElementById('edit-char-hp') as HTMLInputElement).value = char.hp || 0;
    (document.getElementById('edit-char-maxhp') as HTMLInputElement).value = char.maxHp || 0;
    (document.getElementById('edit-char-temphp') as HTMLInputElement).value = char.tempHp || 0;
    
    (document.getElementById('edit-char-ac') as HTMLInputElement).value = char.ac || 0;
    (document.getElementById('edit-char-speed') as HTMLInputElement).value = char.speed || 0;
    (document.getElementById('edit-char-init') as HTMLInputElement).value = char.initiative || 0;
    (document.getElementById('edit-char-radius') as HTMLInputElement).value = char.radius || 30;
    
    const currentImg = char.visuals?.token_img || char.avatar || '';
    (document.getElementById('edit-char-img') as HTMLInputElement).value = currentImg;

    // 2. Transição de modo Leitura -> Edição
    document.getElementById('char-view-mode').style.display = 'none';
    document.getElementById('char-edit-mode').style.display = 'flex';
};

window.closeEditCharacterModal = () => {
    // Esconde a edição e volta para a leitura
    document.getElementById('char-edit-mode').style.display = 'none';
    document.getElementById('char-view-mode').style.display = 'flex';
};

window.saveCharacterEdit = () => {
    const char = state.selectedCharacter;
    if (!char) return;

    // 1. Coleta os novos dados digitados
    const newName = (document.getElementById('edit-char-name') as HTMLInputElement).value.trim();
    const newHp = parseInt((document.getElementById('edit-char-hp') as HTMLInputElement).value) || 0;
    const newMaxHp = parseInt((document.getElementById('edit-char-maxhp') as HTMLInputElement).value) || 1;
    const newTempHp = parseInt((document.getElementById('edit-char-temphp') as HTMLInputElement).value) || 0;
    
    const newAc = parseInt((document.getElementById('edit-char-ac') as HTMLInputElement).value) || 10;
    const newSpeed = parseInt((document.getElementById('edit-char-speed') as HTMLInputElement).value) || 0;
    const newInit = parseInt((document.getElementById('edit-char-init') as HTMLInputElement).value) || 0;
    const newRadius = parseInt((document.getElementById('edit-char-radius') as HTMLInputElement).value) || 30;
    const newImg = (document.getElementById('edit-char-img') as HTMLInputElement).value.trim();

    // 2. Injeta na Instância
    char.name = newName;
    char.maxHp = newMaxHp;
    char.hp = Math.min(Math.max(0, newHp), newMaxHp); // Trava o HP entre 0 e o Máximo
    char.tempHp = newTempHp;
    
    char.ac = newAc;
    char.speed = newSpeed;
    char.initiative = newInit;
    char.radius = Math.max(10, newRadius); // Protege para o token não sumir (raio mínimo 10)

    if (!char.visuals) char.visuals = {};
    char.visuals.token_img = newImg;

    // 3. Volta a interface para o modo de visualização
    window.closeEditCharacterModal();
    
    // 4. Manda o VTT atualizar as informações visuais
    if (typeof updateCharacterPanels === 'function') updateCharacterPanels();
    
    // Atualiza a Iniciativa e re-ordena se o mestre tiver editado ela
    if (typeof renderInitiativeList === 'function') {
        if (typeof sortInitiative === 'function') sortInitiative(); // Opcional: já auto-organiza
        renderInitiativeList();
    }
    
    // Atualiza a imagem do painel lateral
    const tokenImgDiv = document.getElementById('character-menu-token');
    if (tokenImgDiv && char.visuals.token_img) {
        tokenImgDiv.style.backgroundImage = `url('${char.visuals.token_img}')`;
    }

    CombatLogic.saveToLocalStorage(characters);
    
    window.closeEditCharacterModal();
};

// --- Vá ao final do arquivo e exponha elas assim (Sem repetir os nomes) ---

window.openImportModal = openImportModal;
window.closeImportModal = closeImportModal;
window.processImportedJson = processImportedJson;