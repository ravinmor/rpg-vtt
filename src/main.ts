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
import { drawCharacter } from './engine/characterDrawer';

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

let editingZone = null;
let isResizing = false;
let resizeStartPoint = null;
let originalEditPath = null;
let gesturePoints = [];
let activeZones = [];
let isDrawingCircle = false;
let menuOpen = false;
let lastCirclePath = [];
let intersectionPoint = null;
let pendingMenuPoint = null;
let currentBackground = backgroundSelect ? backgroundSelect.value : 'none';
let selectedCharacter = null;
let originalSpellCenter = { x: 0, y: 0 };
let isDraggingToken = false;
let tokenDragStart = null;
let tokenHasMoved = false;
let concentrationPulse = 0;
let isDraggingCharacterMenu = false;
let characterMenuDragOffset = { x: 0, y: 0 };
let pendingSpellPoint = null;
let currentDrawMode = 'brush';
let isDrawingShape = false;
let shapeStart = null;
let shapeEnd = null;
let isDraggingZone = false;
let zoneDragStartPoint = null;
let isDraggingEffectMenu = false;
let effectMenuDragOffset = { x: 0, y: 0 };
let gridScale = 1.0; 
let showGrid = false;
let tokenScale = 1.0;
let longPressTimer;
let mouseDownTarget = null; // 'character', 'zone', 'canvas'
let mouseDownPoint = null;

// Controla em qual pasta estamos
let currentMenuStack = [menuDatabase];

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
    currentBackground = type;
}

function toggleGrid() {
    showGrid = !showGrid;
    document.getElementById('btn-grid').classList.toggle('active', showGrid);
}

function adjustZoom(delta) {
    if (delta === -1) gridScale = 1.0; // Reset
    else gridScale = Math.max(0.2, gridScale + delta); // Limite mínimo para não travar
}

function openEffectMenu(x, y, isSpellObject = false) {
    const database = isSpellObject ? spellDatabase : menuDatabase;
    renderMenu(database); // Sua função que constrói o HTML do menu
    showMenu(x, y); // Sua função que posiciona o menu na tela
}

