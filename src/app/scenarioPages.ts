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
        stage: snapshotStageState(),
        entities: snapshotEntitiesState(),
        session: snapshotSessionState(),
    };
}

function createEmptyScenarioPage(name: string): ScenarioPage {
    const timestamp = Date.now();

    return {
        id: `page_${timestamp}_${Math.floor(Math.random() * 100000)}`,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stage: {
            zones: [],
        },
        entities: {
            characters: [],
        },
        session: snapshotSessionState(),
    };
}

function applyScenarioPage(page: ScenarioPage) {
    isApplyingScenarioPage = true;

    state.selectedCharacter = null;
    state.editingZone = null;
    state.menuOpen = false;
    state.pendingMenuPoint = null;
    state.pendingSpellPoint = null;
    state.lastCirclePath = [];
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
    return scenarioPagesStore.pages.findIndex((page) => page.id === scenarioPagesStore.activePageId);
}

function getActivePage() {
    return scenarioPagesStore.pages.find((page) => page.id === scenarioPagesStore.activePageId) || null;
}

function persistScenarioPages() {
    saveScenarioPagesStore(scenarioPagesStore);
}

export function renderScenarioPagesList() {
    const container = getPagesContainer();
    if (!container) return;

    container.innerHTML = '';

    scenarioPagesStore.pages.forEach((page, index) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = `scene-item${page.id === scenarioPagesStore.activePageId ? ' current' : ''}`;
        item.style.width = '100%';
        item.style.textAlign = 'left';
        item.style.border = 'none';
        item.style.padding = '0';
        item.innerHTML = `
            <div class="entity-avatar" style="background: ${page.id === scenarioPagesStore.activePageId ? '#3d352a' : '#1a1306'};">
                <i data-lucide="${page.id === scenarioPagesStore.activePageId ? 'map-pin' : 'book-open'}" style="width:14px;"></i>
            </div>
            <div class="scene-info">
                <span class="scene-name">${page.name}</span>
                <span class="entity-sub">${page.id === scenarioPagesStore.activePageId ? 'Mapa Atual' : `Página ${index + 1}`}</span>
            </div>
            ${page.id === scenarioPagesStore.activePageId ? '<i data-lucide="check-circle-2" style="color: #d4a34d; width:16px;"></i>' : ''}
        `;
        item.addEventListener('click', () => {
            openScenarioPage(page.id);
        });
        container.appendChild(item);
    });

    (window as any).updateIcons?.();
}

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

    const page = scenarioPagesStore.pages.find((item) => item.id === pageId);
    if (!page) return;

    scenarioPagesStore.activePageId = page.id;
    persistScenarioPages();
    applyScenarioPage(clonePage(page));
    renderScenarioPagesList();
}

export function createScenarioPage() {
    saveCurrentScenarioPage();

    const suggestedName = `Página ${scenarioPagesStore.pages.length + 1}`;
    const pageName = window.prompt('Nome da nova página de cenário:', suggestedName)?.trim() || suggestedName;
    const newPage = createEmptyScenarioPage(pageName);

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
            pages: [createPageSnapshot(defaultPage)],
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
