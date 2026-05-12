// src/utils/videos.ts

export function createVideo(src: string): HTMLVideoElement {
    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.loop = true;
    
    // Atributos vitais para funcionamento em navegadores modernos
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('muted', 'true');

    // O "Truque do Loop Infalível"
    video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play().catch(() => {});
    });

    // Tenta dar play imediatamente
    video.play().catch(err => {
        console.warn("Vídeo aguardando interação do usuário para iniciar:", src);
    });

    return video;
}