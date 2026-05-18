import { characters } from '../data/character';
import { setDistanceUnit } from '../data/constants';
import * as CombatLogic from '../state/gameState';
import { state } from '../state/globalState';
import { saveCharacters } from '../repositories/characterRepository';
import * as RadialMenu from '../ui/radialMenu';
import * as BestiaryUI from '../ui/bestiaryUI';
import { viewport } from '../engine/scene';
import { isFogActive, toggleFog, clearFog } from '../engine/fogOfWar';
import { closeCharacterMenu, updateCharacterPanels } from '../ui/characterSheet';
import { renderInitiativeList, updateCharInitiative, removeMonsterFromMap } from '../ui/combatPanel';
import { openImportModal, closeImportModal, processImportedJson } from '../ui/characterImport';
import { openEditCharacterModal, closeEditCharacterModal, saveCharacterEdit } from '../ui/characterEditor';
import { renderLayersList, selectLayer, toggleLayerVisibility, toggleLayerLock } from '../ui/layersPanel';
import { saveSessionNotes, exportSessionNotes, setNotesMode } from '../ui/sessionNotes';
import { setTool, toggleGrid } from '../ui/toolControls';
import { createScenarioPage, openScenarioPage, saveCurrentScenarioPage } from './scenarioPages';

type RegisterGlobalsOptions = {
    createIcons: (config: any) => void;
    updateIcons: () => void;
    setDayPhase: (phase: any) => void;
    setWeather: (weather: any) => void;
};

export function registerGlobals(options: RegisterGlobalsOptions) {
    const windowRef = window as any;
    const characterHpInput = document.getElementById('character-hp-input') as HTMLInputElement | null;
    const sideMenu = document.getElementById('side-menu');

    windowRef.toggleSideMenu = () => sideMenu?.classList.toggle('collapsed');
    windowRef.toggleGrid = toggleGrid;
    windowRef.setTool = setTool;
    windowRef.adjustZoom = (delta: number) => {
        if (!viewport) return;
        if (delta === -1) {
            viewport.animate({ scale: 1, time: 250 });
        } else {
            viewport.animate({ scale: viewport.scale.x + delta, time: 200 });
        }
    };

    windowRef.menuGoBack = RadialMenu.menuGoBack;
    windowRef.closeMenu = RadialMenu.closeMenu;
    windowRef.deleteEffect = RadialMenu.deleteEffect;
    windowRef.clearArea = RadialMenu.clearArea;
    windowRef.updateCharInitiative = updateCharInitiative;
    windowRef.closeCharacterMenu = closeCharacterMenu;
    windowRef.removeMonsterFromMap = removeMonsterFromMap;
    windowRef.addMonsterFromSelect = BestiaryUI.addMonsterFromSelect;
    windowRef.openImportModal = openImportModal;
    windowRef.closeImportModal = closeImportModal;
    windowRef.processImportedJson = () => processImportedJson(renderInitiativeList);
    windowRef.openEditCharacterModal = openEditCharacterModal;
    windowRef.closeEditCharacterModal = closeEditCharacterModal;
    windowRef.saveCharacterEdit = () => saveCharacterEdit(renderInitiativeList);
    windowRef.renderLayersList = renderLayersList;
    windowRef.createIcons = options.createIcons;
    windowRef.updateIcons = options.updateIcons;
    windowRef.setDayPhase = (phase: any) => {
        options.setDayPhase(phase);
        saveCurrentScenarioPage();
    };
    windowRef.setWeather = (weather: any) => {
        options.setWeather(weather);
        saveCurrentScenarioPage();
    };
    windowRef.saveSessionNotes = saveSessionNotes;
    windowRef.exportSessionNotes = exportSessionNotes;
    windowRef.setNotesMode = setNotesMode;
    windowRef.createScenarioPage = createScenarioPage;
    windowRef.openScenarioPage = openScenarioPage;
    windowRef.saveCurrentScenarioPage = saveCurrentScenarioPage;
    windowRef.setUnit = (unit: 'ft' | 'm') => {
        setDistanceUnit(unit);
        document.getElementById('btn-unit-ft')?.classList.toggle('active', unit === 'ft');
        document.getElementById('btn-unit-m')?.classList.toggle('active', unit === 'm');
        saveCurrentScenarioPage();
    };

    windowRef.applyCharacterHp = (direction: number) => {
        if (!state.selectedCharacter || !characterHpInput) return;
        const amount = Math.max(0, Number(characterHpInput.value) || 0);
        CombatLogic.changeHP(state.selectedCharacter.id, amount * direction, () => {
            updateCharacterPanels();
            saveCharacters(characters);
            saveCurrentScenarioPage();
        });
    };

    windowRef.nextTurn = () => CombatLogic.nextTurn((index: number) => {
        CombatLogic.updateActiveTurn(index);
        renderInitiativeList();
        saveCurrentScenarioPage();
    });
    windowRef.prevTurn = () => CombatLogic.prevTurn((index: number) => {
        CombatLogic.updateActiveTurn(index);
        renderInitiativeList();
        saveCurrentScenarioPage();
    });
    windowRef.sortInitiative = () => CombatLogic.sortInitiative((index: number) => {
        CombatLogic.updateActiveTurn(index);
        renderInitiativeList();
        saveCurrentScenarioPage();
    });
    windowRef.resetCombat = () => CombatLogic.resetCombat(() => {
        renderInitiativeList();
        saveCurrentScenarioPage();
    });
    windowRef.spawn = (id: string) => {
        const center = viewport.center;
        CombatLogic.spawnMonster(id, center.x, center.y, renderInitiativeList);
        saveCurrentScenarioPage();
    };
    windowRef.selectLayer = selectLayer;
    windowRef.toggleLayerVisibility = toggleLayerVisibility;
    windowRef.toggleLayerLock = toggleLayerLock;
    windowRef.toggleFogMode = () => {
        const next = !isFogActive();
        toggleFog(next);
        import('../engine/fogOfWar').then((module) => module.saveFog());
        saveCurrentScenarioPage();
    };
    windowRef.startFogDraw = () => {
        state.fogMode = true;
        setTool('pen');
    };
    windowRef.clearFogArea = () => {
        clearFog();
        saveCurrentScenarioPage();
    };
}
