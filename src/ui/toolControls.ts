import { resetPen } from '../engine/penTool';
import { resetRuler } from '../engine/rulerTool';
import { resetPings } from '../engine/pingTool';
import { state } from '../state/globalState';
import { closeCharacterMenu, updateCharacterPanels } from './characterSheet';

export function toggleGrid() {
    state.showGrid = !state.showGrid;
    document.getElementById('btn-tool-grid')?.classList.toggle('active', state.showGrid);
}

export function setTool(toolName: string) {
    if (toolName !== 'ruler') resetRuler();
    if (toolName !== 'ping') resetPings();

    if (state.currentDrawMode === 'pen' && toolName !== 'pen') {
        state.activeZones = state.activeZones.filter((zone: any) => !zone.isDraft || zone === state.editingZone);
        resetPen();
    }

    state.currentDrawMode = toolName;

    document.querySelectorAll('.tool-btn:not(.grid-toggle-btn)').forEach((button) => {
        button.classList.remove('active');
    });

    const activeButton = document.getElementById(`btn-tool-${toolName}`) || document.getElementById(`tool-${toolName}`);
    activeButton?.classList.add('active');

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

    closeCharacterMenu();
    if (state.menu) state.menu.style.display = 'none';
    updateCharacterPanels();

    if (typeof (window as any).renderLayersList === 'function') {
        (window as any).renderLayersList();
    }
}
