const dino = document.getElementById('dino');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

let isJumping = false;
let jumpCount = 0;
let position = 10;
let velocity = 0;
const gravity = 0.6;
const initialJumpVelocity = 12;
let score = 0;
let gameSpeed = 42; // 原来是60，加快30%
let gameLoop;

function jump() {
    if (jumpCount < 2) { // 允许最多两次跳跃（地面一次，空中一次）
        velocity = initialJumpVelocity;
        jumpCount++;
    }
    
    if (!isJumping) {
        isJumping = true;
        requestAnimationFrame(jumpAnimation);
    }
}

function jumpAnimation() {
    velocity -= gravity;
    position += velocity;
    
    if (position <= 10) {
        position = 10;
        isJumping = false;
        jumpCount = 0; // 重置跳跃次数
        velocity = 0;
    } else {
        requestAnimationFrame(jumpAnimation);
    }
    
    dino.style.bottom = position + 'px';
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
        event.preventDefault(); // 防止空格键滚动页面
        jump();
    }
});

// 添加点击事件监听器
document.addEventListener('click', () => {
    jump();
});

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    
    function spawnCactus() {
        createCactus();
        // 随机设置下一个仙人掌的出现时间，范围在1000ms到2000ms之间
        const nextSpawnTime = Math.random() * 1000 + 1000;
        setTimeout(spawnCactus, nextSpawnTime);
    }
    
    spawnCactus();
    
    // 移除这一行，如果它存在的话
    // gameLoop = setInterval(updateScore, gameSpeed);
}

startGame();
