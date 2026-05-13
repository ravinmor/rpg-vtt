// src/events/mouseHandlers.ts

import { menuDatabase } from "../data/menu";
import { spellDatabase } from "../data/spells";
import { checkIntersection, generateShapePath, getBoundingBox, isPointInPolygon } from "../utils/math";

function spawnTextInput(clientX, clientY, mapX, mapY, state) {
    if (document.getElementById('canvas-text-input')) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'canvas-text-input';
    input.placeholder = "Digite...";
    
    // VARIÁVEIS DO SEU TÍTULO (Altere aqui para o nome da sua fonte real)
    const titleFont = "'SuaFonteDeTitulo', serif"; 
    const titleColor = '#f0b030'; // Ex: Dourado. Altere para a sua cor.

    input.style.position = 'absolute';
    input.style.left = `${clientX}px`;
    input.style.top = `${clientY - 12}px`;
    input.style.fontSize = '24px';
    
    // APLICANDO A ESTILIZAÇÃO DO TÍTULO NO INPUT
    input.style.fontFamily = titleFont;
    input.style.color = titleColor;
    input.style.background = 'transparent'; // Fundo invisível para focar no texto
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.zIndex = '1000';
    input.style.minWidth = '250px';
    
    // Truque em CSS para criar a "borda fina preta" ao redor das letras HTML
    input.style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0px 2px 4px rgba(0,0,0,0.8)';

    document.body.appendChild(input);

    setTimeout(() => {
        input.focus();
    }, 10);

    function finishEditing() {
        const text = input.value.trim();
        if (text) {
            state.activeZones.push({
                type: 'text',
                text: text,
                x: mapX, 
                y: mapY,
                fontSize: 24,
                rotation: 0, 
                color: titleColor,
                fontFamily: titleFont
            });
        }
        input.remove();

        // NOVA LINHA: Volta automaticamente para a ferramenta de Seleção
        if (typeof window.setTool === 'function') window.setTool('select');
    }

    input.addEventListener('blur', finishEditing);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            finishEditing();
        }
        if (e.key === 'Escape') input.remove(); 
    });
}

