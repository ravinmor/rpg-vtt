import { state } from '../state/globalState';

export function startEffectMenuDrag(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('button, input, .menu-item')) return;

    const shell = document.querySelector('.effect-menu-shell') as HTMLElement | null;
    if (!shell) return;
    if (!(event.target as HTMLElement).closest('.effect-menu-header')) return;

    state.isDraggingEffectMenu = true;
    const rect = shell.getBoundingClientRect();
    state.effectMenuDragOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    event.preventDefault();
    event.stopPropagation();
}

export function bindFloatingMenus() {
    document.querySelector('.effect-menu-shell')?.addEventListener('mousedown', startEffectMenuDrag as EventListener);
}
