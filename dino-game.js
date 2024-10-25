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
let gameOver = false;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let animationId;

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
            endGame();
            return;
        }
        
        if (!gameOver) {
            requestAnimationFrame(moveCactus);
        }
    }
    
    if (!gameOver) {
        requestAnimationFrame(moveCactus);
    }
}

function updateScore() {
    score++;
    scoreDisplay.textContent = score;
}

function endGame() {
    gameOver = true;
    cancelAnimationFrame(animationId);

    // 设置 canvas 大小为游戏容器的大小
    canvas.width = gameContainer.clientWidth;
    canvas.height = gameContainer.clientHeight;
    gameContainer.appendChild(canvas);

    // 绘制半透明背景
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制游戏结束文本
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("游戏结束", canvas.width / 2, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("点击屏幕重新开始", canvas.width / 2, canvas.height / 2 + 40);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); // 防止空格键滚动页面
        jump();
    }
});

// 添加点击事件监听器
document.addEventListener('click', () => {
    if (gameOver) {
        resetGame();
    } else {
        jump();
    }
});

function resetGame() {
    // 移除 canvas
    if (gameContainer.contains(canvas)) {
        gameContainer.removeChild(canvas);
    }

    // 重置游戏状态
    gameOver = false;
    score = 0;
    scoreDisplay.textContent = score;
    position = 10;
    velocity = 0;
    jumpCount = 0;
    isJumping = false;

    // 移除所有现有的仙人掌
    const cacti = document.querySelectorAll('.cactus');
    cacti.forEach(cactus => cactus.remove());

    // 重新开始游戏
    startGame();
}

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    gameOver = false;
    
    function spawnCactus() {
        if (!gameOver) {
            createCactus();
            // 增加间隔时间，范围在2000ms到4000ms之间
            const nextSpawnTime = Math.random() * 1000 + 1000;
            setTimeout(spawnCactus, nextSpawnTime);
        }
    }
    
    // 延迟开始生成仙人掌，给玩家一些准备时间
    setTimeout(spawnCactus, 1000);
}

startGame();