function adjustTokenZoom(delta) {
    if (delta === -1) {
        tokenScale = 1.0; // Reset para o tamanho original (radius: 30)
    } else if (delta === 2) {
        tokenScale = 2.0; // Atalho para criaturas grandes
    } else {
        tokenScale = Math.min(Math.max(0.5, tokenScale + delta), 4.0); // Limite entre 0.5x e 4x
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
        if (Math.hypot(x - character.x, y - character.y) <= (character.radius * tokenScale)) {
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
    if (!selectedCharacter) {
        renderSideCharacterStatuses(null);
        return;
    }

    const currentCharacter = characters.find((item) => item.id === selectedCharacter.id);
    if (!currentCharacter) return;

    selectedCharacter = currentCharacter;
    updateCharacterMenu(currentCharacter);
    renderSideCharacterStatuses(currentCharacter);
}

function openCharacterMenu(character, x, y) {
    selectedCharacter = character;
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

function applyCharacterHp(direction) {
    if (!selectedCharacter) return;
    const amount = Math.max(0, Number(characterHpInput.value) || 0);
    changeHP(selectedCharacter.id, amount * direction);
}

function startCharacterMenuDrag(e) {
    if (e.target.closest('button, input')) return;

    const rect = characterMenuShell.getBoundingClientRect();
    const isTopEdge = e.clientY - rect.top <= 26;
    const isHeaderArea = !!e.target.closest('#character-menu-header');

    if (!isTopEdge && !isHeaderArea) return;

    isDraggingCharacterMenu = true;
    characterMenuDragOffset = {
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

    isDraggingEffectMenu = true;
    effectMenuDragOffset = {
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

function setDrawMode(mode) {
    currentDrawMode = mode;
    
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

window.addEventListener('resize', resize);
resize();

// window.addEventListener('dblclick', (e) => {
//     const coords = getMapCoords(e);
//     let clickedZone = null;

//     // Procura de trás pra frente (pega o que está por cima)
//     for (let i = activeZones.length - 1; i >= 0; i--) {
//         const zone = activeZones[i];
        
//         // 1. CHECAGEM PARA MAGIAS CIRCULARES
//         if (zone.type === 'spell_object') {
//             const distance = Math.hypot(coords.x - zone.x, coords.y - zone.y);
//             if (distance <= zone.radius) {
//                 clickedZone = zone;
//                 break;
//             }
//         } 
//         // 2. CHECAGEM ANTIGA PARA ÁREAS DE PINCEL (Mantenha a sua lógica aqui)
//         else if (zone.path && zone.path.length > 0) {
//             // ... sua lógica original do isPointInPath do Canvas
//             ctx.beginPath();
//             ctx.moveTo(zone.path[0].x, zone.path[0].y);
//             zone.path.forEach(p => ctx.lineTo(p.x, p.y));
//             if (ctx.isPointInPath(coords.x, coords.y)) {
//                 clickedZone = zone;
//                 break;
//             }
//         }
//     }

//     if (clickedZone) {
//         editingZone = clickedZone;
//         // Identifica qual menu abrir baseado no tipo
//         currentMenuStack = clickedZone.type === 'spell_object' ? [spellDatabase] : [menuDatabase];
//         renderEffectMenu();
//         showMenu(e.clientX, e.clientY, true); // true = Modo Edição (mostra botão lixeira)
//     }
// });

window.addEventListener('mousedown', (e) => {
    if (sideMenu.contains(e.target) || characterMenu.contains(e.target) || menu.contains(e.target)) return;

    const coords = getMapCoords(e);
    const mouseX = coords.x;
    const mouseY = coords.y;

    // --- EDIÇÃO DE ZONA EXISTENTE (alças e arraste) ---
    if (editingZone) {
        if (editingZone.type === 'spell_object') {
            const handleX = editingZone.x + editingZone.radius;
            const handleY = editingZone.y;
            if (Math.hypot(mouseX - handleX, mouseY - handleY) < 15) {
                isResizing = true;
                resizeStartPoint = { x: mouseX, y: mouseY };
                menu.style.display = 'none';
                return;
            }
            if (Math.hypot(mouseX - editingZone.x, mouseY - editingZone.y) <= editingZone.radius) {
                isDraggingZone = true;
                zoneDragStartPoint = { x: mouseX, y: mouseY };
                // SALVA A POSIÇÃO ORIGINAL AQUI
                originalSpellCenter = { x: editingZone.x, y: editingZone.y }; 
                menu.style.display = 'none';
                return;
            }
        } else if (editingZone.path) {
            const bb = getBoundingBox(editingZone.path);
            const handles = [
                {x: bb.minX, y: bb.minY}, {x: bb.maxX, y: bb.minY},
                {x: bb.maxX, y: bb.maxY}, {x: bb.minX, y: bb.maxY}
            ];
            for (let i = 0; i < 4; i++) {
                if (Math.hypot(mouseX - handles[i].x, mouseY - handles[i].y) < 15) {
                    isResizing = true;
                    resizeStartPoint = {x: mouseX, y: mouseY};
                    originalEditPath = JSON.parse(JSON.stringify(editingZone.path));
                    menu.style.display = 'none';
                    return;
                }
            }
            if (isPointInPolygon({x: mouseX, y: mouseY}, editingZone.path)) {
                isDraggingZone = true;
                zoneDragStartPoint = { x: mouseX, y: mouseY };
                originalEditPath = JSON.parse(JSON.stringify(editingZone.path));
                menu.style.display = 'none';
                return;
            }
        }
        // Clicou fora da zona em edição: desseleciona
        editingZone = null;
    }

    if (menuOpen) {
        closeMenu();
        editingZone = null;
        return;
    }

    // --- IDENTIFICA O QUE FOI CLICADO (guardado para o mouseup decidir) ---
    mouseDownPoint = { x: mouseX, y: mouseY };

    const clickedCharacter = getCharacterAtPosition(mouseX, mouseY);
    if (clickedCharacter) {
        selectedCharacter = clickedCharacter;
        updateCharacterPanels();
        isDraggingToken = true;
        tokenDragStart = { x: mouseX, y: mouseY };
        tokenHasMoved = false;
        mouseDownTarget = 'character';
        closeCharacterMenu();
        return;
    }

    // Verifica se clicou em zona existente (para abrir menu de edição no mouseup)
    let clickedZone = null;
    for (let i = activeZones.length - 1; i >= 0; i--) {
        const zone = activeZones[i];
        if (zone.type === 'spell_object') {
            if (Math.hypot(mouseX - zone.x, mouseY - zone.y) <= zone.radius) {
                clickedZone = zone;
                break;
            }
        } else if (zone.path && zone.path.length > 0) {
            ctx.beginPath();
            ctx.moveTo(zone.path[0].x, zone.path[0].y);
            zone.path.forEach(p => ctx.lineTo(p.x, p.y));
            if (ctx.isPointInPath(mouseX, mouseY)) {
                clickedZone = zone;
                break;
            }
        }
    }

    if (clickedZone) {
        mouseDownTarget = 'zone';
        // Não abrimos nada ainda — esperamos o mouseup confirmar que não houve arraste
        return;
    }

    // Clicou no canvas vazio
    mouseDownTarget = 'canvas';
    closeCharacterMenu();
    selectedCharacter = null;
    renderSideCharacterStatuses(null);

    // Modo pincel/formas
    if (currentDrawMode === 'spell_object') {
        pendingSpellPoint = { x: mouseX, y: mouseY };
        return; // Menu abre no mouseup
    }

    if (currentDrawMode !== 'brush') {
        isDrawingShape = true;
        shapeStart = { x: mouseX, y: mouseY };
        shapeEnd = { x: mouseX, y: mouseY };
        return;
    }

    isDrawingCircle = true;
    gesturePoints = [{ x: mouseX, y: mouseY }];
    intersectionPoint = null;
    pendingMenuPoint = null;
});

window.addEventListener('mousemove', (e) => {
    // Arrastar Menu de Personagem
    if (isDraggingCharacterMenu) {
        const padding = 12;
        const left = Math.min(Math.max(e.clientX - characterMenuDragOffset.x, padding), window.innerWidth - characterMenuShell.offsetWidth - padding);
        const top = Math.min(Math.max(e.clientY - characterMenuDragOffset.y, padding), window.innerHeight - characterMenuShell.offsetHeight - padding);
        characterMenu.style.left = `${left}px`;
        characterMenu.style.top = `${top}px`;
        return;
    }

    // Arrastar Menu de Efeitos
    if (isDraggingEffectMenu) {
        const padding = 12;
        const shell = document.querySelector('.effect-menu-shell');
        const left = Math.min(Math.max(e.clientX - effectMenuDragOffset.x, padding), window.innerWidth - shell.offsetWidth - padding);
        const top = Math.min(Math.max(e.clientY - effectMenuDragOffset.y, padding), window.innerHeight - shell.offsetHeight - padding);
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
        return;
    }

    const coords = getMapCoords(e);
    const mouseX = coords.x;
    const mouseY = coords.y;

    // Mover Personagem
    if (isDraggingToken && selectedCharacter) {
        if (tokenDragStart && Math.hypot(mouseX - tokenDragStart.x, mouseY - tokenDragStart.y) > 4) { 
            tokenHasMoved = true;
        }
        if (!tokenHasMoved) return;
        selectedCharacter.x = mouseX;
        selectedCharacter.y = mouseY;
        return;
    }

    // Redimensionar Zona em Edição (Aumentar/Diminuir)
    if (isResizing && editingZone) {
        if (editingZone.type === 'spell_object') {
            // A distância entre o mouse e o centro da magia vira o novo raio (tamanho)
            const newRadius = Math.hypot(mouseX - editingZone.x, mouseY - editingZone.y);
            editingZone.radius = Math.max(20, newRadius); // Impede que fique menor que 20px
        } 
        else if (editingZone.path) {
            const bb = getBoundingBox(originalEditPath);
            const center = { x: bb.minX + bb.width / 2, y: bb.minY + bb.height / 2 };
            
            const oldDist = Math.hypot(resizeStartPoint.x - center.x, resizeStartPoint.y - center.y);
            const newDist = Math.max(10, Math.hypot(mouseX - center.x, mouseY - center.y));
            const scale = newDist / oldDist;

            editingZone.path = originalEditPath.map(p => ({
                x: center.x + (p.x - center.x) * scale,
                y: center.y + (p.y - center.y) * scale
            }));
        }
        return; // Retorna para não desenhar o pincel por acidente
    }

    // Arrastar Zona em Edição (Mover de lugar)
    if (isDraggingZone && editingZone) {
        const dx = mouseX - zoneDragStartPoint.x;  
        const dy = mouseY - zoneDragStartPoint.y;

        if (editingZone.type === 'spell_object') {
          // Move o centro da magia em relação ao local original
          editingZone.x = originalSpellCenter.x + dx;
          editingZone.y = originalSpellCenter.y + dy;
        } 
        else if (editingZone.path) {
            // Move a área original
            editingZone.path = originalEditPath.map(p => ({
                x: p.x + dx,
                y: p.y + dy
            }));
        }
        return; // Retorna para não desenhar o pincel por acidente
    }

    // Preview de Formas Geométricas
    if (isDrawingShape) {
        shapeEnd = { x: mouseX, y: mouseY };
        return;
    }

    // Lógica do Pincel
    if (!isDrawingCircle || menuOpen) return;
    const point = { x: mouseX, y: mouseY };
    
    if (gesturePoints.length > 40) {
        const segA = { p1: gesturePoints[gesturePoints.length - 1], p2: point };
        const skipCount = Math.max(20, Math.floor(gesturePoints.length * 0.25));

        for (let i = 0; i < gesturePoints.length - skipCount; i++) {
            const segB = { p1: gesturePoints[i], p2: gesturePoints[i + 1] };
            const intersect = checkIntersection(segA, segB);
            if (intersect) {
                lastCirclePath = gesturePoints.slice(i);
                intersectionPoint = intersect;
                pendingMenuPoint = intersect;
                return;
            }
        }
    }
    gesturePoints.push(point);
});

window.addEventListener('mouseup', (e) => {
    if (isDraggingEffectMenu || isDraggingCharacterMenu) {
        isDraggingEffectMenu = false;
        isDraggingCharacterMenu = false;
        return;
    }

    if (e.target.closest('.effect-menu-shell') || e.target.closest('#side-menu')) return;

    // Redimensionamento e arraste de zonas existentes
    if (isResizing || isDraggingZone) {
        isResizing = false;
        isDraggingZone = false;
        if (editingZone && editingZone.type === 'spell_object') {
            currentMenuStack = [spellDatabase];
        } else {
            currentMenuStack = [menuDatabase];
        }
        renderEffectMenu();
        showMenu(e.clientX, e.clientY, true);
        return;
    }

    // --- TOKEN: só abre menu de personagem se NÃO houve arraste ---
    if (isDraggingToken) {
        isDraggingToken = false;
        if (!tokenHasMoved && selectedCharacter) {
            openCharacterMenu(selectedCharacter, e.clientX, e.clientY);
        }
        tokenDragStart = null;
        tokenHasMoved = false;
        return;
    }

    const coords = getMapCoords(e);
    const mouseX = coords.x;
    const mouseY = coords.y;

    // --- ZONA EXISTENTE: só abre menu de edição se NÃO houve movimento ---
    if (mouseDownTarget === 'zone' && mouseDownPoint) {
        const moved = Math.hypot(mouseX - mouseDownPoint.x, mouseY - mouseDownPoint.y);
        if (moved < 5) {
            // Confirma qual zona está sob o cursor
            for (let i = activeZones.length - 1; i >= 0; i--) {
                const zone = activeZones[i];
                let hit = false;
                if (zone.type === 'spell_object') {
                    hit = Math.hypot(mouseX - zone.x, mouseY - zone.y) <= zone.radius;
                } else if (zone.path && zone.path.length > 0) {
                    ctx.beginPath();
                    ctx.moveTo(zone.path[0].x, zone.path[0].y);
                    zone.path.forEach(p => ctx.lineTo(p.x, p.y));
                    hit = ctx.isPointInPath(mouseX, mouseY);
                }
                if (hit) {
                    editingZone = zone;
                    currentMenuStack = zone.type === 'spell_object' ? [spellDatabase] : [menuDatabase];
                    renderEffectMenu();
                    showMenu(e.clientX, e.clientY, true);
                    break;
                }
            }
        }
        mouseDownTarget = null;
        mouseDownPoint = null;
        return;
    }

    // --- CANVAS VAZIO: modo spell_object abre menu de criação ---
    if (mouseDownTarget === 'canvas' && currentDrawMode === 'spell_object') {
        currentMenuStack = [spellDatabase];
        renderEffectMenu();
        showMenu(e.clientX, e.clientY, false);
        mouseDownTarget = null;
        mouseDownPoint = null;
        return;
    }

    // --- FORMAS GEOMÉTRICAS ---
    if (isDrawingShape) {
        isDrawingShape = false;
        if (shapeStart && shapeEnd && Math.hypot(shapeEnd.x - shapeStart.x, shapeEnd.y - shapeStart.y) > 20) {
            lastCirclePath = generateShapePath(currentDrawMode, shapeStart, shapeEnd);
            currentMenuStack = [menuDatabase];
            renderEffectMenu();
            showMenu(horizPos(e), e.clientY, false);
        }
        mouseDownTarget = null;
        mouseDownPoint = null;
        return;
    }

    // --- PINCEL LIVRE ---
    if (!menuOpen && isDrawingCircle) {
        if (pendingMenuPoint) {
            currentMenuStack = [menuDatabase];
            renderEffectMenu();
            showMenu(e.clientX, e.clientY, false);
        } else {
            isDrawingCircle = false;
            gesturePoints = [];
            intersectionPoint = null;
            lastCirclePath = [];
        }
    }

    mouseDownTarget = null;
    mouseDownPoint = null;
});

// Função auxiliar para posição horizontal (centraliza o menu na forma)
function horizPos(e) { return e.clientX; }

function applySpellObject(spellData) {
    if (!pendingSpellPoint) return;

    const newSpell = {
        type: 'spell_object',
        id: spellData.id,
        x: pendingSpellPoint.x,
        y: pendingSpellPoint.y,
        radius: spellData.radius || 100, // Usa o valor do JSON ou 100 como padrão
        opacity: spellData.opacity || 0.8,
        rotation: 0,
        rotateSpeed: spellData.rotateSpeed || 0,
        video: null
    };

    if (spellData.videoPath) {
      newSpell.video = createVideo(spellData.videoPath);
    }

    activeZones.push(newSpell); // Adiciona na lista de desenho
    pendingSpellPoint = null;   // Limpa o ponto temporário
}

function renderMenu(database) {
    const container = document.getElementById('menu-content-area');
    const label = document.getElementById('menu-label');
    if (!container || !database) return;

    // Atualiza o título do menu
    label.innerText = database.label;
    
    // Limpa o conteúdo atual
    container.innerHTML = '';

    database.children.forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'menu-item'; // Use a classe que você já tem no CSS
        
        // Se for uma pasta
        if (item.type === 'folder') {
            btn.innerHTML = `<span>${item.icon}</span><label>${item.label}</label>`;
            btn.onclick = () => renderMenu(item); // Navegação: entra na pasta
        } 
        // Se for um efeito ou magia
        else {
            btn.innerHTML = `<span>${item.icon}</span><label>${item.label}</label>`;
            btn.onclick = () => {
                if (currentDrawMode === 'spell_object') {
                    // Função que criaremos para colocar a magia no mapa
                    applySpellObject(item); 
                } else {
                    // Função antiga para aplicar efeito na área desenhada
                    applyEffectToZone(item.id); 
                }
                closeMenu();
            };
        }
        container.appendChild(btn);
    });

    // Se não for o menu raiz, adiciona um botão de "Voltar"
    if (database !== menuDatabase && database !== spellDatabase) {
        const backBtn = document.createElement('div');
        backBtn.className = 'menu-item back-btn';
        backBtn.innerHTML = `<span>⬅</span><label>Voltar</label>`;
        backBtn.onclick = () => {
            // Aqui você decide para qual raiz voltar baseado no modo atual
            renderMenu(currentDrawMode === 'spell_object' ? spellDatabase : menuDatabase);
        };
        container.prepend(backBtn);
    }
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
    const bb = getBoundingBox(lastCirclePath.length > 0 ? lastCirclePath : (editingZone ? editingZone.path : []));
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
        path: lastCirclePath.length > 0 ? [...lastCirclePath] : (editingZone ? editingZone.path : []),
        type: item.id,
        video: item.videoElement || null,
        image: item.imageElement || null,
        color: item.color || null, // AQUI: Captura a cor do item selecionado
        pattern: null,
        particles: particles
    };

    // 4. APLICA O EFEITO
    if (editingZone) {
        // Se estamos EDITANDO uma zona existente
        editingZone.type = zoneData.type;
        editingZone.video = zoneData.video;
        editingZone.image = zoneData.image;
        editingZone.color = zoneData.color; // AQUI: Transfere a cor para a zona editada
        editingZone.particles = zoneData.particles;
        editingZone.pattern = null;
        
        editingZone = null; // Só limpamos a edição DEPOIS de atribuir tudo
    } else if (lastCirclePath.length > 0) {
        // Se estamos CRIANDO uma zona nova a partir do pincel
        activeZones.push(zoneData);
    }

    closeMenu();
}

function deleteEffect(e) {
    if (e) e.stopPropagation();
    if (editingZone) {
        activeZones = activeZones.filter(z => z !== editingZone);
        editingZone = null;
    }
    closeMenu();
}

function clearArea() {
    activeZones = [];
    gesturePoints = [];
    pendingMenuPoint = null;
    closeMenu();
}

// TODO: REMOVER
function showMenu(x, y, isEditing = false) {
    // SÓ resetamos a pilha se o menu estiver FECHADO.
    // Se o menu já estiver aberto e você estiver navegando nas pastas, não mexemos na pilha.
    if (!menuOpen) {
        if (currentDrawMode === 'spell_object') {
            currentMenuStack = [spellDatabase];
        } else {
            currentMenuStack = [menuDatabase];
        }
    }

    renderEffectMenu();

    menu.style.display = 'block';
    const delBtn = document.getElementById('menu-delete-btn');
    if (delBtn) delBtn.style.display = isEditing ? 'block' : 'none';

    const rect = menu.getBoundingClientRect();
    const padding = 20;
    const marginFromShape = 40;

    let targetLeft = x;
    let targetTop = y;

    const activePath = editingZone ? editingZone.path : (lastCirclePath.length > 0 ? lastCirclePath : null);

    // Se for spell_object, ignoramos a lógica de Bounding Box para o menu não "pular" longe do clique
    if (activePath && currentDrawMode !== 'spell_object') {
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

    menu.style.left = `${finalLeft}px`;
    menu.style.top = `${finalTop}px`;
    menuOpen = true; // Agora essa variável é vital
}

// TODO: REMOVER
function closeMenu(e) {
    if (e) e.stopPropagation();
    menu.style.display = 'none';
    menuOpen = false;
    isDrawingCircle = false;
    isDrawingShape = false;
    gesturePoints = [];
    pendingMenuPoint = null;
    intersectionPoint = null;
    lastCirclePath = [];
    editingZone = null; // ← limpa a seleção ao fechar o menu
}

// TODO: REMOVER
function renderEffectMenu() {
    const grid = document.getElementById('effect-menu-grid');
    const title = document.getElementById('effect-menu-title');
    const backBtn = document.getElementById('menu-back-btn');
    
    const currentFolder = currentMenuStack[currentMenuStack.length - 1];
    
    title.textContent = currentFolder.label;
    backBtn.style.display = currentMenuStack.length > 1 ? 'block' : 'none';
    
    grid.innerHTML = '';
    
    currentFolder.children.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'menu-item';
        
        btn.innerHTML = `
            <span class="menu-item-icon">${item.icon}</span>
            <span class="menu-item-label">${item.label}</span>
        `;
        
        if (item.type === 'folder') {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentMenuStack.push(item);
                renderEffectMenu();
            };
        } 
        else {
            btn.onclick = (e) => {
                e.stopPropagation();
                
                // --- LÓGICA DE EDIÇÃO VS CRIAÇÃO ---
                if (editingZone) {
                    // Se existe algo selecionado, apenas trocamos o efeito visual
                    updateExistingEffect(editingZone, item);
                } 
                else if (currentDrawMode === 'spell_object') {
                    // Se não há edição, mas o modo é 'magia', cria o objeto circular
                    applySpellObject(item); 
                } 
                else {
                    // Se for modo pincel/formas, usa a lógica de área de desenho
                    setEffect(item, e);
                }
                
                closeMenu(); 
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
    if (currentMenuStack.length > 1) {
        currentMenuStack.pop(); // Sai da pasta (desempilha)
        renderEffectMenu();     // Refaz o menu
    }
}

function drawStatusIcons(character, currentRadius) {
    // Se o personagem não tiver status ou a lista estiver vazia, encerra a função
    if (!character.statuses || character.statuses.length === 0) return;

    // 1. Definição de tamanhos baseados no zoom (tokenScale)
    const iconSize = 38 * tokenScale; 
    const gap = 6 * tokenScale;
    
    // 2. Posicionamento: Inicia à direita do anel de vida
    // O startX coloca os ícones fora do círculo do personagem
    let startX = character.x + currentRadius + (15 * tokenScale);
    
    // Centraliza a primeira linha de ícones na altura do meio do personagem
    let startY = character.y - (iconSize / 2);

    character.statuses.forEach((status, index) => {
        try {
            const iconImg = statusIcons[status]; 
            
            // --- PROTEÇÃO VITE/CANVAS: Verifica se a imagem existe e se já carregou ---
            if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
                
                // Cálculo de grade: 3 ícones por coluna vertical
                const col = Math.floor(index / 3); 
                const row = index % 3;

                const x = startX + col * (iconSize + gap);
                const y = startY + row * (iconSize + gap);

                ctx.save();
                
                // 3. Efeito de Sombra e Fundo (Para o ícone não sumir em fundos claros/escuros)
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'black';
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Círculo preto transparente ao fundo
                
                ctx.beginPath();
                ctx.arc(x + iconSize/2, y + iconSize/2, iconSize/1.8, 0, Math.PI * 2);
                ctx.fill();
                
                // 4. Desenho do ícone propriamente dito
                ctx.drawImage(iconImg, x, y, iconSize, iconSize);
                
                ctx.restore();
            }
        } catch (error) {
            // Se um ícone der erro, esse catch impede que o mapa inteiro pare de desenhar
            console.warn(`Não foi possível desenhar o status: ${status}`, error);
        }
    });
}

function animate() {
    concentrationPulse += 0.08;
    
    // Fundo (Camada mais baixa)
    Renderer.drawBackground(ctx, canvas, backgroundAssets, currentBackground);

    // 1. DESENHA AS ZONAS DE EFEITO
    activeZones.forEach((zone) => {
        ctx.save();

        // --- LÓGICA PARA MAGIAS CIRCULARES (Novo Botão) ---
        if (zone.type === 'spell_object') {
            ctx.globalAlpha = 1;
            
            // Aplica a rotação se houver velocidade definida
            if (zone.rotateSpeed) {
                zone.rotation = (zone.rotation || 0) + zone.rotateSpeed;
            }

            ctx.translate(zone.x, zone.y);
            ctx.rotate(zone.rotation || 0);

            ctx.beginPath();
            ctx.arc(0, 0, zone.radius, 0, Math.PI * 2);
            
            ctx.clip(); // Garante que o vídeo fique dentro do círculo

            if (zone.video) {
                ctx.globalAlpha = zone.opacity !== undefined ? zone.opacity : 0.8;
                // Truque do fundo preto invisível
                ctx.globalCompositeOperation = 'screen'; 
                
                // --- NOVA LÓGICA DE PROPORÇÃO (Impede que fique oval) ---
                // Descobre a proporção real do vídeo (largura / altura)
                const vRatio = zone.video.videoWidth / zone.video.videoHeight;
                
                let drawWidth = zone.radius * 2;
                let drawHeight = zone.radius * 2;
                let offsetX = -zone.radius;
                let offsetY = -zone.radius;

                // Se o vídeo for mais largo (paisagem) ou mais alto (retrato), ajustamos o tamanho
                // e centralizamos para não achatar a imagem
                if (vRatio > 1) { 
                    drawWidth = drawHeight * vRatio;
                    offsetX = -(drawWidth / 2);
                } else if (vRatio < 1) { 
                    drawHeight = drawWidth / vRatio;
                    offsetY = -(drawHeight / 2);
                }

                ctx.drawImage(zone.video, offsetX, offsetY, drawWidth, drawHeight);
                // --------------------------------------------------------

                ctx.globalCompositeOperation = 'source-over'; 
            }
            ctx.restore();

            // Desenha indicador de seleção se estiver editando a magia
            if (editingZone === zone) {
                ctx.beginPath();
                ctx.setLineDash([6, 6]);
                ctx.strokeStyle = '#f0b030';
                ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
                
                // DESENHA A ALÇA DE REDIMENSIONAMENTO NA DIREITA
                ctx.fillStyle = '#1e1306';
                ctx.strokeStyle = '#f0b030';
                const handleX = zone.x + zone.radius;
                const handleY = zone.y;
                ctx.fillRect(handleX - 5, handleY - 5, 10, 10);
                ctx.strokeRect(handleX - 5, handleY - 5, 10, 10);
            }
        } 
        
        // --- LÓGICA PARA ÁREAS DESENHADAS (Pincel/Formas) ---
        else if (zone.path && zone.path.length > 0) {
            ctx.beginPath();
            ctx.moveTo(zone.path[0].x, zone.path[0].y);
            zone.path.forEach((point) => ctx.lineTo(point.x, point.y));
            ctx.closePath();
            ctx.clip();

            if (zone.video) {
                if (zone.type === 'fog') ctx.globalAlpha = 0.6;
                else if (zone.type === 'darkness') ctx.globalAlpha = 0.98;
                else ctx.globalAlpha = 1;

                if (zone.type.startsWith('terrain_')) {
                    const pattern = ctx.createPattern(zone.video, 'repeat');
                    if (pattern) {
                        ctx.fillStyle = pattern;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                } else {
                    ctx.drawImage(zone.video, 0, 0, canvas.width, canvas.height);
                }
            } 
            else if (zone.image) {
                if (zone.image.complete && zone.image.naturalWidth > 0) {
                    if (!zone.pattern) zone.pattern = ctx.createPattern(zone.image, 'repeat');
                    if (zone.pattern) {
                        ctx.fillStyle = zone.pattern;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                }
            }
            else if (zone.color) {
                // Se o item do banco de dados tiver uma cor definida
                ctx.fillStyle = zone.color;
                ctx.fill();
            }
            // Efeito de vagalumes para áreas desenhadas
            else if (zone.type === 'fireflies' && zone.particles) {
                ctx.fillStyle = 'rgba(15, 25, 10, 0.4)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                const bb = getBoundingBox(zone.path);
                zone.particles.forEach(p => {
                    p.x += p.vx; p.y += p.vy;
                    p.alpha += p.pulse;
                    if (p.alpha > 1 || p.alpha < 0.1) p.pulse *= -1;
                    if (p.x < bb.minX) p.x = bb.maxX;
                    if (p.x > bb.maxX) p.x = bb.minX;
                    if (p.y < bb.minY) p.y = bb.maxY;
                    if (p.y > bb.maxY) p.y = bb.minY;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(210, 255, 100, ${Math.max(0, p.alpha)})`;
                    ctx.fill();
                });
            }
            ctx.restore();

            // Borda da área desenhada
            ctx.beginPath();
            ctx.moveTo(zone.path[0].x, zone.path[0].y);
            zone.path.forEach((point) => ctx.lineTo(point.x, point.y));
            ctx.closePath();
            ctx.lineWidth = 1; 
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'; 
            ctx.stroke();

            // Bounding box de edição apenas para áreas desenhadas
            if (editingZone === zone) {
                const bb = getBoundingBox(zone.path);
                const handleSize = 10;
                ctx.beginPath();
                ctx.setLineDash([6, 6]);
                ctx.strokeStyle = 'rgba(240, 176, 48, 0.9)';
                ctx.rect(bb.minX, bb.minY, bb.width, bb.height);
                ctx.stroke();
                ctx.setLineDash([]);
                // (Aqui você desenharia as alças se necessário)
            }
        }
    });

    // 2. DESENHAR GRID
    if (showGrid) {
      Renderer.drawGrid(ctx, canvas, BASE_GRID_SIZE, gridScale);
    }

    // 3. DESENHA O HOLOFOTE (SPOTLIGHT)
    characters.forEach(char => {
        if (char.isTurn) {
            const pulse = Math.sin(concentrationPulse) * 8; 
            const currentRadius = char.radius * tokenScale; // Usa a escala global de tokens
            
            ctx.save();
            const gradient = ctx.createRadialGradient(
                char.x, char.y, currentRadius * 0.2,
                char.x, char.y, currentRadius + 50 + pulse 
            );
            
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)'); 
            gradient.addColorStop(0.3, 'rgba(240, 176, 48, 0.4)'); 
            gradient.addColorStop(1, 'rgba(240, 176, 48, 0)');    

            ctx.fillStyle = gradient;
            ctx.shadowBlur = 25 + pulse;
            ctx.shadowColor = 'rgba(240, 176, 48, 0.5)';
            
            ctx.beginPath();
            // Agora usando o currentRadius corretamente para o brilho acompanhar o tamanho do boneco
            ctx.arc(char.x, char.y, currentRadius + 40 + pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });

    // 4. DESENHA OS PERSONAGENS
    characters.forEach(char => {
        drawCharacter(ctx, char, tokenScale, selectedCharacter, statusIcons);
    });

    // 5. DESENHA INTERFACE DE GESTOS E PREVIEWS
    if (isDrawingShape && shapeStart && shapeEnd) {
        const previewPath = generateShapePath(currentDrawMode, shapeStart, shapeEnd);
        ctx.beginPath();
        ctx.moveTo(previewPath[0].x, previewPath[0].y);
        previewPath.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    if (gesturePoints.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = menuOpen ? 'rgba(255, 255, 255, 0.2)' : 'white';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.moveTo(gesturePoints[0].x, gesturePoints[0].y);
        gesturePoints.forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.stroke();
    }

    if (intersectionPoint && !menuOpen) {
        ctx.beginPath();
        ctx.arc(intersectionPoint.x, intersectionPoint.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'red';
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    if (menuOpen && !editingZone && lastCirclePath.length > 0) {
        ctx.beginPath();
        ctx.moveTo(lastCirclePath[0].x, lastCirclePath[0].y);
        lastCirclePath.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.setLineDash([4, 4]); 
        ctx.stroke();
        ctx.setLineDash([]);
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
    if (!selectedCharacter) return;
    const amount = Math.max(0, Number(characterHpInput.value) || 0);
    CombatLogic.changeHP(selectedCharacter.id, amount * direction, updateCharacterPanels);
};

window.resetCombat = () => {
    CombatLogic.resetCombat(() => {
        renderInitiativeList();
    });
};