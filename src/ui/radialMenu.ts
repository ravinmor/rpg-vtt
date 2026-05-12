// src/ui/radialMenu.ts
import { state } from '../state/globalState';
import { menuDatabase } from '../data/menu';
import { spellDatabase } from '../data/spells';
import { createVideo } from '../utils/videos';
import { createImage } from '../utils/images';
import { getBoundingBox } from '../utils/math';

export function applySpellObject(spellData) {
    if (!state.pendingSpellPoint) return;

    const newSpell = {
        type: 'spell_object',
        id: spellData.id,
        x: state.pendingSpellPoint.x,
        y: state.pendingSpellPoint.y,
        radius: spellData.radius || 100,
        opacity: spellData.opacity || 0.8,
        rotation: 0,
        rotateSpeed: spellData.rotateSpeed || 0,
        fade: spellData.fade !== undefined ? spellData.fade : true,
        video: null as any
    };

    if (spellData.videoPath) {
      newSpell.video = createVideo(spellData.videoPath);
    }

    state.activeZones.push(newSpell);
    state.pendingSpellPoint = null;
}

export function setEffect(item, e) {
    if (e) e.stopPropagation();
    
    if (item.videoPath && !item.videoElement) {
        item.videoElement = createVideo(item.videoPath);
    }
    if (item.imagePath && !item.imageElement) {
        item.imageElement = createImage(item.imagePath);
    }

    const bb = getBoundingBox(state.lastCirclePath.length > 0 ? state.lastCirclePath : (state.editingZone ? state.editingZone.path : []));
    const particles = [];
    if (item.id === 'fireflies') {
        for (let i = 0; i < 35; i++) {
            particles.push({
                x: bb.minX + Math.random() * bb.width,
                y: bb.minY + Math.random() * bb.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 1.5 + 0.8,
                alpha: Math.random(),
                pulse: (Math.random() * 0.015) + 0.005
            });
        }
    }

    const zoneData = {
        path: state.lastCirclePath.length > 0 ? [...state.lastCirclePath] : (state.editingZone ? state.editingZone.path : []),
        type: item.id,
        video: item.videoElement || null,
        image: item.imageElement || null,
        color: item.color || null,
        pattern: null,
        particles: particles
    };

    if (state.editingZone) {
        state.editingZone.type = zoneData.type;
        state.editingZone.video = zoneData.video;
        state.editingZone.image = zoneData.image;
        state.editingZone.color = zoneData.color;
        state.editingZone.particles = zoneData.particles;
        state.editingZone.pattern = null;
        state.editingZone = null; 
    } else if (state.lastCirclePath.length > 0) {
        state.activeZones.push(zoneData);
    }

    closeMenu(null);
}

export function deleteEffect(e) {
    if (e) e.stopPropagation();
    if (state.editingZone) {
        state.activeZones = state.activeZones.filter(z => z !== state.editingZone);
        state.editingZone = null;
    }
    closeMenu(null);
}

export function clearArea() {
    state.activeZones = [];
    state.gesturePoints = [];
    state.pendingMenuPoint = null;
    closeMenu(null);
}

export function showMenu(x, y, isEditing = false) {
    if (!state.menuOpen) {
        if (state.currentDrawMode === 'spell_object') {
            state.currentMenuStack = [spellDatabase];
        } else {
            state.currentMenuStack = [menuDatabase];
        }
    }

    renderEffectMenu();

    if (state.menu) state.menu.style.display = 'block';
    const delBtn = document.getElementById('menu-delete-btn');
    if (delBtn) delBtn.style.display = isEditing ? 'block' : 'none';

    const rect = state.menu.getBoundingClientRect();
    const padding = 20;
    const marginFromShape = 40;

    let targetLeft = x;
    let targetTop = y;

    const activePath = state.editingZone ? state.editingZone.path : (state.lastCirclePath.length > 0 ? state.lastCirclePath : null);

    if (activePath && state.currentDrawMode !== 'spell_object') {
        const bb = getBoundingBox(activePath);
        targetLeft = bb.maxX + marginFromShape;
        targetTop = bb.minY + (bb.height / 2) - (rect.height / 2);

        if (targetLeft + rect.width + padding > window.innerWidth) {
            targetLeft = bb.minX - rect.width - marginFromShape;
        }
        if (targetLeft < padding) {
            targetLeft = bb.minX + (bb.width / 2) - (rect.width / 2);
            targetTop = bb.maxY + marginFromShape;
        }
    }

    const finalLeft = Math.max(padding, Math.min(targetLeft, window.innerWidth - rect.width - padding));
    const finalTop = Math.max(padding, Math.min(targetTop, window.innerHeight - rect.height - padding));

    if (state.menu) {
        state.menu.style.left = `${finalLeft}px`;
        state.menu.style.top = `${finalTop}px`;
    }
    state.menuOpen = true; 
}

export function closeMenu(e) {
    if (e) e.stopPropagation();
    if (state.menu) state.menu.style.display = 'none';
    state.menuOpen = false;
    state.isDrawingCircle = false;
    state.isDrawingShape = false;
    state.gesturePoints = [];
    state.pendingMenuPoint = null;
    state.intersectionPoint = null;
    state.lastCirclePath = [];
    state.editingZone = null;
}

export function renderEffectMenu() {
    const grid = document.getElementById('effect-menu-grid');
    const title = document.getElementById('effect-menu-title');
    const backBtn = document.getElementById('menu-back-btn');
    
    const currentFolder = state.currentMenuStack[state.currentMenuStack.length - 1];
    
    if (title) title.textContent = currentFolder.label;
    if (backBtn) backBtn.style.display = state.currentMenuStack.length > 1 ? 'block' : 'none';
    
    if (!grid) return; 
    grid.innerHTML = '';
    
    currentFolder.children.forEach(item => {
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
            };
        }
        grid.appendChild(btn);
    });
}

export function updateExistingEffect(zone, newItem) {
    zone.id = newItem.id;
    zone.video = null;
    zone.image = null;
    zone.color = null;

    if (newItem.color) {
        zone.color = newItem.color;
    }

    if (newItem.videoPath) {
        const v = document.createElement('video');
        v.src = newItem.videoPath;
        v.muted = true;
        v.loop = true;
        v.play().catch(err => console.warn("Erro ao dar play no update:", err));
        zone.video = v;
    }

    if (zone.type === 'spell_object') {
        zone.rotateSpeed = newItem.rotateSpeed || 0;
        zone.opacity = newItem.opacity ?? 0.8;
        zone.fade = newItem.fade !== undefined ? newItem.fade : false; 
    }
}

export function menuGoBack(e) {
    if (e) e.stopPropagation();
    if (state.currentMenuStack.length > 1) {
        state.currentMenuStack.pop(); 
        renderEffectMenu();
    }
}