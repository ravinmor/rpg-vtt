import { loadScenarioPagesStore, saveScenarioPagesStore } from '../repositories/scenarioPagesRepository';
import { snapshotStageState, restoreStageState } from '../repositories/stageRepository';
import { snapshotEntitiesState, restoreEntitiesState } from '../repositories/entitiesRepository';
import { snapshotSessionState, restoreSessionState } from '../repositories/sessionStateRepository';
import type { ScenarioPage, ScenarioPagesStore } from '../types/scenarioPage';
import { state } from '../state/globalState';
import { renderLayersList } from '../ui/layersPanel';
import { renderInitiativeList } from '../ui/combatPanel';
import { closeCharacterMenu, updateCharacterPanels } from '../ui/characterSheet';
import { gizmo } from '../engine/transformGizmo';

const MAX_PAGES = 5;

let scenarioPagesStore: ScenarioPagesStore = {
    activePageId: null,
    pages: [],
};
let isApplyingScenarioPage = false;

function clonePage<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

function getPagesContainer() {
    return document.getElementById('scenario-pages-list');
}

function createPageSnapshot(page: ScenarioPage): ScenarioPage {
    return {
        ...page,
        updatedAt: new Date().toISOString(),
        stage:    snapshotStageState(),
        entities: snapshotEntitiesState(),
        session:  snapshotSessionState(),
    };
}

function createEmptyScenarioPage(name: string): ScenarioPage {
    const timestamp = Date.now();
    return {
        id:        `page_${timestamp}_${Math.floor(Math.random() * 100000)}`,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stage:    { zones: [] },
        entities: { characterPlacements: [], npcs: [] },
        session:  snapshotSessionState(),
    };
}

function applyScenarioPage(page: ScenarioPage) {
    isApplyingScenarioPage = true;

    state.selectedCharacter  = null;
    state.editingZone        = null;
    state.menuOpen           = false;
    state.pendingMenuPoint   = null;
    state.pendingSpellPoint  = null;
    state.lastCirclePath     = [];
    closeCharacterMenu();
    gizmo.detach();

    restoreStageState(page.stage);
    restoreEntitiesState(page.entities);
    restoreSessionState(page.session);

    renderLayersList();
    renderInitiativeList();
    updateCharacterPanels();
    isApplyingScenarioPage = false;
}

function getActivePageIndex() {
    return scenarioPagesStore.pages.findIndex((p) => p.id === scenarioPagesStore.activePageId);
}

function getActivePage() {
    return scenarioPagesStore.pages.find((p) => p.id === scenarioPagesStore.activePageId) || null;
}

function persistScenarioPages() {
    saveScenarioPagesStore(scenarioPagesStore);
}

