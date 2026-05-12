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
    renderSideCharacterStatuses,
    renderEffectMenu: () => renderEffectMenu(),
    showMenu: (x, y, isEditing) => showMenu(x, y, isEditing)
};

initMouseEvents(canvas, ctx, state, mouseTools);

const statusIcons = loadStatusIcons();

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
    
    characterMenuToken.style.background = character.color;
    
    // Atualiza botões de status
    renderCharacterStatusButtons(character);

    // 1. Estatísticas de Combate
    const combatStatsDiv = document.getElementById('character-combat-stats');
    combatStatsDiv.innerHTML = `
        <div class="combat-stat-box"><span class="attr-label">CA</span><span class="attr-val">${character.ac || 10}</span></div>
        <div class="combat-stat-box"><span class="attr-label">Desloc.</span><span class="attr-val">${character.speed || 9}m</span></div>
        <div class="combat-stat-box"><span class="attr-label">Percep. Pass.</span><span class="attr-val">${character.passivePerception || 10}</span></div>
    `;

    // 2. Atributos
    const attrGrid = document.getElementById('character-attributes');
    const attrMap = { str: 'FOR', dex: 'DES', con: 'CON', int: 'INT', wis: 'SAB', cha: 'CAR' };
    let attrHtml = '';
    
    for (const [key, label] of Object.entries(attrMap)) {
        const val = character.attributes ? character.attributes[key] || 0 : 0;
        const displayVal = val >= 0 ? `+${val}` : val;
        attrHtml += `<div class="attribute-box"><span class="attr-label">${label}</span><span class="attr-val">${displayVal}</span></div>`;
    }
    attrGrid.innerHTML = attrHtml;

    // 3. Recursos e Slots de Magia
    const resourcesDiv = document.getElementById('character-resources');
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

    // 4. Perícias
    const skillsDiv = document.getElementById('character-skills');
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
    updateCharacterPanels();
    characterMenu.style.display = 'block';

    const rect = characterMenu.getBoundingClientRect();
    const padding = 18;
    const left = Math.min(Math.max(x + 18, padding), window.innerWidth - rect.width - padding);
    const top = Math.min(Math.max(y - rect.height / 2, padding), window.innerHeight - rect.height - padding);

    characterMenu.style.left = `${left}px`;
    characterMenu.style.top = `${top}px`;
}