export function initMouseEvents(canvas, ctx, state, tools) {
    
    window.addEventListener('mousedown', (e) => {
        if (e.target && e.target.id === 'canvas-text-input') return;

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
                
                // A) LÓGICA PARA TEXTOS
                if (state.editingZone.type === 'text') {
                    ctx.font = `bold ${state.editingZone.fontSize}px ${state.editingZone.fontFamily || 'Arial'}`;
                    const width = ctx.measureText(state.editingZone.text).width;
                    const height = state.editingZone.fontSize;
                    const hw = width / 2;
                    const hh = height / 2;

                    const dx = mouseX - state.editingZone.x;
                    const dy = mouseY - state.editingZone.y;
                    const angle = -(state.editingZone.rotation || 0);
                    const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
                    const localY = dx * Math.sin(angle) + dy * Math.cos(angle);

                    // Deletar (X Vermelho)
                    if (Math.hypot(localX - (hw + 10), localY - (-hh - 10)) < 15) {
                        state.activeZones = state.activeZones.filter(z => z !== state.editingZone);
                        state.editingZone = null;
                        if (state.menu) state.menu.style.display = 'none';
                        return;
                    }
                    // Rotacionar (Topo)
                    if (Math.hypot(localX - 0, localY - (-hh - 30)) < 15) {
                        state.isRotating = true; 
                        if (state.menu) state.menu.style.display = 'none';
                        return;
                    }
                    // Redimensionar (Canto)
                    if (Math.hypot(localX - (hw + 6), localY - (hh + 6)) < 15) {
                        state.isResizing = true;
                        state.resizeStartPoint = { x: mouseX, y: mouseY };
                        state.originalFontSize = state.editingZone.fontSize;
                        if (state.menu) state.menu.style.display = 'none';
                        return;
                    }
                    // Arrastar
                    if (Math.abs(localX) <= hw + 8 && Math.abs(localY) <= hh + 8) {
                        state.isDraggingZone = true;
                        state.zoneDragStartPoint = { x: mouseX, y: mouseY };
                        state.originalSpellCenter = { x: state.editingZone.x, y: state.editingZone.y };
                        if (state.menu) state.menu.style.display = 'none';
                        return;
                    }
                } 
                
                // B) LÓGICA PARA MAGIAS (Círculos)
                else if (state.editingZone.type === 'spell_object') {
                    const handleX = state.editingZone.x + state.editingZone.radius;
                    const handleY = state.editingZone.y;
                    
                    // Redimensionar (Borda direita)
                    if (Math.hypot(mouseX - handleX, mouseY - handleY) < 15) {
                        state.isResizing = true;
                        state.resizeStartPoint = { x: mouseX, y: mouseY };
                        if (state.menu) state.menu.style.display = 'none';
                        return;
                    }
                    // Arrastar (Centro)
                    if (Math.hypot(mouseX - state.editingZone.x, mouseY - state.editingZone.y) <= state.editingZone.radius) {
                        state.isDraggingZone = true;
                        state.zoneDragStartPoint = { x: mouseX, y: mouseY };
                        state.originalSpellCenter = { x: state.editingZone.x, y: state.editingZone.y }; 
                        if (state.menu) state.menu.style.display = 'none';
                        return;
                    }
                } 
                
                // C) LÓGICA PARA DESENHOS (Pincel/Formas)
                else if (state.editingZone.path) {
                    const bb = getBoundingBox(state.editingZone.path);
                    const handles = [
                        {x: bb.minX, y: bb.minY}, {x: bb.maxX, y: bb.minY},
                        {x: bb.maxX, y: bb.maxY}, {x: bb.minX, y: bb.maxY}
                    ];
                    
                    // Redimensionar (Cantos do Bounding Box)
                    for (let i = 0; i < 4; i++) {
                        if (Math.hypot(mouseX - handles[i].x, mouseY - handles[i].y) < 15) {
                            state.isResizing = true;
                            state.resizeStartPoint = { x: mouseX, y: mouseY };
                            state.originalEditPath = JSON.parse(JSON.stringify(state.editingZone.path));
                            if (state.menu) state.menu.style.display = 'none';
                            return;
                        }
                    }
                    // Arrastar (Dentro do desenho)
                    if (isPointInPolygon({x: mouseX, y: mouseY}, state.editingZone.path)) {
                        state.isDraggingZone = true;
                        state.zoneDragStartPoint = { x: mouseX, y: mouseY };
                        state.originalEditPath = JSON.parse(JSON.stringify(state.editingZone.path));
                        if (state.menu) state.menu.style.display = 'none';
                        return;
                    }
                }
                
                // Se clicou fora de qualquer alça ou corpo, desseleciona
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
                } else if (zone.type === 'text') {
                    ctx.font = `bold ${zone.fontSize}px ${zone.fontFamily || 'Arial'}`;
                    const hw = ctx.measureText(zone.text).width / 2;
                    const hh = zone.fontSize / 2;
                    const dx = mouseX - zone.x;
                    const dy = mouseY - zone.y;
                    const angle = -(zone.rotation || 0);
                    const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
                    const localY = dx * Math.sin(angle) + dy * Math.cos(angle);
                    
                    if (Math.abs(localX) <= hw + 8 && Math.abs(localY) <= hh + 8) {
                        hit = true;
                    }
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
        } else if (state.currentDrawMode === 'text') {
            // Chama a caixa de texto
            spawnTextInput(e.clientX, e.clientY, mouseX, mouseY, state);
            return;
        } else if (state.currentDrawMode === 'brush') {
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
    
        // A. Lógica de Rotação (Apenas para Textos no momento)
        if (state.isRotating && state.editingZone && state.editingZone.type === 'text') {
            state.editingZone.rotation = Math.atan2(mouseY - state.editingZone.y, mouseX - state.editingZone.x) + (Math.PI / 2);
            return;
        }

        // B. Lógica de Redimensionamento (Zoom)
        if (state.isResizing && state.editingZone) {
            
            // 1. Redimensionar Magias Circulares
            if (state.editingZone.type === 'spell_object') {
                const newRadius = Math.hypot(mouseX - state.editingZone.x, mouseY - state.editingZone.y);
                state.editingZone.radius = Math.max(20, newRadius);
            } 
            // 2. Redimensionar Desenhos (Pincel) e Formas Geométricas (Quadrado/Triângulo)
            else if (state.editingZone.path) {
                const bb = getBoundingBox(state.originalEditPath);
                const center = { x: bb.minX + bb.width / 2, y: bb.minY + bb.height / 2 };
                
                const oldDist = Math.hypot(state.resizeStartPoint.x - center.x, state.resizeStartPoint.y - center.y);
                const newDist = Math.max(10, Math.hypot(mouseX - center.x, mouseY - center.y));
                const scale = newDist / oldDist;

                // Aplica a escala calculada a todos os pontos do desenho original
                state.editingZone.path = state.originalEditPath.map(p => ({
                    x: center.x + (p.x - center.x) * scale,
                    y: center.y + (p.y - center.y) * scale
                }));
            }
            // 3. Redimensionar Textos
            else if (state.editingZone.type === 'text') {
                // Desgira o mouse atual para comparar corretamente com o ponto inicial
                const dx = mouseX - state.editingZone.x;
                const dy = mouseY - state.editingZone.y;
                const angle = -(state.editingZone.rotation || 0);
                const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
                const localY = dx * Math.sin(angle) + dy * Math.cos(angle);

                const oldDist = Math.hypot(state.resizeStartPoint.x - state.editingZone.x, state.resizeStartPoint.y - state.editingZone.y);
                // Calcula a nova distância usando as coordenadas "desgiradas"
                const newDist = Math.max(10, Math.hypot(localX, localY));
                
                const scale = newDist / oldDist;
                state.editingZone.fontSize = Math.min(Math.max(10, state.originalFontSize * scale), 150);
            }
            
            return;
        }

        // --- 4. ARRASTE DE ZONA ---
        if (state.isDraggingZone && state.editingZone) {
            const dx = mouseX - state.zoneDragStartPoint.x;  
            const dy = mouseY - state.zoneDragStartPoint.y;

            // MUDANÇA AQUI: Adicionei "|| state.editingZone.type === 'text'"
            if (state.editingZone.type === 'spell_object' || state.editingZone.type === 'text') {
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
        if (state.isResizing || state.isDraggingZone || state.isRotating) { // <- Adicionei state.isRotating aqui
            state.isResizing = false;
            state.isDraggingZone = false;
            state.isRotating = false; // Desliga a rotação
            
            // Reabre o menu da zona APENAS se não for texto
            if (state.editingZone) {
                if (state.editingZone.type !== 'text') {
                    state.currentMenuStack = state.editingZone.type === 'spell_object' ? [spellDatabase] : [menuDatabase];
                    tools.renderEffectMenu();
                    tools.showMenu(e.clientX, e.clientY, true);
                }
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
    
    // No final do seu arquivo main.ts
    window.addEventListener('DOMContentLoaded', () => {
        // Garante que a ferramenta inicial seja sempre a Seleção
        if (typeof window.setTool === 'function') {
            window.setTool('select');
        }
    });

    window.addEventListener('keydown', (e) => {
        // Se apertar Delete ou Backspace, estiver no modo de seleção, tiver uma zona selecionada e não estiver digitando nada...
        if ((e.key === 'Delete' || e.key === 'Backspace') && state.editingZone && state.currentDrawMode === 'select') {
            if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
            
            state.activeZones = state.activeZones.filter(z => z !== state.editingZone);
            state.editingZone = null;
            if (state.menu) state.menu.style.display = 'none';
        }
    });
}