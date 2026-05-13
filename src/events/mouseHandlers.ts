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

        // ==========================================
        // MODO SELEÇÃO (Interagir com o que já existe)
        // ==========================================
        if (state.currentDrawMode === 'select') {
            
            // --- 1. DETECÇÃO DE CLIQUES NA ZONA JÁ EM EDIÇÃO ---
            if (state.editingZone) {
                // LÓGICA PARA CÍRCULOS (spell_object)
                if (state.editingZone.type === 'spell_object') {
                    // Posição da alça (na borda direita do círculo)
                    const handleX = state.editingZone.x + state.editingZone.radius;
                    const handleY = state.editingZone.y;
                    
                    // Verifica se clicou na Alça de Redimensionamento
                    if (Math.hypot(mouseX - handleX, mouseY - handleY) < 15) {
                        state.isResizing = true;
                        state.resizeStartPoint = { x: mouseX, y: mouseY };
                        if (state.menu) state.menu.style.display = 'none';
                        return; // INTERROMPE O FLUXO AQUI (encontrou ação)
                    }
                    
                    // Verifica se clicou dentro do Círculo para Arrastar
                    if (Math.hypot(mouseX - state.editingZone.x, mouseY - state.editingZone.y) <= state.editingZone.radius) {
                        state.isDraggingZone = true;
                        state.zoneDragStartPoint = { x: mouseX, y: mouseY };
                        state.originalSpellCenter = { x: state.editingZone.x, y: state.editingZone.y }; 
                        if (state.menu) state.menu.style.display = 'none';
                        return; // INTERROMPE AQUI
                    }
                } 
                // LÓGICA PARA POLÍGONOS (Pincel/Formas)
                else if (state.editingZone.path) {
                    const bb = getBoundingBox(state.editingZone.path);
                    const handles = [
                        {x: bb.minX, y: bb.minY}, {x: bb.maxX, y: bb.minY},
                        {x: bb.maxX, y: bb.maxY}, {x: bb.minX, y: bb.maxY}
                    ];
                    
                    // Verifica se clicou em uma das 4 Alças (cantos)
                    for (let i = 0; i < 4; i++) {
                        if (Math.hypot(mouseX - handles[i].x, mouseY - handles[i].y) < 15) {
                            state.isResizing = true;
                            state.resizeStartPoint = {x: mouseX, y: mouseY};
                            // Salva cópia do caminho original para cálculo de escala sem erro acumulado
                            state.originalEditPath = JSON.parse(JSON.stringify(state.editingZone.path));
                            if (state.menu) state.menu.style.display = 'none';
                            return; // INTERROMPE AQUI
                        }
                    }
                    
                    // Verifica se clicou dentro do Polígono para Arrastar
                    if (isPointInPolygon({x: mouseX, y: mouseY}, state.editingZone.path)) {
                        state.isDraggingZone = true;
                        state.zoneDragStartPoint = { x: mouseX, y: mouseY };
                        // Salva cópia do caminho original para cálculo de arraste
                        state.originalEditPath = JSON.parse(JSON.stringify(state.editingZone.path));
                        if (state.menu) state.menu.style.display = 'none';
                        return; // INTERROMPE AQUI
                    }
                }
                
                // Se chegou aqui, clicou no vazio enquanto editava, então desseleciona
                state.editingZone = null;
            }

            // --- 2. SELEÇÃO DE TOKEN (Personagem) ---
            const clickedCharacter = tools.getCharacterAtPosition(mouseX, mouseY);
            if (clickedCharacter) {
                state.selectedCharacter = clickedCharacter;
                tools.updateCharacterPanels();
                state.isDraggingToken = true;
                state.tokenDragStart = coords;
                state.tokenHasMoved = false;
                tools.closeCharacterMenu();
                return; // INTERROMPE AQUI
            }

            // --- 3. SELEÇÃO DE UMA NOVA ZONA ---
            for (let i = state.activeZones.length - 1; i >= 0; i--) {
                const zone = state.activeZones[i];
                let hit = false;
                if (zone.type === 'spell_object') {
                    hit = Math.hypot(mouseX - zone.x, mouseY - zone.y) <= zone.radius;
                } else if (zone.path && zone.path.length > 0) {
                    hit = isPointInPolygon({x: mouseX, y: mouseY}, zone.path);
                }

                if (hit) {
                    // Define como a zona ativa para edição e arraste imediato
                    state.editingZone = zone;
                    state.isDraggingZone = true; // Permite selecionar e já sair arrastando
                    state.zoneDragStartPoint = { x: mouseX, y: mouseY };

                    if (zone.type === 'spell_object') {
                        state.originalSpellCenter = { x: zone.x, y: zone.y };
                    } else {
                        state.originalEditPath = JSON.parse(JSON.stringify(zone.path));
                    }
                    
                    // Abre o menu radial (UDPATE: O menu abre no MOUSEUP para não quebrar o arraste)
                    // state.potentialZoneSelection = zone; // Opcional: Para abrir menu no mouseup
                    return; // INTERROMPE AQUI
                }
            }

            // --- 4. CLIQUE NO VAZIO NO MODO SELEÇÃO ---
            tools.closeCharacterMenu();
            state.selectedCharacter = null;
            if (state.menu) state.menu.style.display = 'none';
            return; // Fim do Modo Seleção
        }

        // ==========================================
        // MODO DESENHO (Criação, ignora o resto)
        // ==========================================
        // Limpeza cega de seleções
        tools.closeCharacterMenu();
        state.selectedCharacter = null;
        state.editingZone = null;
        if (state.menu) state.menu.style.display = 'none';

        if (state.currentDrawMode === 'spell_object') {
            // Salva o ponto para criar o objeto depois no mouseup
            state.pendingSpellPoint = { x: mouseX, y: mouseY };
        } 
        else if (state.currentDrawMode === 'brush') {
            state.isDrawingCircle = true;
            state.gesturePoints = [{ x: mouseX, y: mouseY }];
        } 
        else {
            // Square, Triangle, Line, etc.
            state.isDrawingShape = true;
            state.shapeStart = { x: mouseX, y: mouseY };
            state.shapeEnd = { x: mouseX, y: mouseY };
        }
    });

    window.addEventListener('mousemove', (e) => {
        // --- 1. ARRASTE DE MENUS ---
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
    
        // --- 2. ARRASTE DE TOKEN ---
        if (state.isDraggingToken && state.selectedCharacter) {
            if (state.tokenDragStart && Math.hypot(mouseX - state.tokenDragStart.x, mouseY - state.tokenDragStart.y) > 4) { 
                state.tokenHasMoved = true;
            }
            if (!state.tokenHasMoved) return;
            state.selectedCharacter.x = mouseX;
            state.selectedCharacter.y = mouseY;
            return;
        }
    
        // --- 3. REDIMENSIONAMENTO DE ZONA (RESIZING) ---
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

        // --- 4. ARRASTE DE ZONA ---
        if (state.isDraggingZone && state.editingZone) {
            const dx = mouseX - state.zoneDragStartPoint.x;  
            const dy = mouseY - state.zoneDragStartPoint.y;

            if (state.editingZone.type === 'spell_object') {
                state.editingZone.x = state.originalSpellCenter.x + dx;
                state.editingZone.y = state.originalSpellCenter.y + dy;
            } else if (state.editingZone.path) {
                state.editingZone.path = state.originalEditPath.map(p => ({ 
                    x: p.x + dx, 
                    y: p.y + dy 
                }));
            }
            return;
        }
    
        // --- 5. DESENHO DE FORMAS GEOMÉTRICAS ---
        if (state.isDrawingShape) {
            state.shapeEnd = { x: mouseX, y: mouseY };
            return;
        }

        // --- 6. PINCEL (BRUSH) CORRIGIDO ---
        if (state.isDrawingCircle) {
            // PROTEÇÃO: Se soltar o clique, o desenho para IMEDIATAMENTE
            if (e.buttons !== 1) {
                state.isDrawingCircle = false;
                state.gesturePoints = [];
                return;
            }

            const point = { x: mouseX, y: mouseY };
            const lastPoint = state.gesturePoints[state.gesturePoints.length - 1];
            
            // Suavização da linha
            if (!lastPoint || Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) > 3) {
                state.gesturePoints.push(point);
                state.lastCirclePath = state.gesturePoints;
            }
            return;
        }
    });
    
    window.addEventListener('mouseup', (e) => {
        // --- 1. ARRASTE DE INTERFACE ---
        if (state.isDraggingEffectMenu || state.isDraggingCharacterMenu) {
            state.isDraggingEffectMenu = false;
            state.isDraggingCharacterMenu = false;
            return;
        }

        // Ignora se o clique terminou em cima de algum menu aberto
        if ((e.target as HTMLElement).closest('.effect-menu-shell') || 
            (e.target as HTMLElement).closest('#side-menu') || 
            (e.target as HTMLElement).closest('#character-menu')) return;

        const coords = tools.getMapCoords(e);

        // --- 2. FINALIZA MODO SELEÇÃO (Arrastes e Edições) ---
        if (state.isResizing || state.isDraggingZone) {
            state.isResizing = false;
            state.isDraggingZone = false;
            
            // Reabre o menu da zona que acabou de ser movida/redimensionada
            if (state.editingZone) {
                state.currentMenuStack = state.editingZone.type === 'spell_object' ? [spellDatabase] : [menuDatabase];
                tools.renderEffectMenu();
                tools.showMenu(e.clientX, e.clientY, true);
            }
            return;
        }

        if (state.isDraggingToken) {
            state.isDraggingToken = false;
            // Se foi só um clique rápido (não arrastou), abre a ficha do personagem
            if (!state.tokenHasMoved && state.selectedCharacter) {
                tools.openCharacterMenu(state.selectedCharacter, e.clientX, e.clientY);
            }
            state.tokenDragStart = null;
            state.tokenHasMoved = false;
            return;
        }

        // --- 3. FINALIZA MODO DESENHO (Criação de novas áreas/magias) ---
        
        // A) Ferramenta Magia (Círculos Instantâneos)
        if (state.currentDrawMode === 'spell_object' && state.pendingSpellPoint) {
            state.currentMenuStack = [spellDatabase];
            tools.renderEffectMenu();
            tools.showMenu(e.clientX, e.clientY, false);
            // Não anulamos o pendingSpellPoint aqui pois o menu vai precisar dele para "spawnar" a magia
            return;
        }

        // B) Ferramenta Pincel (Brush Livre)
        if (state.isDrawingCircle) {
            state.isDrawingCircle = false; 

            if (state.gesturePoints.length > 5) {
                state.lastCirclePath = [...state.gesturePoints];
                state.currentMenuStack = [menuDatabase];
                tools.renderEffectMenu();
                tools.showMenu(e.clientX, e.clientY, false);
            }
            state.gesturePoints = []; 
            return;
        }

        // C) Formas Geométricas (Quadrado, Triângulo, etc)
        if (state.isDrawingShape) {
            state.isDrawingShape = false;
            const dist = Math.hypot(state.shapeEnd.x - state.shapeStart.x, state.shapeEnd.y - state.shapeStart.y);
            
            if (dist > 15) {
                state.lastCirclePath = generateShapePath(state.currentDrawMode, state.shapeStart, state.shapeEnd);
                state.currentMenuStack = [menuDatabase];
                tools.renderEffectMenu();
                tools.showMenu(e.clientX, e.clientY, false);
            }
            return;
        }

        // Limpeza de segurança final
        state.mouseDownTarget = null;
        state.mouseDownPoint = null;
    });
}