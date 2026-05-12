import { statusDefinitions } from '../data/constants';

export function createImage(src: string): HTMLImageElement {
    const img = new Image();
    img.src = src;
    return img;
}

export function loadStatusIcons(): Record<string, HTMLImageElement> {
    const icons: Record<string, HTMLImageElement> = {};
    
    statusDefinitions.forEach(status => {
        const img = new Image();
        // Lembre-se: no Vite, a pasta public é a raiz "/"
        img.src = `/icons/${status.key}.png`; 
        icons[status.key] = img;
    });
    
    return icons;
}