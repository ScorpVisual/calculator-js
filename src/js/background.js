// Plik: background.js

console.log('Background script loaded');

document.addEventListener('DOMContentLoaded', () => {
    const bgBtns = document.querySelectorAll('.bg-button');
    const targetElements = document.querySelectorAll('.bg-img');

    if (targetElements.length === 0) {
        console.warn('Nie znaleziono elementów z klasą ".bg-img" do zmiany tła.');
        return;
    }

    bgBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Znajdź klasę przycisku, np. "btn-grass"
            const btnClass = Array.from(btn.classList).find(cls => cls.startsWith('btn-'));

            if (btnClass) {
                // 2. Wyciągnij sam typ tła, np. "grass"
                const bgType = btnClass.substring(4);

                // 3. Stwórz nazwę pliku, której oczekuje API Electrona
                const fileName = `backgrounds/bg-${bgType}.gif`;

                // 4. Pobierz pełną, bezpieczną ścieżkę do pliku za pomocą API
                const fullPath = window.electronAPI.getImgPath(fileName);
                
                // 5. Sformatuj ścieżkę (zamień \ na /) dla zgodności z CSS
                const formattedPath = fullPath.replace(/\\/g, '/');

                // 6. Ustaw tło dla wszystkich docelowych elementów
                targetElements.forEach(element => {
                    element.style.backgroundImage = `url('${formattedPath}')`;
                });

                console.log(`✅ Zmieniono tło na: ${bgType}`);
            } else {
                console.warn('Przycisk nie ma odpowiedniej klasy "btn-*".', btn);
            }
        });
    });
});