function closeCharacterMenu(e) {
    if (e) e.stopPropagation();
    characterMenu.style.display = 'none';
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

function setDrawMode(mode) {
    state.currentDrawMode = mode;
    
    // Remove a classe active de todos os botões
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    
    // Tenta encontrar o botão pelo ID. 
    // Certifique-se que no HTML o ID do botão de magia seja 'tool-spell_object'
    const activeBtn = document.getElementById(`tool-${mode}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
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

function applySpellObject(spellData) {
    if (!state.pendingSpellPoint) return;

    const newSpell = {
        type: 'spell_object',
        id: spellData.id,
        x: state.pendingSpellPoint.x,
        y: state.pendingSpellPoint.y,
        radius: spellData.radius || 100, // Usa o valor do JSON ou 100 como padrão
        opacity: spellData.opacity || 0.8,
        rotation: 0,
        rotateSpeed: spellData.rotateSpeed || 0,
        video: null
    };

    if (spellData.videoPath) {
      newSpell.video = createVideo(spellData.videoPath);
    }

    state.activeZones.push(newSpell); // Adiciona na lista de desenho
    state.pendingSpellPoint = null;   // Limpa o ponto temporário
}

function setEffect(item, e) {
    if (e) e.stopPropagation();
    
    // 1. Prepara o Elemento de Vídeo ou Imagem se existir no item do banco de dados
    if (item.videoPath && !item.videoElement) {
        item.videoElement = createVideo(item.videoPath);
    }
    if (item.imagePath && !item.imageElement) {
        item.imageElement = createImage(item.imagePath);
    }

    // 2. Lógica de Vagalumes (Partículas)
    const bb = getBoundingBox(state.lastCirclePath.length > 0 ? state.lastCirclePath : (state.editingZone ? state.editingZone.path : []));
    const particles = [];
    if (item.id === 'fireflies') {
        for (let i = 0; i < 35; i++) {
            particles.push({
                x: bb.minX + Math.random() * bb.width,
                y: bb.minY + Math.random() * bb.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 1.5 + 0.8,
                alpha: Math.random(),
                pulse: (Math.random() * 0.015) + 0.005
            });
        }
    }

    // 3. Monta o objeto com os dados do efeito
    const zoneData = {
        path: state.lastCirclePath.length > 0 ? [...state.lastCirclePath] : (state.editingZone ? state.editingZone.path : []),
        type: item.id,
        video: item.videoElement || null,
        image: item.imageElement || null,
        color: item.color || null, // AQUI: Captura a cor do item selecionado
        pattern: null,
        particles: particles
    };

    // 4. APLICA O EFEITO
    if (state.editingZone) {
        // Se estamos EDITANDO uma zona existente
        state.editingZone.type = zoneData.type;
        state.editingZone.video = zoneData.video;
        state.editingZone.image = zoneData.image;
        state.editingZone.color = zoneData.color; // AQUI: Transfere a cor para a zona editada
        state.editingZone.particles = zoneData.particles;
        state.editingZone.pattern = null;
        
        state.editingZone = null; // Só limpamos a edição DEPOIS de atribuir tudo
    } else if (state.lastCirclePath.length > 0) {
        // Se estamos CRIANDO uma zona nova a partir do pincel
        state.activeZones.push(zoneData);
    }

    closeMenu();
}

function deleteEffect(e) {
    if (e) e.stopPropagation();
    if (state.editingZone) {
        state.activeZones = state.activeZones.filter(z => z !== state.editingZone);
        state.editingZone = null;
    }
    closeMenu();
}

function clearArea() {
    state.activeZones = [];
    state.gesturePoints = [];
    state.pendingMenuPoint = null;
    closeMenu();
}

// TODO: REMOVER
function showMenu(x, y, isEditing = false) {
    // SÓ resetamos a pilha se o menu estiver FECHADO.
    // Se o menu já estiver aberto e você estiver navegando nas pastas, não mexemos na pilha.
    if (!state.menuOpen) {
        if (state.currentDrawMode === 'spell_object') {
            state.currentMenuStack = [spellDatabase];
        } else {
            state.currentMenuStack = [menuDatabase];
        }
    }

    renderEffectMenu();

    state.menu.style.display = 'block';
    const delBtn = document.getElementById('menu-delete-btn');
    if (delBtn) delBtn.style.display = isEditing ? 'block' : 'none';

    const rect = state.menu.getBoundingClientRect();
    const padding = 20;
    const marginFromShape = 40;

    let targetLeft = x;
    let targetTop = y;

    const activePath = state.editingZone ? state.editingZone.path : (state.lastCirclePath.length > 0 ? state.lastCirclePath : null);

    // Se for spell_object, ignoramos a lógica de Bounding Box para o menu não "pular" longe do clique
    if (activePath && state.currentDrawMode !== 'spell_object') {
        const bb = getBoundingBox(activePath);
        targetLeft = bb.maxX + marginFromShape;
        targetTop = bb.minY + (bb.height / 2) - (rect.height / 2);

        if (targetLeft + rect.width + padding > window.innerWidth) {
            targetLeft = bb.minX - rect.width - marginFromShape;
        }
        if (targetLeft < padding) {
            targetLeft = bb.minX + (bb.width / 2) - (rect.width / 2);
            targetTop = bb.maxY + marginFromShape;
        }
    }

    const finalLeft = Math.max(padding, Math.min(targetLeft, window.innerWidth - rect.width - padding));
    const finalTop = Math.max(padding, Math.min(targetTop, window.innerHeight - rect.height - padding));

    state.menu.style.left = `${finalLeft}px`;
    state.menu.style.top = `${finalTop}px`;
    state.menuOpen = true; // Agora essa variável é vital
}

// TODO: REMOVER
function closeMenu(e) {
    if (e) e.stopPropagation();
    state.menu.style.display = 'none';
    state.menuOpen = false;
    state.isDrawingCircle = false;
    state.isDrawingShape = false;
    state.gesturePoints = [];
    state.pendingMenuPoint = null;
    state.intersectionPoint = null;
    state.lastCirclePath = [];
    state.editingZone = null; // ← limpa a seleção ao fechar o menu
}

// TODO: REMOVER
export function renderEffectMenu() {
    // 1. VOLTAMOS PARA OS IDs ORIGINAIS QUE SEU CSS CONHECE
    const grid = document.getElementById('effect-menu-grid');
    const title = document.getElementById('effect-menu-title');
    const backBtn = document.getElementById('menu-back-btn');
    
    const currentFolder = state.currentMenuStack[state.currentMenuStack.length - 1];
    
    if (title) title.textContent = currentFolder.label;
    if (backBtn) backBtn.style.display = state.currentMenuStack.length > 1 ? 'block' : 'none';
    
    if (!grid) return; 
    grid.innerHTML = '';
    
    currentFolder.children.forEach(item => {
        // 2. VOLTAMOS A USAR <button> COMO NO SEU ORIGINAL
        const btn = document.createElement('button');
        btn.className = 'menu-item';
        
        // 3. VOLTAMOS COM AS CLASSES DENTRO DO SPAN
        btn.innerHTML = `
            <span class="menu-item-icon">${item.icon}</span>
            <span class="menu-item-label">${item.label}</span>
        `;
        
        if (item.type === 'folder') {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                state.currentMenuStack.push(item);
                renderEffectMenu();
            };
        } else {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (state.editingZone) {
                    updateExistingEffect(state.editingZone, item);
                } else if (state.currentDrawMode === 'spell_object') {
                    applySpellObject(item); 
                } else {
                    setEffect(item, e);
                }
                closeMenu(null); 
            };
        }
        grid.appendChild(btn);
    });
}

// TODO: REMOVER
function updateExistingEffect(zone, newItem) {
    // 1. Atualiza o ID e o tipo
    zone.id = newItem.id;
    
    // 2. Limpa o que tinha antes para não sobrepor
    zone.video = null;
    zone.image = null;
    zone.color = null;

    // 3. Aplica a nova cor se houver
    if (newItem.color) {
        zone.color = newItem.color;
    }

    // 4. Carrega o novo vídeo se houver
    if (newItem.videoPath) {
        const v = document.createElement('video');
        v.src = newItem.videoPath;
        v.muted = true;
        v.loop = true;
        v.play().catch(err => console.warn("Erro ao dar play no update:", err));
        zone.video = v;
    }

    // 5. Se for uma magia circular (spell_object), atualiza os parâmetros de rotação e raio
    if (zone.type === 'spell_object') {
        zone.rotateSpeed = newItem.rotateSpeed || 0;
        zone.opacity = newItem.opacity ?? 0.8;
        // Opcional: Descomente a linha abaixo se quiser que o raio mude para o padrão da nova magia
        // zone.radius = newItem.radius || zone.radius; 
    }
}

// TODO: REMOVER
function menuGoBack(e) {
    if (e) e.stopPropagation();
    if (state.currentMenuStack.length > 1) {
        state.currentMenuStack.pop(); // Sai da pasta (desempilha)
        renderEffectMenu();     // Refaz o menu
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


// Expondo funções para o escopo global (necessário no Vite/Módulos)
window.toggleSideMenu = toggleSideMenu;
window.setBackground = setBackground;
window.toggleGrid = toggleGrid;
window.setDrawMode = setDrawMode;
window.menuGoBack = menuGoBack;
window.closeMenu = closeMenu;
window.deleteEffect = deleteEffect;
window.clearArea = clearArea;
window.updateCharInitiative = updateCharInitiative;
window.adjustZoom = adjustZoom;
window.adjustTokenZoom = adjustTokenZoom;
window.closeCharacterMenu = closeCharacterMenu;

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
    CombatLogic.changeHP(state.selectedCharacter.id, amount * direction, updateCharacterPanels);
};

window.resetCombat = () => {
    CombatLogic.resetCombat(() => {
        renderInitiativeList();
    });
};