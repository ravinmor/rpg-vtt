import { createIcons, Users, BookOpen, MousePointer2, Square, Circle, Triangle, Type, Grid3X3, Trash2, Sparkle, Brush, Hash, Copy, WandSparkles, Eye, EyeOff, Lock, Unlock, ChevronLeft, X, PenTool, Ruler, Target, Crosshair, Sun, Sunset, Moon, Cloud, CloudRain, CloudLightning, Snowflake, Wind, CloudSnow, Blend, ThermometerSun, ThermometerSnowflake, Tornado, CloudFog, Flame, BrickWallFire, Eraser } from 'lucide';
import { characters } from './data/character';
import { BASE_GRID_SIZE } from './data/constants';
import * as CombatLogic from './state/gameState';
import * as Renderer from './engine/renderer';
import { syncTokens } from './engine/characterDrawer';
import { syncEffects } from './engine/effectDrawer';
import { syncUI } from './engine/uiDrawer';
import { initMouseEvents } from './events/mouseHandlers';
import { state } from './state/globalState';
import * as RadialMenu from './ui/radialMenu';
import * as BestiaryUI from './ui/bestiaryUI';
import { initScene, app, viewport, layerPings } from './engine/scene';
import { gizmo } from './engine/transformGizmo';
import { loadStatusIcons } from './utils/images';
import { drawPenPreview } from './engine/penTool';
import { drawRuler } from './engine/rulerTool';
import { drawPings } from './engine/pingTool';
import { initDayNight, setDayPhase, tickDayNight } from './engine/dayNight';
import { initWeather, setWeather, tickWeather } from './engine/weatherSystem';
import { clearFog, initFog, loadFog, tickFogMist } from './engine/fogOfWar';
import {
    bindCharacterMenuDrag,
    closeCharacterMenu,
    getCharacterAtPosition,
    openCharacterMenu,
    renderSideCharacterStatuses,
    updateCharacterPanels,
} from './ui/characterSheet';
import { renderInitiativeList } from './ui/combatPanel';
import { loadSessionNotes } from './ui/sessionNotes';
import { bindFloatingMenus } from './ui/floatingMenus';
import { registerGlobals } from './app/registerGlobals';
import { initializeScenarioPages } from './app/scenarioPages';
import { loadCharacters } from './repositories/characterRepository';

const canvas = document.getElementById('vttCanvas') as HTMLCanvasElement;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

export function getMapCoords(event: MouseEvent) {
    if (!viewport) return { x: event.clientX, y: event.clientY };
    return viewport.toWorld(event.clientX, event.clientY);
}

function updateIcons() {
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
            Ruler,
            Target,
            Crosshair,
            Sun,
            Sunset,
            Moon,
            Cloud,
            CloudRain,
            CloudLightning,
            Snowflake,
            Wind,
            CloudSnow,
            Blend,
            ThermometerSun,
            ThermometerSnowflake,
            Tornado,
            CloudFog,
            Flame,
            BrickWallFire,
            Eraser,
            ChevronLeft,
            X,
        },
    });
}

function restoreCharactersFromStorage() {
    if (characters.length === 0) {
        const savedCharacters = loadCharacters();
        if (savedCharacters.length > 0) {
            characters.push(...savedCharacters);
        }
        return;
    }

    const savedCharacters = loadCharacters();
    if (savedCharacters.length === 0) return;

    characters.forEach((character) => {
        const saved = savedCharacters.find((item: any) => item.id === character.id);
        if (!saved) return;

        character.hp = saved.hp;
        character.tempHp = saved.tempHp;
        character.statuses = saved.statuses;
        character.initiative = saved.initiative;
        character.x = saved.x;
        character.y = saved.y;
    });

    const spawnedNpcs = savedCharacters.filter((item: any) => item.isNPC && !characters.find((character) => character.id === item.id));
    if (spawnedNpcs.length > 0) {
        characters.push(...spawnedNpcs);
    }
}

const mouseTools = {
    getMapCoords,
    getCharacterAtPosition,
    updateCharacterPanels,
    closeCharacterMenu,
    openCharacterMenu,
    renderSideCharacterStatuses: (character: any) => renderSideCharacterStatuses(character),
    renderEffectMenu: RadialMenu.renderEffectMenu,
    showMenu: RadialMenu.showMenu,
};

async function bootstrap() {
    window.addEventListener('resize', resize);
    resize();

    await initScene(canvas);
    await loadStatusIcons();

    restoreCharactersFromStorage();
    loadSessionNotes();
    initDayNight();
    initWeather();
    initFog();
    loadFog();

    bindCharacterMenuDrag();
    bindFloatingMenus();
    registerGlobals({
        createIcons,
        updateIcons,
        setDayPhase,
        setWeather,
    });
    updateIcons();
    initializeScenarioPages();

    window.addEventListener('pointerdown', () => {
        console.log('Interacao detectada, videos destravados.');
    }, { once: true });

    initMouseEvents(canvas, null as any, state, mouseTools);
    BestiaryUI.populateMonsterSelect();

    app.ticker.add(() => {
        state.concentrationPulse += 0.08;
        Renderer.drawGrid(BASE_GRID_SIZE, state.gridScale);
        syncEffects(state.activeZones, state.editingZone);
        syncTokens(characters, state.tokenScale, state.selectedCharacter?.id, state.concentrationPulse);
        syncUI(state);
        gizmo.tick();
        drawPenPreview();
        drawRuler();
        drawPings(layerPings);
        tickDayNight();
        tickWeather();
        tickFogMist();
    });

    syncEffects(state.activeZones, state.editingZone);
    renderInitiativeList();
}

bootstrap().catch((error) => {
    console.error('Erro ao inicializar a aplicacao:', error);
    clearFog();
});
