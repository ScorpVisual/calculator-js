// Plik: rules.js

console.log('Rules loaded');

document.addEventListener('DOMContentLoaded', () => {
    // === KROK 1: Stwórz jeden, globalny element tooltipa ===
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'custom-tooltip';
    document.body.appendChild(tooltipElement);

    // Domyślne ustawienie aktywnego przycisku
    const przyciskDomyslny = document.querySelector('.model-btn[data-template]');
    if (przyciskDomyslny) {
        przyciskDomyslny.click();
    }

    // --- OBSŁUGA AKORDEONU (bez zmian) ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('active');
        });
    });

    // --- LOGIKA ŁĄCZENIA I KOPIOWANIA (bez zmian) ---
    let aktywnySzablon = null;
    const przyciskiModeli = document.querySelectorAll('.model-btn');
    przyciskiModeli.forEach(przycisk => {
        przycisk.addEventListener('click', () => {
            przyciskiModeli.forEach(p => p.classList.remove('active'));
            przycisk.classList.add('active');
            aktywnySzablon = przycisk.dataset.template;
        });
    });

    // === KROK 2: Nowa logika obsługi tooltipa ===
    const paragrafyRegulaminu = document.querySelectorAll('.accordion-par');

    paragrafyRegulaminu.forEach(paragraf => {
        // Pokaż tooltip "Kliknij, aby skopiować" po najechaniu myszką
        paragraf.addEventListener('mouseenter', (event) => {
            pokazTooltip(event.currentTarget, 'Kliknij, aby skopiować');
        });

        // Ukryj tooltip po zjechaniu myszką
        paragraf.addEventListener('mouseleave', () => {
            ukryjTooltip();
        });

        // Skopiuj treść po kliknięciu
  // Skopiuj treść po kliknięciu
paragraf.addEventListener('click', async (event) => { // Dodajemy słowo kluczowe 'async'
    const trescRegulaminu = paragraf.textContent.trim();
    const finalnaOdpowiedz = aktywnySzablon ? aktywnySzablon.replace('TREŚĆ', trescRegulaminu) : trescRegulaminu;
    
    try {
        // 'await' wstrzymuje wykonanie funkcji, aż operacja kopiowania się zakończy
        await window.electronAPI.copyText(finalnaOdpowiedz);
        
        // Ten kod wykona się TYLKO, jeśli kopiowanie się powiodło
        console.log('Skopiowano przez preload:', finalnaOdpowiedz);
        pokazTooltip(event.currentTarget, 'Skopiowano!', false, true);

    } catch (err) {
        // Ten blok 'catch' wykona się TYLKO, jeśli wystąpił błąd
        console.error('Błąd kopiowania:', err);
        pokazTooltip(event.currentTarget, 'Ups, coś poszło nie tak!', true, true);
    }
});

    });

    /**
     * Nowa funkcja do pokazywania i pozycjonowania tooltipa.
     * @param {HTMLElement} targetElement - Element, nad którym ma się pojawić tooltip.
     * @param {string} message - Tekst do wyświetlenia.
     * @param {boolean} isError - Czy wiadomość jest błędem.
     * @param {boolean} autoHide - Czy tooltip ma zniknąć sam po chwili.
     */
    function pokazTooltip(targetElement, message, isError = false, autoHide = false) {
        // Ustaw treść i styl
        tooltipElement.textContent = message;
        tooltipElement.classList.toggle('tooltip-error', isError);

        // Oblicz pozycję
        const rect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltipElement.getBoundingClientRect();

        let top = rect.top - tooltipRect.height - 8; // 8px odstępu
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

        // Poprawki, by tooltip nie wychodził poza ekran
        if (left < 0) left = 5;
        if (top < 0) top = rect.bottom + 8;

        tooltipElement.style.top = `${top}px`;
        tooltipElement.style.left = `${left}px`;

        // Pokaż tooltip
        tooltipElement.classList.add('visible');

        // Automatyczne ukrywanie (dla komunikatów "Skopiowano!")
        if (autoHide) {
            setTimeout(() => {
                // Ukryj tylko, jeśli treść się nie zmieniła (użytkownik nie najechał na inny element)
                if (tooltipElement.textContent === message) {
                    ukryjTooltip();
                }
            }, 2000);
        }
    }

    /**
     * Funkcja ukrywająca tooltip.
     */
    function ukryjTooltip() {
        tooltipElement.classList.remove('visible');
    }
});