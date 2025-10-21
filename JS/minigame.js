const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameRunning = false;
let gameSpeed = 2;
let gravity = 0.3;
let jumpForce = -9.5;
let obstacles = [];
let shoes = [];
let score = 0;
let username = "";
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").textContent = highScore;

// Obrázky
const bataImg = new Image(); bataImg.src = "../images/bata.png";
const cihlaImg = new Image(); cihlaImg.src = "../images/cihla.png";
const shoeImg = new Image(); shoeImg.src = "../images/bota.png";

// Poměr plátna
function resizeCanvas() {
  const parentWidth = canvas.parentElement.clientWidth;
  const ratio = 800 / 300;
  canvas.width = parentWidth;
  canvas.height = parentWidth / ratio;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const bata = {
  x: 50, y: 0, width: 40, height: 60, yVelocity: 0, isJumping: false,
  draw() { ctx.drawImage(bataImg, this.x, this.y, this.width, this.height); },
  update() {
    this.y += this.yVelocity;
    this.yVelocity += gravity;
    if (this.y + this.height >= canvas.height - 10) {
      this.y = canvas.height - this.height - 10;
      this.isJumping = false;
    }
    this.draw();
  },
  jump() { if (!this.isJumping) { this.yVelocity = jumpForce; this.isJumping = true; } },
  reset() { this.y = canvas.height - this.height - 10; this.yVelocity = 0; this.isJumping = false; }
};

class Obstacle {
  constructor() {
    this.width = 30; this.height = 30;
    this.x = canvas.width; this.y = canvas.height - this.height - 10;
  }
  draw() { ctx.drawImage(cihlaImg, this.x, this.y, this.width, this.height); }
  update() { this.x -= gameSpeed; this.draw(); }
}

class Shoe {
  constructor() {
    this.width = 25; this.height = 25;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height / 2) + 50;
  }
  draw() { ctx.drawImage(shoeImg, this.x, this.y, this.width, this.height); }
  update() { this.x -= gameSpeed; this.draw(); }
}

function detectCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function spawnObjects() {
  if (Math.random() < 0.02) obstacles.push(new Obstacle());
  if (Math.random() < 0.01) shoes.push(new Shoe());
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bata.update();
  spawnObjects();

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    if (detectCollision(bata, obstacles[i])) endGame();
    if (obstacles[i].x + obstacles[i].width < 0) obstacles.splice(i, 1);
  }

  for (let i = shoes.length - 1; i >= 0; i--) {
    shoes[i].update();
    if (detectCollision(bata, shoes[i])) {
      shoes.splice(i, 1);
      score++;
      document.getElementById("score").textContent = score;
    }
    if (shoes[i].x + shoes[i].width < 0) shoes.splice(i, 1);
  }

  requestAnimationFrame(gameLoop);
}

function startGame() {
  username = document.getElementById("playerName").value.trim();
  if (!username) return alert("Zadej své jméno!");

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("scoreDisplay").style.display = "block";
  canvas.style.display = "block";

  obstacles = [];
  shoes = [];
  score = 0;
  bata.reset();
  gameRunning = true;
  gameLoop();
}

async function endGame() {
  gameRunning = false;
  document.getElementById("scoreDisplay").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("finalScore").textContent = score;

  await fetch("https://bataskola.hys.cz/api/save_score.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, score })
  });

  loadLeaderboard();
}

async function loadLeaderboard() {
  const res = await fetch("https://bataskola.hys.cz/api/save_score.php");
  const data = await res.json();
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";
  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.username}: ${item.score}`;
    list.appendChild(li);
  });
}

function restartGame() {
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("scoreDisplay").style.display = "block";
  canvas.style.display = "block";
  obstacles = [];
  shoes = [];
  score = 0;
  bata.reset();
  gameRunning = true;
  gameLoop();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    bata.jump();
  }
});
document.addEventListener("touchstart", () => bata.jump());

loadLeaderboard();
