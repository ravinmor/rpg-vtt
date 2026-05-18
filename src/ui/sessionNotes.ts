import { loadSessionNotesContent, saveSessionNotesContent } from '../repositories/sessionNotesRepository';

let notesSaveTimer: ReturnType<typeof setTimeout> | null = null;

export function saveSessionNotes() {
    const textarea = document.getElementById('session-notes-textarea') as HTMLTextAreaElement | null;
    const indicator = document.getElementById('notes-save-indicator');
    if (!textarea || !indicator) return;

    indicator.textContent = 'Salvando...';
    indicator.className = 'notes-saved notes-saving visible';

    if (notesSaveTimer) clearTimeout(notesSaveTimer);
    notesSaveTimer = setTimeout(() => {
        try {
            saveSessionNotesContent(textarea.value);
            indicator.textContent = 'Salvo';
            indicator.className = 'notes-saved visible';

            setTimeout(() => {
                indicator.classList.remove('visible');
            }, 2000);
        } catch (error) {
            indicator.textContent = 'Erro ao salvar';
            indicator.className = 'notes-saved visible';
            console.error('Erro ao salvar notas:', error);
        }
    }, 800);
}

export function loadSessionNotes() {
    const textarea = document.getElementById('session-notes-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const saved = loadSessionNotesContent();
    if (saved) textarea.value = saved;
}

export function exportSessionNotes() {
    const textarea = document.getElementById('session-notes-textarea') as HTMLTextAreaElement | null;
    if (!textarea || !textarea.value.trim()) {
        alert('Sem notas para exportar.');
        return;
    }

    const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const blob = new Blob([textarea.value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notas-sessao-${date}.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

export function parseMarkdown(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        .replace(/^---$/gm, '<hr>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

export function setNotesMode(mode: 'edit' | 'preview') {
    const textarea = document.getElementById('session-notes-textarea') as HTMLTextAreaElement | null;
    const preview = document.getElementById('session-notes-preview');
    const btnEdit = document.getElementById('btn-notes-edit');
    const btnPreview = document.getElementById('btn-notes-preview');

    if (!textarea || !preview || !btnEdit || !btnPreview) return;

    if (mode === 'preview') {
        preview.innerHTML = `<p>${parseMarkdown(textarea.value || '')}</p>`;
        textarea.style.display = 'none';
        preview.style.display = 'block';
        btnEdit.classList.remove('active');
        btnPreview.classList.add('active');
        return;
    }

    textarea.style.display = 'block';
    preview.style.display = 'none';
    btnEdit.classList.add('active');
    btnPreview.classList.remove('active');
}
