// Haal het canvas en de context op
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Afbeeldingen laden
const ballImage = new Image();
ballImage.src = 'img/ball.png'; // Pas het pad aan als de afbeelding in een submap staat, bijv. 'images/ball.png'

const backgroundImage = new Image();
backgroundImage.src = 'img/stadium.jpg'; // Pas het pad aan als de afbeelding in een submap staat, bijv. 'images/stadium.jpg'

// Maak het canvas responsive
function resizeCanvas() {
    if (window.innerWidth < 800) { // Mobiel: responsive formaat
        canvas.width = window.innerWidth - 20;
        canvas.height = window.innerHeight - 60;
    } else { // Desktop: vast formaat
        canvas.width = 800;
        canvas.height = 600;
    }
}

// Wacht tot beide afbeeldingen geladen zijn voordat de game start
let imagesLoaded = 0;
function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 2) { // Beide afbeeldingen zijn geladen
        resizeCanvas(); // Stel canvasgrootte in
        ball.x = canvas.width / 2; // Stel balpositie in na canvasgrootte
        window.addEventListener('resize', resizeCanvas);
        gameLoop(); // Start de game loop
    }
}

ballImage.onload = checkImagesLoaded;
backgroundImage.onload = checkImagesLoaded;

// Roep resizeCanvas aan bij laden en bij schermverandering
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let ball = {
    x: canvas.width / 2, // Startpositie x (midden van canvas)
    y: 30, // Startpositie y (onderaan canvas)
    radius: window.innerWidth < 600 ? 45 : 35, // Grotere bal op mobiel
    speedX: 0, // Horizontale snelheid
    speedY: 1, // Verticale snelheid
    gravity: window.innerWidth < 600 ? 0.2 : 0.2, // Langzamere zwaartekracht op mobiel
    bounce: 0.3, // Stuiterfactor
    kickForce: window.innerWidth < 600 ? 20 : 20, // Zwakkere kick op mobiel
};

// Variabelen voor de game
let score = 0;
let isGameOver = false;
let isCountingDown = true; // Nieuw: bepaalt of we aan het aftellen zijn
let countdownTime = 3; // Nieuw: afteltijd in seconden
let countdownTimer = countdownTime; // Nieuw: huidige tijd van de aftelling

// Teken de bal
function drawBall() {
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

// Teken de aftelling (responsive hoogte)
function drawCountdown() {
    if (isCountingDown) {
        const boardWidth = canvas.width < 400 ? 100 : 140;
        const boardHeight = canvas.height < 300 ? 40 : 50; // Kleinere hoogte op kleine schermen
        const boardX = canvas.width - boardWidth - 10;
        const boardY = 10;

        ctx.fillStyle = '#000000';
        ctx.fillRect(boardX, boardY, boardWidth, boardHeight);
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        ctx.strokeRect(boardX, boardY, boardWidth, boardHeight);

        const fontSizeSmall = canvas.width < 400 ? 10 : 12;
        const fontSizeLarge = canvas.width < 400 ? 20 : 26;
        
        ctx.font = `${fontSizeSmall}px monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('START', boardX + boardWidth / 2, boardY + boardHeight / 5);

        ctx.font = `${fontSizeLarge}px monospace`;
        ctx.fillStyle = '#ffffff';
        if (countdownTimer > 0) {
            ctx.fillText(Math.ceil(countdownTimer).toString(), boardX + boardWidth / 2, boardY + 3 * boardHeight / 4 - 5);
        } else {
            ctx.fillText('GO!', boardX + boardWidth / 2, boardY + 3 * boardHeight / 4 - 5);
        }
    }
}

// Teken het scorebord (responsive)
function drawScoreboard() {
    const boardWidth = canvas.width < 400 ? 100 : 140; // Kleinere breedte op mobiel
    const boardHeight = canvas.height < 300 ? 40 : 50; // Kleinere hoogte op kleine schermen
    const boardX = canvas.width - boardWidth - 10; // 10px marge rechts
    const boardY = 10;

    ctx.fillStyle = '#000000';
    ctx.fillRect(boardX, boardY, boardWidth, boardHeight);
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.strokeRect(boardX, boardY, boardWidth, boardHeight);

    const fontSizeSmall = canvas.width < 400 ? 10 : 12;
    const fontSizeLarge = canvas.width < 400 ? 20 : 26;

    ctx.font = `${fontSizeSmall}px monospace`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCORE', boardX + boardWidth / 2, boardY + boardHeight / 5);

    ctx.font = `${fontSizeLarge}px monospace`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(score.toString().padStart(4, '0'), boardX + boardWidth / 2, boardY + 3 * boardHeight / 4 - 5);
}

// Teken de game-over-tekst
function drawGameOver() {
    if (isGameOver) {
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#ff0000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = '24px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Klik om opnieuw te beginnen', canvas.width / 2, canvas.height / 2 + 20);
    }
}

// Update de balpositie en physics
function updateBall() {
    if (!isGameOver && !isCountingDown) {
        ball.speedY += ball.gravity;
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.speedX *= -ball.bounce;
        } else if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.speedX *= -ball.bounce;
        }

        if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.speedY *= -ball.bounce;
        }

        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.speedY *= -ball.bounce;
            ball.speedX *= 0.9;

            if (Math.abs(ball.speedY) < 0.5 && Math.abs(ball.speedX) < 0.5) {
                ball.speedY = 0;
                ball.speedX = 0;
                isGameOver = true;
            }
        }
    }
}

// Eventlistener voor muis en touch
function handleInput(event) {
    event.preventDefault();

    if (isGameOver) {
        // Reset het spel
        ball.x = canvas.width / 2;
        ball.y = 30;
        ball.speedX = 0;
        ball.speedY = 1;
        score = 0;
        isGameOver = false;
        isCountingDown = true;
        countdownTimer = countdownTime;
        return;
    }

    if (!isCountingDown) {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if (event.type === 'touchstart') {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        const distance = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);

        const clickRadius = event.type === 'touchstart' ? ball.radius * 4 : ball.radius * 3;
        if (distance < clickRadius) {
            ball.speedY = -ball.kickForce;
            ball.speedX += (mouseX - ball.x) / 20;
            score += 1;
        }
    }
}

// Voeg eventlisteners toe voor muis en touch
canvas.addEventListener('click', handleInput);
canvas.addEventListener('touchstart', handleInput);

// Game loop
function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawBall();
    updateBall();

    if (isCountingDown) {
        drawCountdown();
        countdownTimer -= 1 / 60;
        if (countdownTimer <= -1) {
            isCountingDown = false;
            countdownTimer = countdownTime;
        }
    } else {
        drawScoreboard();
    }

    drawGameOver();

    requestAnimationFrame(gameLoop);
}