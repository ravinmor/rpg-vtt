// src/events/mouseHandlers.ts

import { menuDatabase } from "../data/menu";
import { spellDatabase } from "../data/spells";
import { checkIntersection, generateShapePath, getBoundingBox, isPointInPolygon } from "../utils/math";

export function initMouseEvents(canvas, ctx, state, tools) {
    
    window.addEventListener('mousedown', (e) => {
        if (state.sideMenu.contains(e.target) || 
            state.characterMenu.contains(e.target) || 
            state.menu.contains(e.target)) return;

        const coords = tools.getMapCoords(e);
        const mouseX = coords.x;
        const mouseY = coords.y;
        state.mouseDownPoint = coords;

        // --- LÓGICA DE EDIÇÃO DE ZONA ---
        if (state.editingZone) {
            if (state.editingZone.type === 'spell_object') {
                const handleX = state.editingZone.x + state.editingZone.radius;
                const handleY = state.editingZone.y;
                if (Math.hypot(mouseX - handleX, mouseY - handleY) < 15) {
                    state.isResizing = true;
                    state.resizeStartPoint = { x: mouseX, y: mouseY };
                    state.menu.style.display = 'none';
                    return;
                }
                if (Math.hypot(mouseX - state.editingZone.x, mouseY - state.editingZone.y) <= state.editingZone.radius) {
                    state.isDraggingZone = true;
                    state.zoneDragStartPoint = { x: mouseX, y: mouseY };
                    state.originalSpellCenter = { x: state.editingZone.x, y: state.editingZone.y }; 
                    state.menu.style.display = 'none';
                    return;
                }
            } else if (state.editingZone.path) {
                const bb = getBoundingBox(state.editingZone.path);
                const handles = [
                    {x: bb.minX, y: bb.minY}, {x: bb.maxX, y: bb.minY},
                    {x: bb.maxX, y: bb.maxY}, {x: bb.minX, y: bb.maxY}
                ];
                for (let i = 0; i < 4; i++) {
                    if (Math.hypot(mouseX - handles[i].x, mouseY - handles[i].y) < 15) {
                        state.isResizing = true;
                        state.resizeStartPoint = {x: mouseX, y: mouseY};
                        state.originalEditPath = JSON.parse(JSON.stringify(state.editingZone.path));
                        state.menu.style.display = 'none';
                        return;
                    }
                }
                if (isPointInPolygon({x: mouseX, y: mouseY}, state.editingZone.path)) {
                    state.isDraggingZone = true;
                    state.zoneDragStartPoint = { x: mouseX, y: mouseY };
                    state.originalEditPath = JSON.parse(JSON.stringify(state.editingZone.path));
                    state.menu.style.display = 'none';
                    return;
                }
            }
            state.editingZone = null;
        }

        // --- SELEÇÃO DE TOKEN ---
        const clickedCharacter = tools.getCharacterAtPosition(mouseX, mouseY);
        if (clickedCharacter) {
            state.selectedCharacter = clickedCharacter;
            tools.updateCharacterPanels();
            state.isDraggingToken = true;
            state.tokenDragStart = coords;
            state.tokenHasMoved = false;
            state.mouseDownTarget = 'character';
            tools.closeCharacterMenu();
            return;
        }

        // --- CLIQUE EM ZONA EXISTENTE ---
        let clickedZone = null;
        for (let i = state.activeZones.length - 1; i >= 0; i--) {
            const zone = state.activeZones[i];
            
            if (zone.type === 'spell_object') {
                // NOVO: Só deixa selecionar magias se a ferramenta for Magia
                if (state.currentDrawMode === 'spell_object') {
                    if (Math.hypot(mouseX - zone.x, mouseY - zone.y) <= zone.radius) {
                        clickedZone = zone;
                        break;
                    }
                }
            } else if (zone.path && zone.path.length > 0) {
                // NOVO: Só deixa selecionar áreas desenhadas se NÃO estiver na ferramenta Magia
                if (state.currentDrawMode !== 'spell_object') {
                    ctx.beginPath();
                    ctx.moveTo(zone.path[0].x, zone.path[0].y);
                    zone.path.forEach(p => ctx.lineTo(p.x, p.y));
                    if (ctx.isPointInPath(mouseX, mouseY)) {
                        clickedZone = zone;
                        break;
                    }
                }
            }
        }

        if (clickedZone) {
            state.mouseDownTarget = 'zone';
            return;
        }

        state.mouseDownTarget = 'canvas';
        tools.closeCharacterMenu();
        state.selectedCharacter = null;
        tools.renderSideCharacterStatuses(null);

        if (state.currentDrawMode === 'spell_object') {
            state.pendingSpellPoint = { x: mouseX, y: mouseY };
            return; // Menu abre no mouseup
        }

        if (state.currentDrawMode !== 'brush') {
            state.isDrawingShape = true;
            state.shapeStart = { x: mouseX, y: mouseY };
            state.shapeEnd = { x: mouseX, y: mouseY };
            return;
        }

        state.isDrawingCircle = true;
        state.gesturePoints = [{ x: mouseX, y: mouseY }];
        state.intersectionPoint = null;
        state.pendingMenuPoint = null;
    });

    window.addEventListener('mousemove', (e) => {
        if (state.isDraggingCharacterMenu) {
            const padding = 12;
            const left = Math.min(Math.max(e.clientX - state.characterMenuDragOffset.x, padding), window.innerWidth - state.characterMenuShell.offsetWidth - padding);
            const top = Math.min(Math.max(e.clientY -  state.characterMenuDragOffset.y, padding), window.innerHeight - state.characterMenuShell.offsetHeight - padding);
            state.characterMenu.style.left = `${left}px`;
            state.characterMenu.style.top = `${top}px`;
            return;
        }
    
        if (state.isDraggingEffectMenu) {
            const padding = 12;
            const shell = document.querySelector('.effect-menu-shell');
            if (shell) {
                const left = Math.min(Math.max(e.clientX - state.effectMenuDragOffset.x, padding), window.innerWidth - shell.offsetWidth - padding);
                const top = Math.min(Math.max(e.clientY - state.effectMenuDragOffset.y, padding), window.innerHeight - shell.offsetHeight - padding);
                state.menu.style.left = `${left}px`;
                state.menu.style.top = `${top}px`;
            }
            return;
        }
    
        const coords = tools.getMapCoords(e);
        const mouseX = coords.x;
        const mouseY = coords.y;
    
        if (state.isDraggingToken && state.selectedCharacter) {
            if (state.tokenDragStart && Math.hypot(mouseX - state.tokenDragStart.x, mouseY - state.tokenDragStart.y) > 4) { 
                state.tokenHasMoved = true;
            }
            if (!state.tokenHasMoved) return;
            state.selectedCharacter.x = mouseX;
            state.selectedCharacter.y = mouseY;
            return;
        }
    
        if (state.isResizing && state.editingZone) {
            if (state.editingZone.type === 'spell_object') {
                const newRadius = Math.hypot(mouseX - state.editingZone.x, mouseY - state.editingZone.y);
                state.editingZone.radius = Math.max(20, newRadius);
            } 
            else if (state.editingZone.path) {
                const bb = getBoundingBox(state.originalEditPath);
                const center = { x: bb.minX + bb.width / 2, y: bb.minY + bb.height / 2 };
                const oldDist = Math.hypot(state.resizeStartPoint.x - center.x, state.resizeStartPoint.y - center.y);
                const newDist = Math.max(10, Math.hypot(mouseX - center.x, mouseY - center.y));
                const scale = newDist / oldDist;
    
                state.editingZone.path = state.originalEditPath.map(p => ({
                    x: center.x + (p.x - center.x) * scale,
                    y: center.y + (p.y - center.y) * scale
                }));
            }
            return;
        }
    
        if (state.isDraggingZone && state.editingZone) {
            const dx = mouseX - state.zoneDragStartPoint.x;  
            const dy = mouseY - state.zoneDragStartPoint.y;
            if (state.editingZone.type === 'spell_object') {
              state.editingZone.x = state.originalSpellCenter.x + dx;
              state.editingZone.y = state.originalSpellCenter.y + dy;
            } else if (state.editingZone.path) {
                state.editingZone.path = state.originalEditPath.map(p => ({ x: p.x + dx, y: p.y + dy }));
            }
            return;
        }
    
        if (state.isDrawingShape) {
            state.shapeEnd = { x: mouseX, y: mouseY };
            return;
        }
    
        if (!state.isDrawingCircle || state.menuOpen) return;
        const point = { x: mouseX, y: mouseY };
        
        if (state.gesturePoints.length > 40) {
            const segA = { p1: state.gesturePoints[state.gesturePoints.length - 1], p2: point };
            const skipCount = Math.max(20, Math.floor(state.gesturePoints.length * 0.25));
    
            for (let i = 0; i < state.gesturePoints.length - skipCount; i++) {
                const segB = { p1: state.gesturePoints[i], p2: state.gesturePoints[i + 1] };
                const intersect = checkIntersection(segA, segB);
                if (intersect) {
                    state.lastCirclePath = state.gesturePoints.slice(i);
                    state.intersectionPoint = intersect;
                    state.pendingMenuPoint = intersect;
                    return;
                }
            }
        }
        state.gesturePoints.push(point);
    });
    
    window.addEventListener('mouseup', (e) => {
        if (state.isDraggingEffectMenu || state.isDraggingCharacterMenu) {
            state.isDraggingEffectMenu = false;
            state.isDraggingCharacterMenu = false;
            return;
        }
    
        if ((e.target as HTMLElement).closest('.effect-menu-shell') || (e.target as HTMLElement).closest('#side-menu')) return;
    
        if (state.isResizing || state.isDraggingZone) {
            state.isResizing = false;
            state.isDraggingZone = false;
            if (state.editingZone && state.editingZone.type === 'spell_object') {
                state.currentMenuStack = [spellDatabase];
            } else {
                state.currentMenuStack = [menuDatabase];
            }
            tools.renderEffectMenu();
            tools.showMenu(e.clientX, e.clientY, true);
            return;
        }
    
        if (state.isDraggingToken) {
            state.isDraggingToken = false;
            if (!state.tokenHasMoved && state.selectedCharacter) {
                tools.openCharacterMenu(state.selectedCharacter, e.clientX, e.clientY);
            }
            state.tokenDragStart = null;
            state.tokenHasMoved = false;
            return;
        }
    
        const coords = tools.getMapCoords(e);
        const mouseX = coords.x;
        const mouseY = coords.y;
    
        if (state.mouseDownTarget === 'zone' && state.mouseDownPoint) {
            const moved = Math.hypot(mouseX - state.mouseDownPoint.x, mouseY - state.mouseDownPoint.y);
            if (moved < 5) {
                for (let i = state.activeZones.length - 1; i >= 0; i--) {
                    const zone = state.activeZones[i];
                    let hit = false;
                    
                    if (zone.type === 'spell_object') {
                        // NOVO: Proteção
                        if (state.currentDrawMode === 'spell_object') {
                            hit = Math.hypot(mouseX - zone.x, mouseY - zone.y) <= zone.radius;
                        }
                    } else if (zone.path && zone.path.length > 0) {
                        // NOVO: Proteção
                        if (state.currentDrawMode !== 'spell_object') {
                            ctx.beginPath();
                            ctx.moveTo(zone.path[0].x, zone.path[0].y);
                            zone.path.forEach(p => ctx.lineTo(p.x, p.y));
                            hit = ctx.isPointInPath(mouseX, mouseY);
                        }
                    }
                    
                    if (hit) {
                        state.editingZone = zone;
                        state.currentMenuStack = zone.type === 'spell_object' ? [spellDatabase] : [menuDatabase];
                        tools.renderEffectMenu();
                        tools.showMenu(e.clientX, e.clientY, true);
                        break;
                    }
                }
            }
            state.mouseDownTarget = null;
            state.mouseDownPoint = null;
            return;
        }
    
        if (state.mouseDownTarget === 'canvas' && state.currentDrawMode === 'spell_object') {
            state.currentMenuStack = [spellDatabase];
            tools.renderEffectMenu();
            tools.showMenu(e.clientX, e.clientY, false);
            state.mouseDownTarget = null;
            state.mouseDownPoint = null;
            return;
        }
    
        if (state.isDrawingShape) {
            state.isDrawingShape = false;
            if (state.shapeStart && state.shapeEnd && Math.hypot(state.shapeEnd.x - state.shapeStart.x, state.shapeEnd.y - state.shapeStart.y) > 20) {
                state.lastCirclePath = generateShapePath(state.currentDrawMode, state.shapeStart, state.shapeEnd);
                state.currentMenuStack = [menuDatabase];
                tools.renderEffectMenu();
                // Corrigido: usando e.clientX direto ao invés de horizPos
                tools.showMenu(e.clientX, e.clientY, false);
            }
            state.mouseDownTarget = null;
            state.mouseDownPoint = null;
            return;
        }
    
        if (!state.menuOpen && state.isDrawingCircle) {
            if (state.pendingMenuPoint) {
                state.currentMenuStack = [menuDatabase];
                tools.renderEffectMenu();
                tools.showMenu(e.clientX, e.clientY, false);
            } else {
                state.isDrawingCircle = false;
                state.gesturePoints = [];
                state.intersectionPoint = null;
                state.lastCirclePath = [];
            }
        }
    
        state.mouseDownTarget = null;
        state.mouseDownPoint = null;
    });
}