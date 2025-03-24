// Verhaal in delen met bijbehorende pixelart-classes
const story = [
    { text: "Er was eens een jongen genaamd Marc die van voetbal hield.", art: "boy" },
    { text: "Vandaag is er voetbaltraining. Gaat Marc trainen?", art: "boy" },
    { text: "Kies: A voor ja, B voor nee.", art: "choice" },
    { text: "Marc ging trainen en scoorde een goal!", art: "training" },
    { text: "Marc bleef thuis. Laten we hem helpen trainen!", art: "no-training" }
];

// Huidige positie in het verhaal
let currentPage = 0;

// Scherm elementen
const pixelArt = document.getElementById('pixelArt');
const storyText = document.getElementById('storyText');

// Knoppen
const upBtn = document.getElementById('up');
const downBtn = document.getElementById('down');
const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');
const aBtn = document.getElementById('a-btn');
const bBtn = document.getElementById('b-btn');
const selectBtn = document.getElementById('select-btn');
const startBtn = document.getElementById('start-btn');

// Toon het verhaal op het scherm
function updateScreen() {
    storyText.textContent = story[currentPage].text;
    pixelArt.className = `pixel-art ${story[currentPage].art}`;
}

// Knop-effect bij indrukken
function addButtonEffect(btn) {
    btn.addEventListener('mousedown', () => btn.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.5)');
    btn.addEventListener('mouseup', () => btn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.5)');
}

addButtonEffect(upBtn);
addButtonEffect(downBtn);
addButtonEffect(leftBtn);
addButtonEffect(rightBtn);
addButtonEffect(aBtn);
addButtonEffect(bBtn);
addButtonEffect(selectBtn);
addButtonEffect(startBtn);

// Navigatie met knoppen
upBtn.addEventListener('click', () => {
    storyText.scrollTop -= 10;
});

downBtn.addEventListener('click', () => {
    storyText.scrollTop += 10;
});

leftBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateScreen();
    }
});

rightBtn.addEventListener('click', () => {
    if (currentPage < 2 && currentPage < story.length - 1) {
        currentPage++;
        updateScreen();
    }
});

aBtn.addEventListener('click', () => {
    if (currentPage === 2) {
        currentPage = 3; // Wel trainen
        updateScreen();
    }
});

bBtn.addEventListener('click', () => {
    if (currentPage === 2) {
        currentPage = 4; // Niet trainen
        updateScreen();
        setTimeout(() => {
            window.open('/highscore.html', '_blank'); // Open het hooghoudspel in een nieuw venster
        }, 3000); // Kleine vertraging om de tekst te laten zien
    }
});

selectBtn.addEventListener('click', () => {
    currentPage = 0;
    updateScreen();
});

startBtn.addEventListener('click', () => {
    if (currentPage < story.length - 1) {
        currentPage++;
        updateScreen();
    }
});

// Initieel scherm
updateScreen();