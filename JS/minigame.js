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
let scale = 1;
let playerName = '';

document.getElementById("highScore").textContent = highScore;

const bataImg = new Image();
bataImg.src = '../images/bata.png';
const cihlaImg = new Image();
cihlaImg.src = '../images/cihla.png';

function resizeCanvas() {
  const parentWidth = canvas.parentElement.clientWidth;
  const ratio = 800 / 300;
  canvas.width = parentWidth;
  canvas.height = parentWidth / ratio;
  scale = canvas.height / 300;
  bata.reset();
  obstacles.forEach(o => o.rescale());
}
window.addEventListener("resize", resizeCanvas);

const bata = {
  x: 50,
  y: 0,
  width: 40,
  height: 60,
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

    const maxY = 20 * scale;
    if (this.y < maxY) { this.y = maxY; this.yVelocity=0; }
    if (this.y + this.height >= canvas.height - 10*scale) {
      this.y = canvas.height - this.height - 10*scale;
      this.isJumping = false;
    }
    this.draw();
  },
  jump() {
    if(!this.isJumping){ this.yVelocity = jumpForce; this.isJumping = true; }
  },
  reset() {
    this.width = 40*scale;
    this.height = 60*scale;
    this.x = 50*scale;
    this.y = canvas.height - this.height - 10*scale;
    this.yVelocity = 0;
    this.isJumping = false;
  }
};

class Obstacle {
  constructor(heightRatio, speed){
    this.heightRatio = heightRatio;
    this.speed = speed;
    this.rescale();
  }
  rescale(){
    this.width = 40*scale;
    this.height = this.heightRatio * canvas.height;
    this.x = canvas.width;
    this.y = canvas.height - this.height - 10*scale;
  }
  draw(){
    if(cihlaImg.complete && cihlaImg.naturalWidth > 0){
      ctx.drawImage(cihlaImg,this.x,this.y,this.width,this.height);
    }else{
      ctx.fillStyle="red";
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
  }
  update(){ this.x -= this.speed; this.draw(); }
}

function spawnObstacle(){
  const heightRatio = 0.1;
  obstacles.push(new Obstacle(heightRatio, gameSpeed));
}

function detectCollision(r1,r2){
  return r1.x<r2.x+r2.width && r1.x+r1.width>r2.x && r1.y<r2.y+r2.height && r1.y+r1.height>r2.y;
}


function gameLoop(){
  if(!gameRunning) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  scoreFrameCounter++;
  if(scoreFrameCounter%20===0){ score++; document.getElementById("score").textContent=score; }

  framesSinceStart++;
  if(framesSinceStart%150===0) gameSpeed+=0.1;

  bata.update();

  if(spawnTimer<=0){ spawnObstacle(); spawnTimer = Math.random()*120+120; } else { spawnTimer--; }

  for(let i=obstacles.length-1;i>=0;i--){
    let obs = obstacles[i];
    obs.speed = gameSpeed;
    obs.update();
    if(detectCollision(bata, obs)){ endGame(); return; }
    if(obs.x+obs.width<0) obstacles.splice(i,1);
  }

  requestAnimationFrame(gameLoop);
}

function startGame(){
  document.getElementById("playerNameScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "block";
  document.getElementById("scoreDisplay").style.display = "block";
  canvas.style.display = "block";

  resizeCanvas();
  obstacles=[]; spawnTimer=0; score=0; scoreFrameCounter=0; framesSinceStart=0; gameSpeed=1.5;
  bata.reset(); gameRunning=true;
  gameLoop();
}

function endGame(){
  gameRunning=false;
  canvas.style.display="none";
  document.getElementById("scoreDisplay").style.display="none";
  document.getElementById("gameOverScreen").style.display="block";
  document.getElementById("finalScore").textContent=score;

  if(score>highScore){
    highScore=score;
    localStorage.setItem("highScore",highScore);
  }
  document.getElementById("highScore").textContent=highScore;
  document.getElementById("finalHighScore").textContent=highScore;

  // Odeslání score na hosting
  if(playerName){
    fetch('../scores.php?name='+encodeURIComponent(playerName)+'&score='+score)
      .then(resp=>resp.json())
      .then(data=>loadLeaderboard());
  }
}

function restartGame(){
  startGame();
}

// --- Leaderboard ---
function loadLeaderboard(){
  fetch('../scores.php?top=10')
    .then(resp=>resp.json())
    .then(data=>{
      const list = document.getElementById("leaderboardList");
      list.innerHTML="";
      data.forEach(item=>{
        const li=document.createElement("li");
        li.textContent=`${item.name}: ${item.score}`;
        list.appendChild(li);
      });
    });
}

document.getElementById("playerNameSubmit").addEventListener("click", ()=>{
  const input=document.getElementById("playerNameInput");
  if(input.value.trim()!==""){
    playerName=input.value.trim();
    startGame();
    loadLeaderboard();
  }
});

document.getElementById("restartBtn").addEventListener("click", ()=>{
  document.getElementById("gameOverScreen").style.display="none";
  startGame();
});

document.addEventListener("keydown",(e)=>{
  if(e.code==="Space" || e.code==="ArrowUp"){ e.preventDefault(); bata.jump(); }
});
document.addEventListener("touchstart",()=>{ bata.jump(); });
