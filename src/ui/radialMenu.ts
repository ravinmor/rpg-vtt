import { menuDatabase } from '../data/menu';
import { spellDatabase } from '../data/spells';
import { createVideo } from '../utils/videos';

export let menuOpen = false;
export let currentMenuStack = [menuDatabase];

export function showMenu(x, y, isEditing, editingZone, currentDrawMode, lastCirclePath, getBoundingBox, applySpellObject, setEffect) {
    const menu = document.getElementById('radial-menu');
    if (!menu) return;

    if (!menuOpen) {
        currentMenuStack = currentDrawMode === 'spell_object' ? [spellDatabase] : [menuDatabase];
    }

    renderEffectMenu(editingZone, currentDrawMode, applySpellObject, setEffect);

    menu.style.display = 'block';
    const delBtn = document.getElementById('menu-delete-btn');
    if (delBtn) delBtn.style.display = isEditing ? 'block' : 'none';

    const rect = menu.getBoundingClientRect();
    let targetLeft = x;
    let targetTop = y;

    const activePath = editingZone ? editingZone.path : (lastCirclePath.length > 0 ? lastCirclePath : null);

    if (activePath && currentDrawMode !== 'spell_object' && getBoundingBox) {
        const bb = getBoundingBox(activePath);
        targetLeft = bb.maxX + 40;
        targetTop = bb.minY + (bb.height / 2) - (rect.height / 2);
    }

    menu.style.left = `${Math.max(20, Math.min(targetLeft, window.innerWidth - rect.width - 20))}px`;
    menu.style.top = `${Math.max(20, Math.min(targetTop, window.innerHeight - rect.height - 20))}px`;
    menuOpen = true;
}

export function closeMenu() {
    const menu = document.getElementById('radial-menu');
    if (menu) menu.style.display = 'none';
    menuOpen = false;
}

export function renderEffectMenu(editingZone, currentDrawMode, applySpellObject, setEffect) {
    const grid = document.getElementById('effect-menu-grid');
    const title = document.getElementById('effect-menu-title');
    const backBtn = document.getElementById('menu-back-btn');
    if (!grid) return;

    const currentFolder = currentMenuStack[currentMenuStack.length - 1];
    if (title) title.textContent = currentFolder.label;
    if (backBtn) backBtn.style.display = currentMenuStack.length > 1 ? 'block' : 'none';
    
    grid.innerHTML = '';
    
    currentFolder.children.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'menu-item';
        btn.innerHTML = `<span>${item.icon}</span><label>${item.label}</label>`;
        
        btn.onclick = (e) => {
            e.stopPropagation();
            if (item.type === 'folder') {
                currentMenuStack.push(item);
                renderEffectMenu(editingZone, currentDrawMode, applySpellObject, setEffect);
            } else {
                if (editingZone) {
                    updateExistingEffect(editingZone, item);
                } else if (currentDrawMode === 'spell_object') {
                    applySpellObject(item);
                } else {
                    setEffect(item, e);
                }
                closeMenu();
            }
        };
        grid.appendChild(btn);
    });
}

function updateExistingEffect(zone, newItem) {
    zone.id = newItem.id;
    zone.video = null; zone.image = null; zone.color = null;
    if (newItem.color) zone.color = newItem.color;
    if (newItem.videoPath) {
        const v = createVideo(newItem.videoPath);
        v.play().catch(() => {});
        zone.video = v;
    }
}

export function menuGoBack(editingZone, currentDrawMode, applySpellObject, setEffect) {
    if (currentMenuStack.length > 1) {
        currentMenuStack.pop();
        renderEffectMenu(editingZone, currentDrawMode, applySpellObject, setEffect);
    }
}