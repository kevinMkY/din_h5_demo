const dino = document.getElementById('dino');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

let isJumping = false;
let score = 0;
let gameSpeed = 42; // 原来是60，加快30%
let gameLoop;

function jump() {
    if (isJumping) return;
    
    let position = 10;
    let velocity = 8;
    let gravity = 0.2;
    isJumping = true;
    
    function jumpAnimation() {
        velocity -= gravity;
        position += velocity;
        
        if (position <= 10) {
            position = 10;
            isJumping = false;
            return;
        }
        
        dino.style.bottom = position + 'px';
        requestAnimationFrame(jumpAnimation);
    }
    
    requestAnimationFrame(jumpAnimation);
}

function createCactus() {
    const cactus = document.createElement('div');
    cactus.classList.add('cactus');
    const cactusImg = document.createElement('img');
    cactusImg.src = 'leaf1.webp';
    cactusImg.alt = 'Cactus';
    cactus.appendChild(cactusImg);
    gameContainer.appendChild(cactus);
    
    let position = 0;
    cactus.style.left = gameContainer.clientWidth + 'px';
    
    function moveCactus() {
        position += 3;
        cactus.style.left = (gameContainer.clientWidth - position) + 'px';
        
        if (position > gameContainer.clientWidth + 50) {
            gameContainer.removeChild(cactus);
            updateScore(); // 仙人掌完全离开屏幕时更新得分
            return;
        }
        
        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();
        
        if (
            dinoRect.right > cactusRect.left &&
            dinoRect.left < cactusRect.right &&
            dinoRect.bottom > cactusRect.top
        ) {
            gameOver();
            return;
        }
        
        requestAnimationFrame(moveCactus);
    }
    
    requestAnimationFrame(moveCactus);
}

function updateScore() {
    score++;
    scoreDisplay.textContent = score;
}

function gameOver() {
    clearInterval(gameLoop);
    document.body.innerHTML = `<h1>游戏结束! 得分: ${score}</h1>`;
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    
    function spawnCactus() {
        createCactus();
        // 将时间范围从 2000ms-4000ms 缩短到 667ms-1333ms (大约是原来的1/3)
        const nextSpawnTime = Math.random() * 667 + 667;
        setTimeout(spawnCactus, nextSpawnTime);
    }
    
    spawnCactus();
    
    gameLoop = setInterval(updateScore, gameSpeed);
}

startGame();
