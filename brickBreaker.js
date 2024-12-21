const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playButton = document.getElementById('playButton');
const restartButton = document.getElementById('restartButton');

canvas.width = 800;
canvas.height = 600;

// Game variables
let paddle, ball, bricks, score, isGameWon, isGameRunning;

// Initialize game state
function initializeGame() {
    paddle = {
        x: canvas.width / 2 - 75,
        y: canvas.height - 20,
        width: 150,
        height: 10,
        dx: 0,
        speed: 6,
    };

    ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        dx: 4,
        dy: -4,
    };

    bricks = [];
    const brickRowCount = 5;
    const brickColumnCount = 8;
    const brickWidth = 80;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 50;
    const brickOffsetLeft = 35;

    for (let r = 0; r < brickRowCount; r++) {
        bricks[r] = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[r][c] = { x: 0, y: 0, status: 1 };
        }
    }

    score = 0;
    isGameWon = false;
    isGameRunning = false;

    restartButton.disabled = true;
}

// Input handling
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    } else if (e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        paddle.dx = 0;
    }
});

// Draw paddle
function drawPaddle() {
    ctx.fillStyle = 'white';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

// Draw bricks
function drawBricks() {
    bricks.forEach((row, rIndex) => {
        row.forEach((brick, cIndex) => {
            if (brick.status) {
                const brickX = cIndex * (80 + 10) + 35;
                const brickY = rIndex * (20 + 10) + 50;
                brick.x = brickX;
                brick.y = brickY;
                ctx.fillStyle = 'blue';
                ctx.fillRect(brickX, brickY, 80, 20);
            }
        });
    });
}

// Draw score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Display "You Win" message
function displayWinMessage() {
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
}

// Move paddle
function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        ball.dy *= -1;
    }

    if (ball.y - ball.radius > canvas.height) {
        alert('Game Over!');
        initializeGame();
        draw();
    }
}

// Break bricks
function breakBricks() {
    bricks.forEach((row) => {
        row.forEach((brick) => {
            if (brick.status) {
                if (
                    ball.x > brick.x &&
                    ball.x < brick.x + 80 &&
                    ball.y > brick.y &&
                    ball.y < brick.y + 20
                ) {
                    ball.dy *= -1;
                    brick.status = 0;
                    score += 10;
                }
            }
        });
    });
}

// Check if all bricks are destroyed
function checkWinCondition() {
    const allBricksDestroyed = bricks.every((row) =>
        row.every((brick) => brick.status === 0)
    );
    if (allBricksDestroyed) {
        isGameWon = true;
        isGameRunning = false;
        restartButton.disabled = false;
    }
}

// Update game
function update() {
    if (!isGameRunning) return;

    movePaddle();
    moveBall();
    breakBricks();
    checkWinCondition();
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    drawBricks();
    drawScore();

    if (isGameWon) {
        displayWinMessage();
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    if (isGameRunning || isGameWon) {
        requestAnimationFrame(gameLoop);
    }
}

// Start game
playButton.addEventListener('click', () => {
    isGameRunning = true;
    playButton.disabled = true;
    restartButton.disabled = false;
    gameLoop();
});

// Restart game
restartButton.addEventListener('click', () => {
    initializeGame();
    playButton.disabled = false;
    restartButton.disabled = true;
    draw();
});

// Initialize game
initializeGame();
draw();
