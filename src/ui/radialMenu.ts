// src/ui/radialMenu.ts
import { state } from '../state/globalState';
import { menuDatabase } from '../data/menu';
import { spellDatabase } from '../data/spells';
import { getBoundingBox } from '../utils/math';
import { gizmo } from '../engine/transformGizmo';

const w = (window as any);

export function applySpellObject(spellData: any) {
    if (!state.pendingSpellPoint) return;

    const currentFolder = state.currentMenuStack[state.currentMenuStack.length - 1];
    const folderLabel = currentFolder.label || "Geral";

    const newSpell = {
        id: `spell_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: spellData.label,
        type: 'spell_object',
        category: folderLabel,
        x: state.pendingSpellPoint.x,
        y: state.pendingSpellPoint.y,
        radius:      spellData.radius      || 100,
        opacity:     spellData.opacity     ?? 0.8,
        rotateSpeed: spellData.rotateSpeed || 0,
        fade:        spellData.fade        ?? true,
        // Salva apenas a string — effectDrawer faz o Assets.load()
        videoPath:   spellData.videoPath   || null,
        imagePath:   spellData.imagePath   || null,
        color:       spellData.color       || null,
        visible: true,
    };

    state.activeZones.push(newSpell);
    state.pendingSpellPoint = null;
    w.renderLayersList();
    w.saveCurrentScenarioPage?.();

    if (w.setTool) w.setTool('select');
}

export function setEffect(item: any, e: any) {
    if (e) e.stopPropagation();
    const currentFolder = state.currentMenuStack[state.currentMenuStack.length - 1];
    const folderLabel = currentFolder.label || "Geral";

    // Partículas (vagalumes)
    const bb = getBoundingBox(
        state.lastCirclePath.length > 0
            ? state.lastCirclePath
            : (state.editingZone ? state.editingZone.path : [])
    );

    const particles: any[] = [];
    if (item.id === 'fireflies') {
        for (let i = 0; i < 35; i++) {
            particles.push({
                x:     bb.minX + Math.random() * bb.width,
                y:     bb.minY + Math.random() * bb.height,
                vx:    (Math.random() - 0.5) * 0.4,
                vy:    (Math.random() - 0.5) * 0.4,
                size:  Math.random() * 1.5 + 0.8,
                alpha: Math.random(),
                pulse: Math.random() * 0.015 + 0.005,
            });
        }
    }

    const zoneData: any = {
        id: `zone_${Date.now()}`,
        type:      item.type,
        name:      item.label,
        category:    folderLabel,
        path:      state.lastCirclePath.length > 0
                       ? [...state.lastCirclePath]
                       : (state.editingZone ? state.editingZone.path : []),
        // ← Apenas strings; effectDrawer faz o carregamento
        videoPath: item.videoPath  || null,
        imagePath: item.imagePath  || null,
        color:     item.color      || null,
        opacity:   item.opacity    ?? null,
        particles,
    };

    if (state.editingZone) {
        Object.assign(state.editingZone, {
            type:      zoneData.type,
            name:      zoneData.name,
            videoPath: zoneData.videoPath,
            imagePath: zoneData.imagePath,
            color:     zoneData.color,
            opacity:   zoneData.opacity,
            particles: zoneData.particles,
            video:     null,
            image:     null,
            pattern:   null,
            isDraft:   false,   // ← remove a flag de rascunho
        })
        state.editingZone = null
    } else if (state.lastCirclePath.length > 0) {
        state.activeZones.push(zoneData)
    }

    if (typeof w.setTool === 'function') {
        w.setTool('select');
    }

    if (typeof w.renderLayersList === 'function') {
        w.renderLayersList();
    }
    w.saveCurrentScenarioPage?.();
    closeMenu(null);
}

export function deleteEffect(e: any) {
    if (e) e.stopPropagation();
    if (state.editingZone) {
        state.activeZones = state.activeZones.filter(z => z !== state.editingZone);
        state.editingZone = null;
    }
    gizmo.detach();
    w.renderLayersList();
    w.saveCurrentScenarioPage?.();
    closeMenu(null);
}

export function clearArea() {
    state.activeZones = [];
    state.gesturePoints = [];
    state.pendingMenuPoint = null;
    w.renderLayersList();
    w.saveCurrentScenarioPage?.();
    closeMenu(null);
}

export function showMenu(x: number, y: number, isEditing = false) {
    if (!state.menuOpen) {
        state.currentMenuStack = state.currentDrawMode === 'spell_object'
            ? [spellDatabase]
            : [menuDatabase];
    }

    renderEffectMenu();

    if (state.menu) state.menu.style.display = 'block';
    const delBtn = document.getElementById('menu-delete-btn');
    if (delBtn) delBtn.style.display = isEditing ? 'block' : 'none';

    const rect    = state.menu.getBoundingClientRect();
    const padding = 20;
    const margin  = 40;

    let targetLeft = x;
    let targetTop  = y;

    const activePath = state.editingZone
        ? state.editingZone.path
        : (state.lastCirclePath.length > 0 ? state.lastCirclePath : null);

    if (activePath && state.currentDrawMode !== 'spell_object') {
        const bb = getBoundingBox(activePath);
        targetLeft = bb.maxX + margin;
        targetTop  = bb.minY + bb.height / 2 - rect.height / 2;

        if (targetLeft + rect.width + padding > window.innerWidth) {
            targetLeft = bb.minX - rect.width - margin;
        }
        if (targetLeft < padding) {
            targetLeft = bb.minX + bb.width / 2 - rect.width / 2;
            targetTop  = bb.maxY + margin;
        }
    }

    if (state.menu) {
        state.menu.style.left = `${Math.max(padding, Math.min(targetLeft, window.innerWidth  - rect.width  - padding))}px`;
        state.menu.style.top  = `${Math.max(padding, Math.min(targetTop,  window.innerHeight - rect.height - padding))}px`;
    }
    state.menuOpen = true;
}

export function closeMenu(e: any) {
    if (e) e.stopPropagation()
    if (state.menu) state.menu.style.display = 'none'
    state.menuOpen        = false
    state.isDrawingCircle = false
    state.isDrawingShape  = false
    state.gesturePoints   = []
    state.pendingMenuPoint   = null
    state.intersectionPoint  = null
    state.lastCirclePath     = []
 
    // Só limpa editingZone se NÃO for um rascunho
    // Rascunhos precisam manter a referência para que o clique posterior funcione
    if (!state.editingZone?.isDraft) {
        state.editingZone = null
    }
}

export function renderEffectMenu() {
    const grid    = document.getElementById('effect-menu-grid');
    const title   = document.getElementById('effect-menu-title');
    const backBtn = document.getElementById('menu-back-btn');

    const currentFolder = state.currentMenuStack[state.currentMenuStack.length - 1];

    if (title)   title.textContent = currentFolder.label;
    if (backBtn) backBtn.style.display = state.currentMenuStack.length > 1 ? 'block' : 'none';
    if (!grid)   return;

    grid.innerHTML = '';

    currentFolder.children.forEach((item: any) => {
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
                state.currentMenuStack.push(item);
                renderEffectMenu();
            };
        } else {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (state.editingZone) {
                    updateExistingEffect(state.editingZone, item);
                } else if (state.currentDrawMode === 'spell_object') {
                    applySpellObject(item);
                } else {
                    setEffect(item, e);
                }
                closeMenu(null);
                if (typeof w.setTool === 'function') {
                    w.setTool('select');
                }
            };
        }
        grid.appendChild(btn);
    });
}

export function updateExistingEffect(zone: any, newItem: any) {
    zone.name      = newItem.label;
    zone.type      = newItem.id;
    zone.videoPath = newItem.videoPath || null;
    zone.imagePath = newItem.imagePath || null;
    zone.color     = newItem.color     || null;
    zone.opacity   = newItem.opacity   ?? null;
    zone.isDraft   = false 
    // Limpa legados do canvas antigo
    zone.video   = null;
    zone.image   = null;
    zone.pattern = null;

    if (zone.type === 'spell_object') {
        zone.rotateSpeed = newItem.rotateSpeed || 0;
        zone.fade        = newItem.fade !== undefined ? newItem.fade : false;
    }

    if (typeof w.renderLayersList === 'function') {
        ;w.renderLayersList()
    }
    w.saveCurrentScenarioPage?.();
}


export function menuGoBack(e: any) {
    if (e) e.stopPropagation();
    if (state.currentMenuStack.length > 1) {
        state.currentMenuStack.pop();
        renderEffectMenu();
    }
}
