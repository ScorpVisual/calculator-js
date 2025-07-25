// Plik: outfit.js
console.log('Outfit script loaded');

document.addEventListener('DOMContentLoaded', () => {
    let spriteImage;

    // Ustawienie domyślnego obrazka początkowego dla postaci
    spriteImage = window.electronAPI.getImgPath('tests/test-outfit.gif');


    const loadImgBtn = document.getElementById('loadImg-button');
    const contentArea = document.getElementById('content-area');

    // Funkcja pomocnicza do aktualizacji obrazków wszystkich postaci
const updatePixelCharacters = (imageUrl) => {
    const pixelCharacters = document.querySelectorAll('.pixel-character');
    pixelCharacters.forEach((char) => {
        char.style.backgroundImage = `url("${imageUrl}")`;
    });
    console.log('Obrazek tła postaci zaktualizowany na:', imageUrl);
};


    // Początkowe zastosowanie domyślnego obrazka po załadowaniu DOM
    updatePixelCharacters(spriteImage);

    // --- Obsługa przycisku "Load Image" (dla postaci) ---
    if (loadImgBtn) {
        loadImgBtn.addEventListener('click', async () => {
            console.log('Load Image button (Character) clicked. Opening file dialog...');
            const filePath = await window.electronAPI.openFileDialog();

            if (filePath) {
                console.log('Wybrany plik dla postaci:', filePath);
                const formattedPath = `app-file:///${filePath.replace(/\\/g, '/')}`;
                spriteImage = formattedPath;
                updatePixelCharacters(spriteImage);
            } else {
                console.log('Wybór pliku dla postaci anulowany.');
            }
        });
    } else {
        console.warn('Button z ID "loadImg-button" nie został znaleziony w DOM. Nie można ładować obrazów postaci.');
    }

    // --- Obsługa przeciągania plików (Drag and Drop dla postaci) ---
    if (contentArea) {
        contentArea.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.stopPropagation();
            contentArea.style.border = '2px dashed #007bff';
        });

        contentArea.addEventListener('dragleave', (event) => {
            event.preventDefault();
            event.stopPropagation();
            contentArea.style.border = 'none';
        });

        contentArea.addEventListener('drop', async (event) => {
            event.preventDefault();
            event.stopPropagation();
            contentArea.style.border = 'none';

            let droppedFilePath = null;

            if (event.dataTransfer && event.dataTransfer.files.length > 0) {
                if (event.dataTransfer.files[0].path) {
                    droppedFilePath = event.dataTransfer.files[0].path;
                }
            }

            if (!droppedFilePath && event.dataTransfer && event.dataTransfer.items.length > 0) {
                for (let i = 0; i < event.dataTransfer.items.length; i++) {
                    const item = event.dataTransfer.items[i];
                    if (item.kind === 'file') {
                        const file = item.getAsFile();
                        if (file && file.path) {
                            droppedFilePath = file.path;
                            break;
                        }
                    }
                }
            }
            
            if (!droppedFilePath) {
                console.warn('Nie udało się uzyskać ścieżki przeciągniętego pliku. Otwieram okno dialogowe.');
                const fallbackFilePath = await window.electronAPI.openFileDialog();
                if (fallbackFilePath) {
                    droppedFilePath = fallbackFilePath;
                } else {
                    console.log('Wybór pliku awaryjnego anulowany.');
                    return;
                }
            }

            if (droppedFilePath) {
                const fileExtension = droppedFilePath.split('.').pop().toLowerCase();
                const supportedExtensions = ['gif', 'jpg', 'jpeg', 'png'];

                if (supportedExtensions.includes(fileExtension)) {
                    console.log('Przetwarzam przeciągnięty plik:', droppedFilePath);
                    const formattedPath = `app-file:///${droppedFilePath.replace(/\\/g, '/')}`;
                    spriteImage = formattedPath;
                    updatePixelCharacters(spriteImage);
                } else {
                    console.warn('Nieobsługiwany format pliku. Proszę przeciągnąć plik obrazu (GIF, JPG, PNG).');
                }
            }
        });
    } else {
        console.warn('Element z ID "content-area" nie został znaleziony, obsługa przeciągania plików nie zostanie zainicjowana.');
    }
   document.querySelectorAll('.pixel-character').forEach(char => {
  const name = char.dataset.name;
  if (name) {
    const fullPath = window.electronAPI.getImgPath(name);
    char.style.backgroundImage = `url("${fullPath}")`;
  }
});


});