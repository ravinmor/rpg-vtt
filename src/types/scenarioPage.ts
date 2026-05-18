import type { DayPhase } from '../engine/dayNight';
import type { WeatherType } from '../engine/weatherSystem';
import type { FogPersistenceData } from '../repositories/fogRepository';
import type { DistanceUnit } from '../data/constants';

export interface ScenarioPageViewportState {
    center: { x: number; y: number };
    scale: number;
}

export interface ScenarioPageStageState {
    zones: any[];
}

export interface ScenarioPageEntitiesState {
    characters: any[];
}

export interface ScenarioPageSessionState {
    distanceUnit: DistanceUnit;
    dayPhase: DayPhase;
    weather: WeatherType;
    fog: FogPersistenceData;
    viewport: ScenarioPageViewportState;
    showGrid: boolean;
    gridScale: number;
    tokenScale: number;
}

export interface ScenarioPage {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    stage: ScenarioPageStageState;
    entities: ScenarioPageEntitiesState;
    session: ScenarioPageSessionState;
}

export interface ScenarioPagesStore {
    activePageId: string | null;
    pages: ScenarioPage[];
}
