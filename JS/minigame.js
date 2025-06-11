const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameRunning = false;
let gameSpeed = 1.5;
let gravity = 0.16;
let jumpForce = -9;
let spawnTimer = 0;
let obstacles = [];
let framesSinceStart = 0;
let score = 0;
let scoreFrameCounter = 0;
let highScore = localStorage.getItem("highScore") || 0;
const maxY = 20;

document.getElementById("highScore").textContent = highScore;

const bataImage = new Image();
bataImage.src = "bata.png";

const cihlaImage = new Image();
cihlaImage.src = "cihla.png";

const bata = {
  x: 50,
  y: 0,
  width: 40,
  height: 60,
  yVelocity: 0,
  isJumping: false,
  draw() {
    ctx.drawImage(bataImage, this.x, this.y, this.width, this.height);
  },
  update() {
    this.y += this.yVelocity;
    this.yVelocity += gravity;

    if (this.y < maxY) {
      this.y = maxY;
      this.yVelocity = 0;
    }

    if (this.y + this.height >= canvas.height - 10) {
      this.y = canvas.height - this.height - 10;
      this.isJumping = false;
    }

    this.draw();
  },
  jump() {
    if (!this.isJumping) {
      this.yVelocity = jumpForce;
      this.isJumping = true;
    }
  },
  reset() {
    this.y = canvas.height - this.height - 10;
    this.yVelocity = 0;
    this.isJumping = false;
  }
};

class Obstacle {
  constructor(height, speed) {
    this.width = 30;
    this.height = height;
    this.x = canvas.width;
    this.y = canvas.height - this.height - 10;
    this.speed = speed;
  }
  draw() {
    ctx.drawImage(cihlaImage, this.x, this.y, this.width, this.height);
  }
  update() {
    this.x -= this.speed;
    this.draw();
  }
}

function spawnObstacle() {
  let height = 30;
  obstacles.push(new Obstacle(height, gameSpeed));
}

function detectCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  scoreFrameCounter++;
  if (scoreFrameCounter % 15 === 0) {
    score++;
    document.getElementById("score").textContent = score;
  }

  framesSinceStart++;
  if (framesSinceStart % 150 === 0) {
    gameSpeed += 0.05;
  }

  bata.update();

  if (spawnTimer <= 0) {
    spawnObstacle();
    spawnTimer = Math.random() * 120 + 120;
  } else {
    spawnTimer--;
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.speed = gameSpeed;
    obs.update();

    if (detectCollision(bata, obs)) {
      endGame();
      return;
    }

    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
    }
  }

  requestAnimationFrame(gameLoop);
}

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  canvas.style.display = "block";
  document.getElementById("scoreDisplay").style.display = "block";

  obstacles = [];
  spawnTimer = 0;
  score = 0;
  scoreFrameCounter = 0;
  framesSinceStart = 0;
  gameSpeed = 1.5;

  bata.reset();
  gameRunning = true;
  gameLoop();
}

function endGame() {
  gameRunning = false;
  canvas.style.display = "none";
  document.getElementById("scoreDisplay").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("finalScore").textContent = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  document.getElementById("highScore").textContent = highScore;
  document.getElementById("finalHighScore").textContent = highScore;
}

function restartGame() {
  startGame();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    bata.jump();
  }
});

document.addEventListener("touchstart", () => {
  bata.jump();
});
