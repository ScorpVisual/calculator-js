// Plik: renderer.js

console.log('Renderer process started');
// Importy modułów
import './js/background.js';
import './js/nav.js';
import './js/outfit.js';
import './js/pet.js';
import './js/asset.js';
import './js/rules.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded. Setting all static images...');

    // ===============================================
    // CZĘŚĆ 1: DYNAMICZNE TŁA DLA PRZYCISKÓW `.bg-button`
    // ===============================================
    document.querySelectorAll('.bg-button').forEach(btn => {
        if (btn.dataset.name) return;

        const btnClass = Array.from(btn.classList).find(cls => cls.startsWith('btn-'));
        if (!btnClass) return;

        const rawName = btnClass.replace('btn-', '').toLowerCase();
        const fileName = `backgrounds/bg-${rawName}.gif`;
        btn.dataset.name = fileName;
    });

    document.querySelectorAll('.bg-button[data-name]').forEach(btn => {
        const name = btn.dataset.name;
        if (name) {
            let path = window.electronAPI.getImgPath(name);
            // ✨ KLUCZOWA ZMIANA TUTAJ ✨
            // Zamieniamy wszystkie ukośniki wsteczne (\) na proste (/)
            const formattedPath = path.replace(/\\/g, '/');
            btn.style.backgroundImage = `url("${formattedPath}")`;
        }
    });

    // ===============================================
    // CZĘŚĆ 2: STATYCZNE TŁA Z MAPY OBRAZKÓW
    // ===============================================
    const imageMap = {
        '.bg-img': 'backgrounds/bg-grass.gif',
        '.pixel-character': 'tests/test-outfit-2.gif',
        '.char-black-front': 'compare/char-black-front.gif',
        '.char-black-back': 'compare/char-black-back.gif',
        '.char-male': 'compare/char-male.gif',
        '.char-female': 'compare/char-female.gif',
        '.char-quality::before': 'compare/char-quality.gif'
    };

    Object.entries(imageMap).forEach(([selector, imgName]) => {
        let path = window.electronAPI.getImgPath(imgName);
        // ✨ KLUCZOWA ZMIANA RÓWNIEŻ TUTAJ ✨
        // Konsekwentnie formatujemy ścieżkę
        const formattedPath = path.replace(/\\/g, '/');

        if (selector.includes('::before')) {
            const baseSelector = selector.replace('::before', '');
            const style = document.createElement('style');
            style.textContent = `
              ${baseSelector}::before {
                background-image: url("${formattedPath}");
              }
            `;
            document.head.appendChild(style);
        } else {
            document.querySelectorAll(selector).forEach(el => {
                el.style.backgroundImage = `url("${formattedPath}")`;
            });
        }
    });

    // ===============================================
    // CZĘŚĆ 3: OBRAZKI <img> W TUTORIALU
    // ===============================================
    document.querySelectorAll('.tutorial-img').forEach(img => {
        const name = img.dataset.name;
        if (name) {
            let path = window.electronAPI.getImgPath(name);
            // ✨ I TUTAJ DLA BEZPIECZEŃSTWA ✨
            img.src = path.replace(/\\/g, '/');
        }
    });
});