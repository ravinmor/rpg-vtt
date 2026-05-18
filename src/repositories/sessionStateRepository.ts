import { distanceUnit, setDistanceUnit } from '../data/constants';
import { getCurrentPhase, setDayPhase } from '../engine/dayNight';
import { viewport } from '../engine/scene';
import { applyFogState, getFogState } from '../engine/fogOfWar';
import { getCurrentWeather, setWeather } from '../engine/weatherSystem';
import { state } from '../state/globalState';
import type { ScenarioPageSessionState } from '../types/scenarioPage';

function syncUnitButtons(unit: 'ft' | 'm') {
    document.getElementById('btn-unit-ft')?.classList.toggle('active', unit === 'ft');
    document.getElementById('btn-unit-m')?.classList.toggle('active', unit === 'm');
}

export function snapshotSessionState(): ScenarioPageSessionState {
    const center = viewport.center;

    return {
        distanceUnit,
        dayPhase: getCurrentPhase(),
        weather: getCurrentWeather(),
        fog: getFogState(),
        viewport: {
            center: { x: center.x, y: center.y },
            scale: viewport.scale.x,
        },
        showGrid: state.showGrid,
        gridScale: state.gridScale,
        tokenScale: state.tokenScale,
    };
}

export function restoreSessionState(sessionState: ScenarioPageSessionState) {
    setDistanceUnit(sessionState.distanceUnit || 'ft');
    syncUnitButtons(sessionState.distanceUnit || 'ft');

    state.showGrid = sessionState.showGrid ?? true;
    state.gridScale = sessionState.gridScale ?? 1;
    state.tokenScale = sessionState.tokenScale ?? 1;
    document.getElementById('btn-tool-grid')?.classList.toggle('active', state.showGrid);

    setDayPhase(sessionState.dayPhase || 'day');
    setWeather(sessionState.weather || 'clear');
    applyFogState(sessionState.fog);

    if (sessionState.viewport) {
        viewport.setZoom(sessionState.viewport.scale || 1, false);
        viewport.moveCenter(sessionState.viewport.center || { x: 2000, y: 2000 });
    }
}