// ─────────────────────────────────────────────────────────────────────────────
// POPUP DE CONFIRMAÇÃO DE EXCLUSÃO
// ─────────────────────────────────────────────────────────────────────────────
function showDeleteConfirm(pageName: string, onConfirm: () => void) {
    // Remove popup existente se houver
    document.getElementById('scenario-delete-popup')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'scenario-delete-popup';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;

    overlay.innerHTML = `
        <div style="
            background: linear-gradient(180deg, #1e1306 0%, #0e0a02 100%);
            border: 1px solid #6b4a1a;
            border-radius: 6px;
            padding: 24px 28px;
            max-width: 340px;
            width: 90%;
            box-shadow: 0 16px 48px rgba(0,0,0,0.9);
            font-family: 'Crimson Text', serif;
            text-align: center;
        ">
            <div style="
                font-family: 'Cinzel', serif;
                font-size: 15px;
                color: #f0b030;
                letter-spacing: 0.08em;
                margin-bottom: 12px;
            ">Excluir Página</div>

            <p style="color: #ecd8b0; font-size: 15px; line-height: 1.5; margin: 0 0 20px;">
                Tem certeza que deseja excluir<br>
                <strong style="color:#f1e4d1;">"${pageName}"</strong>?<br>
                <span style="color:#8c7050; font-size:13px;">Esta ação não pode ser desfeita.</span>
            </p>

            <div style="display:flex; gap:10px; justify-content:center;">
                <button id="scenario-delete-cancel" style="
                    flex: 1;
                    padding: 9px 16px;
                    background: linear-gradient(135deg, #2a1a06, #1e1205);
                    border: 1px solid #3a2408;
                    border-radius: 4px;
                    color: #c8a060;
                    font-family: 'Cinzel', serif;
                    font-size: 12px;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    cursor: pointer;
                ">Cancelar</button>

                <button id="scenario-delete-confirm" style="
                    flex: 1;
                    padding: 9px 16px;
                    background: linear-gradient(135deg, #3a1008, #2a0e06);
                    border: 1px solid #8a2818;
                    border-radius: 4px;
                    color: #e07858;
                    font-family: 'Cinzel', serif;
                    font-size: 12px;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    cursor: pointer;
                ">Excluir</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('scenario-delete-cancel')!.addEventListener('click', () => overlay.remove());
    document.getElementById('scenario-delete-confirm')!.addEventListener('click', () => {
        overlay.remove();
        onConfirm();
    });

    // Clique fora fecha
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// RENAME INLINE — ativado por duplo clique no nome
// ─────────────────────────────────────────────────────────────────────────────
function startInlineRename(pageId: string, nameEl: HTMLElement) {
    const page = scenarioPagesStore.pages.find((p) => p.id === pageId);
    if (!page) return;

    const input = document.createElement('input');
    input.type  = 'text';
    input.value = page.name;
    input.style.cssText = `
        background: rgba(0,0,0,0.5);
        border: 1px solid #d4a34d;
        border-radius: 3px;
        color: #f1e4d1;
        font-family: 'Cinzel', serif;
        font-size: 13px;
        padding: 2px 6px;
        width: 100%;
        outline: none;
        box-sizing: border-box;
    `;

    nameEl.replaceWith(input);
    input.focus();
    input.select();

    let committed = false;

    function commitRename() {
        if (committed) return;
        committed = true;
        const newName = input.value.trim() || page!.name;
        page!.name = newName;
        persistScenarioPages();
        renderScenarioPagesList();
    }

    input.addEventListener('blur',    commitRename);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter')  { e.preventDefault(); input.blur(); }
        if (e.key === 'Escape') { committed = true; renderScenarioPagesList(); }
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// EXCLUIR PÁGINA
// ─────────────────────────────────────────────────────────────────────────────
function deleteScenarioPage(pageId: string) {
    // Não permite excluir se for a única página
    if (scenarioPagesStore.pages.length <= 1) return;

    const idx = scenarioPagesStore.pages.findIndex((p) => p.id === pageId);
    if (idx === -1) return;

    scenarioPagesStore.pages.splice(idx, 1);

    // Se excluiu a ativa, abre a anterior (ou a primeira)
    if (scenarioPagesStore.activePageId === pageId) {
        const newActive = scenarioPagesStore.pages[Math.max(0, idx - 1)];
        scenarioPagesStore.activePageId = newActive.id;
        applyScenarioPage(clonePage(newActive));
    }

    persistScenarioPages();
    renderScenarioPagesList();
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────────────────────────────────────
export function renderScenarioPagesList() {
    const container = getPagesContainer();
    if (!container) return;

    container.innerHTML = '';

    scenarioPagesStore.pages.forEach((page, index) => {
        const isActive = page.id === scenarioPagesStore.activePageId;
        const isOnly   = scenarioPagesStore.pages.length === 1;

        const itemWrap = document.createElement('div');
        itemWrap.className = `scene-item${isActive ? ' current' : ''}`;
        itemWrap.style.cssText = 'display:flex; align-items:center; gap:8px; width:100%; padding:8px 10px; box-sizing:border-box;';

        // Avatar
        const avatar = document.createElement('div');
        avatar.className  = 'entity-avatar';
        avatar.style.background = isActive ? '#3d352a' : '#1a1306';
        avatar.innerHTML  = `<i data-lucide="${isActive ? 'map-pin' : 'book-open'}" style="width:14px;"></i>`;
        itemWrap.appendChild(avatar);

        // Info — clique simples abre, duplo clique renomeia
        const info = document.createElement('div');
        info.className = 'scene-info';
        info.style.cssText = 'flex:1; min-width:0; cursor:pointer; user-select:none;';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'scene-name';
        nameSpan.style.cssText = 'display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
        nameSpan.textContent = page.name;
        nameSpan.title = 'Clique duplo para renomear';

        const subSpan = document.createElement('span');
        subSpan.className = 'entity-sub';
        subSpan.textContent = isActive ? 'Mapa Atual' : `Página ${index + 1}`;

        info.appendChild(nameSpan);
        info.appendChild(subSpan);

        // Clique simples → abre página
        info.addEventListener('click', () => openScenarioPage(page.id));

        // Duplo clique → renomeia inline
        nameSpan.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            startInlineRename(page.id, nameSpan);
        });

        itemWrap.appendChild(info);

        // Botão excluir — desativado se for a única página
        const deleteBtn = document.createElement('button');
        deleteBtn.type  = 'button';
        deleteBtn.title = isOnly ? 'Não é possível excluir a única página' : 'Excluir página';
        deleteBtn.disabled = isOnly;
        deleteBtn.style.cssText = `
            background: none;
            border: none;
            color: ${isOnly ? '#3d352a' : '#7a3030'};
            cursor: ${isOnly ? 'default' : 'pointer'};
            padding: 2px 4px;
            flex-shrink: 0;
            transition: color 0.2s;
        `;
        deleteBtn.innerHTML = `<i data-lucide="trash-2" style="width:13px; height:13px;"></i>`;
        deleteBtn.addEventListener('mouseenter', () => {
            if (!isOnly) deleteBtn.style.color = '#e07858';
        });
        deleteBtn.addEventListener('mouseleave', () => {
            if (!isOnly) deleteBtn.style.color = '#7a3030';
        });
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isOnly) return;
            showDeleteConfirm(page.name, () => deleteScenarioPage(page.id));
        });
        itemWrap.appendChild(deleteBtn);

        // Check ativo
        if (isActive) {
            const check = document.createElement('i');
            check.setAttribute('data-lucide', 'check-circle-2');
            check.style.cssText = 'color:#d4a34d; width:16px; height:16px; flex-shrink:0;';
            itemWrap.appendChild(check);
        }

        container.appendChild(itemWrap);
    });

    // Botão Nova Página
    const atLimit = scenarioPagesStore.pages.length >= MAX_PAGES;
    const newBtn  = document.createElement('button');
    newBtn.type   = 'button';
    newBtn.className = 'combat-start-btn';
    newBtn.style.cssText = `width:100%; margin-top:8px; opacity:${atLimit ? '0.45' : '1'};`;
    newBtn.disabled = atLimit;
    newBtn.title    = atLimit ? `Limite de ${MAX_PAGES} páginas atingido` : 'Nova página de cenário';
    newBtn.innerHTML = `<i data-lucide="plus-circle"></i> Nova Página${atLimit ? ` (${MAX_PAGES}/${MAX_PAGES})` : ''}`;
    newBtn.addEventListener('click', createScenarioPage);
    container.appendChild(newBtn);

    (window as any).updateIcons?.();
}

// ─────────────────────────────────────────────────────────────────────────────
// API PÚBLICA
// ─────────────────────────────────────────────────────────────────────────────
export function saveCurrentScenarioPage() {
    if (isApplyingScenarioPage) return;

    const activePageIndex = getActivePageIndex();
    if (activePageIndex === -1) return;

    const currentPage = scenarioPagesStore.pages[activePageIndex];
    scenarioPagesStore.pages[activePageIndex] = createPageSnapshot(currentPage);
    persistScenarioPages();
    renderScenarioPagesList();
}

export function openScenarioPage(pageId: string) {
    if (scenarioPagesStore.activePageId === pageId) return;

    saveCurrentScenarioPage();

    const page = scenarioPagesStore.pages.find((p) => p.id === pageId);
    if (!page) return;

    scenarioPagesStore.activePageId = page.id;
    persistScenarioPages();
    applyScenarioPage(clonePage(page));
    renderScenarioPagesList();
}

export function createScenarioPage() {
    if (scenarioPagesStore.pages.length >= MAX_PAGES) return;

    saveCurrentScenarioPage();

    const name    = `Página ${scenarioPagesStore.pages.length + 1}`;
    const newPage = createEmptyScenarioPage(name);

    scenarioPagesStore.pages.push(newPage);
    scenarioPagesStore.activePageId = newPage.id;
    persistScenarioPages();
    applyScenarioPage(clonePage(newPage));
    renderScenarioPagesList();
}

export function initializeScenarioPages() {
    scenarioPagesStore = loadScenarioPagesStore();

    if (scenarioPagesStore.pages.length === 0) {
        const defaultPage = createEmptyScenarioPage('Página 1');
        scenarioPagesStore = {
            activePageId: defaultPage.id,
            pages:        [createPageSnapshot(defaultPage)],
        };
        persistScenarioPages();
    }

    const activePage = getActivePage() || scenarioPagesStore.pages[0];
    if (activePage) {
        scenarioPagesStore.activePageId = activePage.id;
        applyScenarioPage(clonePage(activePage));
    }

    persistScenarioPages();
    renderScenarioPagesList();
}