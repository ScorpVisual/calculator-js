document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENTY DOM ===
    const loadAssetBtn = document.getElementById('loadImgAsset-button');
    const displayArea = document.getElementById('asset-display-area');

    /**
     * Tworzy element <img> i dodaje go do obszaru wyświetlania.
     * @param {string} imageUrl - Ścieżka do obrazka, który ma być wczytany.
     */
    /**
 * Tworzy komponent (kontener + obrazek + przycisk usuwania) i dodaje go do planszy.
 * @param {string} imageUrl - Ścieżka do obrazka, który ma być wczytany.
 */
function addAssetToBoard(imageUrl) {
    if (!displayArea) {
        console.error('Nie znaleziono pola "asset-display-area"!');
        return;
    }

    // 1. Utwórz kontener-wrapper, który będzie trzymał obrazek i przycisk
    const wrapper = document.createElement('div');
    wrapper.classList.add('asset-wrapper');

    // 2. Utwórz element obrazka (tak jak wcześniej)
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'Wczytany Asset';
    imgElement.classList.add('pixel-asset');
    
    // 3. Utwórz przycisk do usuwania
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-asset-btn');
    deleteBtn.textContent = '×'; // Używamy znaku mnożenia dla ładniejszego 'X'
    
    // 4. DODAJ AKCJĘ DO PRZYCISKU: Po kliknięciu, usuń cały kontener (wrapper)
    deleteBtn.addEventListener('click', () => {
        wrapper.remove(); // Usuwa kontener wraz z obrazkiem i przyciskiem
        console.log(`🗑️ Wywalono asset: ${imageUrl}`);
    });

    // 5. Złóż wszystko w całość: dodaj obrazek i przycisk do kontenera
    wrapper.appendChild(imgElement);
    wrapper.appendChild(deleteBtn);

    // 6. Dodaj gotowy kontener do głównego obszaru na stronie
    displayArea.appendChild(wrapper);

    console.log(`✅ Przyklejony nowy asset do planszy: ${imageUrl}`);
}

    // --- OBSŁUGA PRZYCISKU ---
    if (loadAssetBtn) {
        loadAssetBtn.addEventListener('click', async () => {
            // Używamy API Electrona do otwarcia okna dialogowego
            const filePath = await window.electronAPI.openFileDialog();

            if (filePath) {
                // Formatujemy ścieżkę i wywołujemy funkcję dodającą obrazek
                const formattedPath = `app-file:///${filePath.replace(/\\/g, '/')}`;
                addAssetToBoard(formattedPath);
            } else {
                console.log('Wybór pliku anulowany.');
            }
        });
    }
});