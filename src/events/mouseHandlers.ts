// src/events/mouseHandlers.ts
import { menuDatabase } from "../data/menu";
import { spellDatabase } from "../data/spells";
import { generateShapePath, isPointInPolygon } from "../utils/math";
import { gizmo } from '../engine/transformGizmo';

// ─────────────────────────────────────────────────────────────────────────────
// TEXTO INLINE
// ─────────────────────────────────────────────────────────────────────────────
function spawnTextInput(clientX: number, clientY: number, mapX: number, mapY: number, state: any) {
    if (document.getElementById('canvas-text-input')) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'canvas-text-input';
    input.placeholder = "Digite...";

    const titleFont  = "'SuaFonteDeTitulo', serif";
    const titleColor = '#f0b030';

    Object.assign(input.style, {
        position:   'absolute',
        left:       `${clientX}px`,
        top:        `${clientY - 12}px`,
        fontSize:   '24px',
        fontFamily: titleFont,
        color:      titleColor,
        background: 'transparent',
        border:     'none',
        outline:    'none',
        zIndex:     '1000',
        minWidth:   '250px',
        textShadow: '-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000,0 2px 4px rgba(0,0,0,.8)',
    });

    document.body.appendChild(input);
    setTimeout(() => input.focus(), 10);

    let finished = false
    
    function finishEditing() {
        if (finished) return
        finished = true
        
        const maxLength = 18;
        const text = input.value.trim()
        if (text) {
            state.activeZones.push({
                type: 'text', text, x: mapX, y: mapY,
                name: text.length > maxLength ? text.substring(0, maxLength) + "..." : text,
                category: 'Texto',
                fontSize: 24, rotation: 0,
                color: titleColor, fontFamily: titleFont,
            })
        }

        input.remove()
        if (typeof (window as any).renderLayersList === 'function') {
            (window as any).renderLayersList();
        }
    }

    input.addEventListener('blur', finishEditing)
    input.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); finishEditing() }
        if (e.key === 'Escape') { finished = true; input.remove() }
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// HIT-TEST DE ZONA — retorna true se o ponto (mx, my) está dentro da zona
// ─────────────────────────────────────────────────────────────────────────────
function hitTestZone(zone: any, mx: number, my: number): boolean {
    if (zone.type === 'spell_object') {
        return Math.hypot(mx - zone.x, my - zone.y) <= zone.radius
    }
    if (zone.path && zone.path.length > 0) {
        return isPointInPolygon({ x: mx, y: my }, zone.path)
    }
    if (zone.type === 'text') {
        const width = (zone.text.length * zone.fontSize) * 0.6
        return Math.abs(mx - zone.x) < width / 2 && Math.abs(my - zone.y) < zone.fontSize / 2
    }
    return false
}

