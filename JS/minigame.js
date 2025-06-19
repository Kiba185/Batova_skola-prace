const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameRunning = false;
let gameSpeed = 2;
let gravity = 0.3;
let jumpForce = -9.5;
let spawnTimer = 0;
let obstacles = [];
let framesSinceStart = 0;
let score = 0;
let scoreFrameCounter = 0;
let highScore = localStorage.getItem("highScore") || 0;
const maxYBase = 20;

document.getElementById("highScore").textContent = highScore;

// Načtení obrázků
const bataImg = new Image();
bataImg.src = '../images/bata.png';

const cihlaImg = new Image();
cihlaImg.src = '../images/cihla.png';

let scale = 1;

function resizeCanvas() {
  const parentWidth = canvas.parentElement.clientWidth;
  const ratio = 800 / 300;
  canvas.width = parentWidth;
  canvas.height = parentWidth / ratio;
  scale = canvas.height / 300;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const bata = {
  x: 50 * scale,
  y: 0,
  width: 30 * scale,
  height: 65 * scale,
  yVelocity: 0,
  isJumping: false,

  draw() {
    if (bataImg.complete && bataImg.naturalWidth > 0) {
      ctx.drawImage(bataImg, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = "black";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  },

  update() {
    this.y += this.yVelocity;
    this.yVelocity += gravity;

    const maxY = maxYBase * scale;
    if (this.y < maxY) {
      this.y = maxY;
      this.yVelocity = 0;
    }

    if (this.y + this.height >= canvas.height - 10 * scale) {
      this.y = canvas.height - this.height - 10 * scale;
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
    this.width = 30 * scale;
    this.height = 65 * scale;
    this.x = 50 * scale;
    this.y = canvas.height - this.height - 10 * scale;
    this.yVelocity = 0;
    this.isJumping = false;
  }
};

class Obstacle {
  constructor(heightRatio, speed) {
    this.heightRatio = heightRatio;
    this.speed = speed;
    this.rescale();
  }

  rescale() {
    this.width = 40 * scale;
    this.height = this.heightRatio * canvas.height;
    this.x = canvas.width;
    this.y = canvas.height - this.height - 10 * scale;
  }

  draw() {
    if (cihlaImg.complete && cihlaImg.naturalWidth > 0) {
      ctx.drawImage(cihlaImg, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  update() {
    this.x -= this.speed;
    this.draw();
  }
}

function spawnObstacle() {
  // překážky cca 10% výšky canvasu
  const heightRatio = 0.1;
  obstacles.push(new Obstacle(heightRatio, gameSpeed));
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
  if (scoreFrameCounter % 20 === 0) {
    score++;
    document.getElementById("score").textContent = score;
  }

  framesSinceStart++;
  if (framesSinceStart % 150 === 0) {
    gameSpeed += 0.1;
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

  resizeCanvas();

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
    e.preventDefault();
    bata.jump();
  }
});


document.addEventListener("touchstart", () => {
  bata.jump();
});
