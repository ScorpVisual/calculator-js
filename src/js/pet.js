// Plik: pet.js
console.log('Pet script loaded');

document.addEventListener('DOMContentLoaded', () => {
    // === ZMIENNE I ELEMENTY DOM ===
    let currentPetImageObject = null;
    let checkIdle = false;
    let specialActionsCount = 0;
    let animationFrameId = null;
    const walkFrameDuration = 170;
    const actionFrameDuration = 220;
    let lastWalkFrameTime = 0;
    let lastActionFrameTime = 0;
    let rowPositionsY = { front: 0, left: 0, right: 0, up: 0 };
    // ✨ NOWA ZMIENNA: Przechowuje pozycję klatki "idle" (stanie przodem)
    let pauseFramePosition = { x: '0px', y: '0px' };
    let currentActionId = 0;
    const loadPetImgBtn = document.getElementById('loadImgPet-button');
    const petIdleBtn = document.getElementById('petIdle-button');
    const numberBtns = document.querySelectorAll('.number-btn');
    const actionButtonContainer = document.getElementById("button-container");
    const feedbackElement = document.getElementById('pet-anim-feedback');
    const actionDrawer = document.getElementById('action-drawer');
    const actionDrawerHeader = document.getElementById('action-drawer-header');
    
    if (actionDrawer && actionDrawerHeader) {
        actionDrawerHeader.addEventListener('click', () => {
            actionDrawer.classList.toggle('active');
        });
    }

    if (feedbackElement) {
        feedbackElement.textContent = 'Tutaj pojawi się info o parametrach animacji.';
    }

    // ✨ Zaktualizowana funkcja odtwarzacza animacji
    async function playActionSequence(pet, sequenceConfig) {
        const localActionId = ++currentActionId;
        const actionXPosition = pet.style.backgroundPositionX;

        for (let i = 0; i < sequenceConfig.frames.length; i++) {
            if (localActionId !== currentActionId) return;
            
            const frameNumber = sequenceConfig.frames[i];
            const newYPosition = frameNumber * pet.frameHeight;
            pet.style.backgroundPositionY = `-${newYPosition}px`;

            await new Promise(resolve => setTimeout(resolve, sequenceConfig.duration));
            
            if (sequenceConfig.pause && sequenceConfig.pause.afterFrameIndex === i) {
                // Używamy nowej zmiennej do ustawienia klatki na czas pauzy
                pet.style.backgroundPosition = `${pauseFramePosition.x} ${pauseFramePosition.y}`;
                await new Promise(resolve => setTimeout(resolve, sequenceConfig.pause.duration));
                pet.style.backgroundPositionX = actionXPosition;
            }
        }
    }

    // ✨ Zaktualizowana główna funkcja - teraz zapisuje pozycję klatki "idle"
    function applyStylesAndCalculate(image) {
        if (!image || !image.naturalWidth) return;

        const totalColumns = 4 + (checkIdle ? 1 : 0) + specialActionsCount;
        const frameWidth = image.naturalWidth / totalColumns;
        const frameHeight = image.naturalHeight / 4;
        rowPositionsY = { front: 0, left: -frameHeight, right: -frameHeight * 2, up: -frameHeight * 3 };

        // POPRAWKA: Pozycja klatki "idle/pause" to zawsze pierwsza klatka (0, 0) na spritesheet.
        // Jest to klatka spoczynku zwrócona przodem.
        pauseFramePosition = { x: '0px', y: `${rowPositionsY.front}px` };

        const petElements = document.querySelectorAll('.pixel-pet:not([class*="char-"])');
        
        // POPRAWKA: Obliczenie startowej klatki dla CHODU jest teraz poprawne i niezależne od reszty.
        // Jeśli jest idle (checkIdle=true), chód zaczyna się od kolumny 1. Jeśli nie, od kolumny 0.
        const walkStartFrame = checkIdle ? 1 : 0;
        
        // POPRAWKA: Offset dla akcji specjalnych uwzględnia kolumny chodu (4) oraz ewentualną dodatkową kolumnę idle.
        const actionColumnOffset = (checkIdle ? 1 : 0) + 4;

        petElements.forEach(pet => {
            pet.frameWidth = frameWidth;
            pet.frameHeight = frameHeight;
            pet.animationType = 'none';
            pet.style.width = `${frameWidth}px`;
            pet.style.height = `${frameHeight}px`;
            pet.style.backgroundImage = `url(${image.src})`;
            pet.style.backgroundSize = `${image.naturalWidth}px ${image.naturalHeight}px`;
            pet.style.display = 'inline-block';

            if (pet.matches('[class*="pet-move-"]')) {
                pet.animationType = 'walk';
                pet.startFrame = walkStartFrame; // Używamy poprawnej wartości startowej
                pet.currentFrame = 0;
                const startX = walkStartFrame * frameWidth;
                if (pet.classList.contains('pet-move-front')) pet.style.backgroundPosition = `-${startX}px ${rowPositionsY.front}px`;
                else if (pet.classList.contains('pet-move-left')) pet.style.backgroundPosition = `-${startX}px ${rowPositionsY.left}px`;
                else if (pet.classList.contains('pet-move-right')) pet.style.backgroundPosition = `-${startX}px ${rowPositionsY.right}px`;
                else if (pet.classList.contains('pet-move-up')) pet.style.backgroundPosition = `-${startX}px ${rowPositionsY.up}px`;

            } else if (pet.matches('[class*="pet-action-"]')) {
                const actionClass = Array.from(pet.classList).find(cls => cls.startsWith('pet-action-'));
                const actionNumber = parseInt(actionClass.split('-')[2], 10);
                if (actionNumber > specialActionsCount) {
                    pet.style.display = 'none';
                } else {
                    pet.animationType = 'action';
                    pet.currentFrame = 0;
                    // Używamy poprawionego offsetu dla akcji
                    const columnIndex = actionColumnOffset + (actionNumber - 1);
                    const xPosition = columnIndex * frameWidth;
                    pet.style.backgroundPosition = `-${xPosition}px 0px`;
                }
            } else if (pet.matches('[class*="stand-"]')) {
                // POPRAWKA: Ustawiamy postać w spoczynku. Klatka 'idle' jest ZAWSZE w pierwszej kolumnie (indeks 0).
                // Niezależnie czy to dedykowana animacja idle, czy pierwsza klatka animacji chodu.
                pet.style.backgroundPositionX = '0px'; 

                // Ustawiamy poprawny wiersz (kierunek) dla postaci stojącej
                if (pet.classList.contains('stand-left')) pet.style.backgroundPositionY = `${rowPositionsY.left}px`;
                else if (pet.classList.contains('stand-right')) pet.style.backgroundPositionY = `${rowPositionsY.right}px`;
                else if (pet.classList.contains('stand-up')) pet.style.backgroundPositionY = `${rowPositionsY.up}px`;
                else pet.style.backgroundPositionY = `${rowPositionsY.front}px`; // Domyślnie przodem
            }
        });

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        lastWalkFrameTime = performance.now();
        lastActionFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(animationLoop);
    }
    
    // Reszta kodu bez zmian...
    function triggerSpecialAction(mode) {
        const sequenceConfig = generateActionSequence(mode);
        if (feedbackElement) {
            let feedbackHTML = `<strong>Analiza akcji #${mode}:</strong><br>`;
            feedbackHTML += `<strong>Sekwencja klatek:</strong> ${sequenceConfig.frames.join(' → ')}<br>`;
            feedbackHTML += `<strong>Szybkość klatki:</strong> ${sequenceConfig.duration}ms<br>`;
            if (sequenceConfig.pause) {
                feedbackHTML += `<strong>Pauza specjalna:</strong> ${sequenceConfig.pause.duration / 1000}s po ${sequenceConfig.pause.afterFrameIndex + 1}. klatce.`;
            } else {
                feedbackHTML += `<strong>Pauza specjalna:</strong> Brak`;
            }
            feedbackElement.innerHTML = feedbackHTML;
        }
        const actionPets = document.querySelectorAll('.pixel-pet[class*="pet-action-"]:not([style*="display: none"])');
        actionPets.forEach(pet => {
            playActionSequence(pet, sequenceConfig);
        });
    }
    function animationLoop(timestamp) {
        const allPets = document.querySelectorAll('.pixel-pet:not([class*="char-"])');
        if (timestamp - lastWalkFrameTime >= walkFrameDuration) {
            lastWalkFrameTime = timestamp;
            allPets.forEach(pet => {
                if (pet.animationType !== 'walk') return;
                pet.currentFrame = (pet.currentFrame + 1) % 4;
                const newXPosition = (pet.startFrame + pet.currentFrame) * pet.frameWidth;
                pet.style.backgroundPositionX = `-${newXPosition}px`;
            });
        }
        if (timestamp - lastActionFrameTime >= actionFrameDuration) {
            lastActionFrameTime = timestamp;
            allPets.forEach(pet => {
                if (pet.animationType !== 'action') return;
                pet.currentFrame = (pet.currentFrame + 1) % 4;
                const newYPosition = pet.currentFrame * pet.frameHeight;
                pet.style.backgroundPositionY = `-${newYPosition}px`;
            });
        }
        animationFrameId = requestAnimationFrame(animationLoop);
    }
    function generateActionSequence(mode) {
        const baseLoop = [0, 1, 2, 3];
        let sequence = { frames: [], duration: 100, pause: null };
        const originalMode = mode;
        if (mode === 13) { mode = 3; sequence.duration = 150; }
        if (mode === 14) { mode = 3; sequence.duration = 200; }
        if (mode === 15) { mode = 3; sequence.duration = 300; }
        switch (originalMode) {
            case 10: sequence.frames = [0, 1, 2, 3, 2, 1, 0]; break;
            case 11: sequence.frames = [0, 1, 2, 3, 2, 1, 0]; sequence.pause = { afterFrameIndex: 3, duration: 5000 }; break;
            case 12: sequence.frames = [0, 1, 2, 3, 2, 1, 0]; sequence.pause = { afterFrameIndex: 3, duration: 20000 }; break;
        }
        if (mode >= 0 && mode <= 9) {
            let finalFrames = [];
            for (let i = 0; i <= mode; i++) {
                finalFrames.push(...baseLoop);
            }
            finalFrames.push(0);
            sequence.frames = finalFrames;
        }
        return sequence;
    }
    function loadAndProcessPetImage(imageUrl) {
        const img = new Image();
        const formattedUrl = imageUrl.replace(/\\/g, '/');
        img.src = formattedUrl;
        img.onload = () => {
            currentPetImageObject = img;
            applyStylesAndCalculate(currentPetImageObject);
        };
        img.onerror = () => console.error('Nie udało się załadować obrazka zwierzaka:', formattedUrl);
    }
    const recalculate = () => {
        if (currentPetImageObject) {
            applyStylesAndCalculate(currentPetImageObject);
        }
    };
    if (petIdleBtn) {
        petIdleBtn.addEventListener('click', () => {
            checkIdle = !checkIdle;
            petIdleBtn.classList.toggle('active', checkIdle);
            recalculate();
        });
    }
    if (numberBtns.length > 0) {
        numberBtns.forEach(button => {
            button.addEventListener('click', () => {
                numberBtns.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                specialActionsCount = parseInt(button.value, 10);
                recalculate();
            });
        });
    }
    if (actionButtonContainer) {
        for (let i = 0; i <= 15; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.value = i;
            btn.className = "action-btn";
            btn.addEventListener("click", () => {
                actionButtonContainer.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentActionId++;
                triggerSpecialAction(i);
            });
            actionButtonContainer.appendChild(btn);
        }
    }
    if (loadPetImgBtn) {
        loadPetImgBtn.addEventListener('click', async () => {
            const filePath = await window.electronAPI.openFileDialog();
            if (filePath) loadAndProcessPetImage(`app-file:///${filePath.replace(/\\/g, '/')}`);
        });
    }
    if(petIdleBtn) petIdleBtn.classList.toggle('active', checkIdle);
    const zeroButton = document.querySelector('.number-btn[value="0"]');
    if (zeroButton) zeroButton.classList.add('active');
    loadAndProcessPetImage(window.electronAPI.getImgPath('tests/test-pet-2.gif'));
});