// ─────────────────────────────────────────────────────────────────────────────
// SELECIONA ZONA — aplica estado de edição e gizmo
// ─────────────────────────────────────────────────────────────────────────────
function selectZone(zone: any, mx: number, my: number, state: any) {
    state.editingZone        = zone
    state.isDraggingZone     = true
    state.zoneDragStartPoint = { x: mx, y: my }
    gizmo.attach(zone)

    if (zone.type === 'spell_object' || zone.type === 'text') {
        state.originalSpellCenter = { x: zone.x, y: zone.y }
    } else {
        state.originalEditPath = JSON.parse(JSON.stringify(zone.path))
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────
export function initMouseEvents(canvas: HTMLCanvasElement, _unusedCtx: any, state: any, tools: any) {

    // ── MOUSEDOWN ────────────────────────────────────────────────────────────
    window.addEventListener('mousedown', (e: MouseEvent) => {
        if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
        if ((e.target as HTMLElement)?.id === 'canvas-text-input') return;

        if (state.sideMenu?.contains(e.target)     ||
            state.characterMenu?.contains(e.target) ||
            state.menu?.contains(e.target)) return;

        const coords = tools.getMapCoords(e);
        const mx = coords.x;
        const my = coords.y;
        state.mouseDownPoint = coords;

        if (state.currentDrawMode === 'select') {

            // 1. Gizmo (Handles de redimensionamento/rotação)
            if (gizmo.hitsHandle(mx, my)) return;

            // 2. Tokens (Personagens)
            const clickedCharacter = tools.getCharacterAtPosition(mx, my);
            if (clickedCharacter) {
                state.selectedCharacter = clickedCharacter;
                tools.updateCharacterPanels();
                state.isDraggingToken   = true;
                state.tokenDragStart    = coords;
                state.tokenHasMoved     = false;
                tools.closeCharacterMenu();
                gizmo.detach();
                return;
            }

            // 3. Zonas / Efeitos (SISTEMA DE CAMADAS)
            let hitZone = false;

            // PRIORIDADE 1: Testa Spells (O mais recente/em cima primeiro)
            for (let i = state.activeZones.length - 1; i >= 0; i--) {
                const zone = state.activeZones[i];
                
                // REGRAS DE CAMADA: Ignora se invisível ou travado
                if (zone.type !== 'spell_object' || zone.visible === false || zone.locked) continue;

                if (hitTestZone(zone, mx, my)) {
                    selectZone(zone, mx, my, state);
                    hitZone = true;
                    break;
                }
            }

            // PRIORIDADE 2: Testa Áreas/Texto (Se nenhum spell foi clicado)
            if (!hitZone) {
                for (let i = state.activeZones.length - 1; i >= 0; i--) {
                    const zone = state.activeZones[i];
                    
                    // REGRAS DE CAMADA: Ignora se invisível, travado ou se for spell
                    if (zone.type === 'spell_object' || zone.visible === false || zone.locked) continue;

                    if (hitTestZone(zone, mx, my)) {
                        selectZone(zone, mx, my, state);
                        hitZone = true;
                        break;
                    }
                }
            }

            // Se clicou no vazio, limpa seleções e atualiza a lista de camadas
            if (!hitZone) {
                state.selectedCharacter = null;
                state.editingZone       = null;
                gizmo.detach();
            }

            // Atualiza a UI do painel lateral para mostrar qual camada está selecionada
            if (typeof (window as any).renderLayersList === 'function') {
                (window as any).renderLayersList();
            }
            
            return;
        }

        // ── MODOS DE DESENHO ─────────────────────────────────────────────────
        if (state.currentDrawMode === 'text') {
            spawnTextInput(e.clientX, e.clientY, mx, my, state);
            return;
        }
        if (state.currentDrawMode === 'spell_object') {
            state.pendingSpellPoint = { x: mx, y: my };
        } else if (state.currentDrawMode === 'brush') {
            state.isDrawingCircle = true;
            state.gesturePoints   = [{ x: mx, y: my }];
        } else {
            state.isDrawingShape = true;
            state.shapeStart     = { x: mx, y: my };
            state.shapeEnd       = { x: mx, y: my };
        }
    });

    // ── MOUSEMOVE ─────────────────────────────────────────────────────────────
    window.addEventListener('mousemove', (e: MouseEvent) => {

        if (state.isDraggingCharacterMenu) {
            const p = 12;
            state.characterMenu.style.left = `${clamp(e.clientX - state.characterMenuDragOffset.x, p, window.innerWidth  - (state.characterMenuShell?.offsetWidth  || 300) - p)}px`;
            state.characterMenu.style.top  = `${clamp(e.clientY - state.characterMenuDragOffset.y, p, window.innerHeight - (state.characterMenuShell?.offsetHeight || 400) - p)}px`;
            return;
        }
        if (state.isDraggingEffectMenu) {
            const shell = document.querySelector('.effect-menu-shell') as HTMLElement | null;
            if (shell && state.menu) {
                const p = 12;
                state.menu.style.left = `${clamp(e.clientX - state.effectMenuDragOffset.x, p, window.innerWidth  - shell.offsetWidth  - p)}px`;
                state.menu.style.top  = `${clamp(e.clientY - state.effectMenuDragOffset.y, p, window.innerHeight - shell.offsetHeight - p)}px`;
            }
            return;
        }

        const coords = tools.getMapCoords(e);
        const mx = coords.x;
        const my = coords.y;

        if (state.isDraggingToken && state.selectedCharacter) {
            if (state.tokenDragStart && Math.hypot(mx - state.tokenDragStart.x, my - state.tokenDragStart.y) > 4) {
                state.tokenHasMoved = true;
            }
            if (!state.tokenHasMoved) return;
            state.selectedCharacter.x = mx;
            state.selectedCharacter.y = my;
            return;
        }

        if (state.isRotating && state.editingZone) {
            if (state.editingZone.type === 'text') {
                state.editingZone.rotation = Math.atan2(my - state.editingZone.y, mx - state.editingZone.x) + Math.PI / 2;
            } else if (state.editingZone.path && state.rotateCenter && state.rotateOriginalPath) {
                const currentAngle = Math.atan2(my - state.rotateCenter.y, mx - state.rotateCenter.x);
                const delta = currentAngle - state.rotateStartAngle;
                const cos   = Math.cos(delta);
                const sin   = Math.sin(delta);
                const { x: cx, y: cy } = state.rotateCenter;
                state.editingZone.path = state.rotateOriginalPath.map((p: any) => ({
                    x: cx + (p.x - cx) * cos - (p.y - cy) * sin,
                    y: cy + (p.x - cx) * sin + (p.y - cy) * cos,
                }));
            }
            return;
        }

        if (state.isResizing && state.editingZone) {
            if (state.editingZone.type === 'spell_object') {
                state.editingZone.radius = Math.max(20, Math.hypot(mx - state.editingZone.x, my - state.editingZone.y));
            } else if (state.editingZone.path && state.originalEditPath) {
                const bb     = getBoundingBox(state.originalEditPath);
                const center = { x: bb.minX + bb.width / 2, y: bb.minY + bb.height / 2 };
                const oldDist = Math.hypot(state.resizeStartPoint.x - center.x, state.resizeStartPoint.y - center.y);
                const newDist = Math.max(10, Math.hypot(mx - center.x, my - center.y));
                const scale   = newDist / oldDist;
                state.editingZone.path = state.originalEditPath.map((p: any) => ({
                    x: center.x + (p.x - center.x) * scale,
                    y: center.y + (p.y - center.y) * scale,
                }));
            } else if (state.editingZone.type === 'text') {
                const dx    = mx - state.editingZone.x;
                const dy    = my - state.editingZone.y;
                const angle = -(state.editingZone.rotation || 0);
                const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
                const localY = dx * Math.sin(angle) + dy * Math.cos(angle);
                const oldDist = Math.hypot(state.resizeStartPoint.x - state.editingZone.x, state.resizeStartPoint.y - state.editingZone.y);
                const newDist = Math.max(10, Math.hypot(localX, localY));
                state.editingZone.fontSize = clamp(state.originalFontSize * (newDist / oldDist), 10, 150);
            }
            return;
        }

        if (state.isDraggingZone && state.editingZone) {
            const dx = mx - state.zoneDragStartPoint.x;
            const dy = my - state.zoneDragStartPoint.y;
            if (state.editingZone.type === 'spell_object' || state.editingZone.type === 'text') {
                state.editingZone.x = state.originalSpellCenter.x + dx;
                state.editingZone.y = state.originalSpellCenter.y + dy;
            } else if (state.editingZone.path) {
                state.editingZone.path = state.originalEditPath.map((p: any) => ({
                    x: p.x + dx, y: p.y + dy,
                }));
            }
            return;
        }

        if (state.isDrawingShape) { state.shapeEnd = { x: mx, y: my }; return; }

        if (state.isDrawingCircle) {
            if (e.buttons !== 1) { state.isDrawingCircle = false; state.gesturePoints = []; return; }
            const last = state.gesturePoints[state.gesturePoints.length - 1];
            if (!last || Math.hypot(mx - last.x, my - last.y) > 3) {
                state.gesturePoints.push({ x: mx, y: my });
                state.lastCirclePath = state.gesturePoints;
            }
        }
    });

    // ── MOUSEUP ───────────────────────────────────────────────────────────────
    window.addEventListener('mouseup', (e: MouseEvent) => {
        if (state.isDraggingEffectMenu || state.isDraggingCharacterMenu) {
            state.isDraggingEffectMenu    = false;
            state.isDraggingCharacterMenu = false;
            return;
        }

        if ((e.target as HTMLElement).closest?.('.effect-menu-shell') ||
            (e.target as HTMLElement).closest?.('#side-menu')         ||
            (e.target as HTMLElement).closest?.('#character-menu'))    return;

        if (state.isDraggingZone) {
            state.isDraggingZone = false;
            if (state.editingZone && state.editingZone.type !== 'text') {
                state.currentMenuStack = state.editingZone.type === 'spell_object'
                    ? [spellDatabase] : [menuDatabase];
                tools.renderEffectMenu();
                tools.showMenu(e.clientX, e.clientY, true);
            }
            return;
        }

        if (state.isDraggingToken) {
            state.isDraggingToken = false;
            if (!state.tokenHasMoved && state.selectedCharacter) {
                tools.openCharacterMenu(state.selectedCharacter, e.clientX, e.clientY);
            }
            state.tokenDragStart = null;
            state.tokenHasMoved  = false;
            return;
        }

        if (state.currentDrawMode === 'spell_object' && state.pendingSpellPoint) {
            state.currentMenuStack = [spellDatabase];
            tools.renderEffectMenu();
            tools.showMenu(e.clientX, e.clientY, false);
            return;
        }

        if (state.isDrawingCircle) {
            state.isDrawingCircle = false;
            if (state.gesturePoints.length > 5) {
                state.lastCirclePath   = [...state.gesturePoints];
                state.currentMenuStack = [menuDatabase];
                tools.renderEffectMenu();
                tools.showMenu(e.clientX, e.clientY, false);
            }
            state.gesturePoints = [];
            return;
        }

        if (state.isDrawingShape) {
            state.isDrawingShape = false;
            const dist = Math.hypot(state.shapeEnd.x - state.shapeStart.x, state.shapeEnd.y - state.shapeStart.y);
            if (dist > 15) {
                state.lastCirclePath   = generateShapePath(state.currentDrawMode, state.shapeStart, state.shapeEnd);
                state.currentMenuStack = [menuDatabase];
                tools.renderEffectMenu();
                tools.showMenu(e.clientX, e.clientY, false);
            }
            return;
        }

        state.mouseDownTarget = null;
        state.mouseDownPoint  = null;
    });

    // ── KEYDOWN ───────────────────────────────────────────────────────────────
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        if ((e.key === 'Delete' || e.key === 'Backspace') &&
            state.editingZone && state.currentDrawMode === 'select') {
            if ((document.activeElement as HTMLElement)?.tagName === 'INPUT') return;
            state.activeZones = state.activeZones.filter((z: any) => z !== state.editingZone);
            state.editingZone = null;
            if (state.menu) state.menu.style.display = 'none';
            gizmo.detach();
        }
    });

    window.addEventListener('DOMContentLoaded', () => {
        if (typeof (window as any).setTool === 'function') (window as any).setTool('select');
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number) { return Math.min(Math.max(v, min), max); }

function getBoundingBox(path: {x:number,y:number}[]) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    path.forEach(p => {
        if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
    });
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function getBoundingBoxCenter(path: {x:number,y:number}[]) {
    const bb = getBoundingBox(path);
    return { x: bb.minX + bb.width / 2, y: bb.minY + bb.height / 2 };
}