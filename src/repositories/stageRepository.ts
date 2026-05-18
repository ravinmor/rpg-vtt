import { state } from '../state/globalState';
import type { ScenarioPageStageState } from '../types/scenarioPage';

function sanitizeZone(zone: any) {
    const {
        video,
        image,
        pattern,
        sprite,
        texture,
        mesh,
        container,
        ...serializableZone
    } = zone;

    return JSON.parse(JSON.stringify(serializableZone));
}

export function snapshotStageState(): ScenarioPageStageState {
    return {
        zones: state.activeZones.map((zone: any) => sanitizeZone(zone)),
    };
}

export function restoreStageState(stageState: ScenarioPageStageState) {
    state.activeZones = JSON.parse(JSON.stringify(stageState.zones || []));
}
