import { state } from '../state/globalState';

export function renderLayersList() {
    const layersContainer = document.getElementById('layers-list');
    const spellsContainer = document.getElementById('spells-list');
    if (!layersContainer) return;

    layersContainer.innerHTML = '';
    if (spellsContainer) spellsContainer.innerHTML = '';

    const reversedZones = [...state.activeZones].reverse();

    reversedZones.forEach((zone) => {
        if (zone.visible === undefined) zone.visible = true;
        if (zone.locked === undefined) zone.locked = false;
        if (!zone.name) zone.name = zone.type === 'spell_object' ? 'Magia' : 'Area';

        const itemHtml = `
            <div class="entity-item layer-item ${state.editingZone?.id === zone.id ? 'current' : ''}">
                <div class="entity-info" onclick="selectLayer('${zone.id}')">
                    <span class="entity-name">${zone.name}</span>
                    <span class="entity-sub">${zone.category}</span>
                </div>
                <div class="entity-actions">
                    <button class="entity-action-btn" onclick="toggleLayerVisibility('${zone.id}', event)">
                        <i data-lucide="${zone.visible !== false ? 'eye' : 'eye-off'}"></i>
                    </button>
                    <button class="entity-action-btn" onclick="toggleLayerLock('${zone.id}', event)">
                        <i data-lucide="${zone.locked ? 'lock' : 'unlock'}"></i>
                    </button>
                </div>
            </div>
        `;

        if (zone.type === 'spell_object') {
            if (spellsContainer) {
                spellsContainer.insertAdjacentHTML('beforeend', itemHtml);
            } else {
                layersContainer.insertAdjacentHTML('beforeend', itemHtml);
            }
        } else {
            layersContainer.insertAdjacentHTML('beforeend', itemHtml);
        }
    });

    if (typeof (window as any).updateIcons === 'function') {
        (window as any).updateIcons();
    }
}

export function selectLayer(id: string) {
    const zone = state.activeZones.find((item) => item.id === id);
    if (zone) state.editingZone = zone;
    renderLayersList();
}

export function toggleLayerVisibility(id: string, event: MouseEvent) {
    event.stopPropagation();
    const zone = state.activeZones.find((item) => item.id === id);
    if (zone) zone.visible = !zone.visible;
    renderLayersList();
}

export function toggleLayerLock(id: string, event: MouseEvent) {
    event.stopPropagation();
    const zone = state.activeZones.find((item) => item.id === id);
    if (zone) zone.locked = !zone.locked;
    renderLayersList();
}
