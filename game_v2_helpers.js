const WIDTH = 800;
const HEIGHT = 600;

const BG_COLOR = "#b2c88e";
const TRADER_COLOR = "#928762";
const TRADER_COLOR_OUTLINE = "#B8AC82";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const goldEl = document.getElementById("goldEl");
const appleEl = document.getElementById("appleEl");
const daggerEl = document.getElementById("daggerEl");
const flowerEl = document.getElementById("flowerEl");
const traderStockEl = document.getElementById("traderStockEl");
const statusMsgEl = document.getElementById("statusMsg");

// ---- Images ----
const images = {};
images.player = new Image();
images.player.onload = draw;
images.player.src = "assets/player_01_128_3.png";
images.apple = new Image();
images.apple.onload = draw;
images.apple.src = "assets/apple_01_32.png";
images.dagger = new Image();
images.dagger.onload = draw;
images.dagger.src = "assets/dagger_01_50.png";
images.flower = new Image();
images.flower.onload = draw;
images.flower.src = "assets/flower_01.png";
images.bird = new Image();
images.bird.onload = draw;
images.bird.src = "assets/bird_02.png";

const birdSize = 80;
const birdX = 10 + birdSize / 2;
const birdY = HEIGHT - 10 - birdSize / 2;

let showPlayerSpeech = false;

// ---- UI ----
let statusMessage = "";

function updateUI() {
  goldEl.textContent = `Gold: ${player.gold}`;
  appleEl.textContent = `Apples: ${player.apple}`;
  daggerEl.textContent = `Daggers: ${player.dagger}`;
  flowerEl.textContent = `Flowers: ${player.flower}`;
  const nearTrader = getNearTrader();
  traderStockEl.textContent = nearTrader ? `${nearTrader.type}s: ${nearTrader.stock}` : "";
  statusMsgEl.textContent = statusMessage;
}

// ---- Helpers ----
function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getNearTrader() {
  for (const t of traders) {
    if (distance(player, t) < 80) {
      return t;
    }
  }
  return null;
}

// ---- Drawing ----
function drawSpeechBubble(text, x, y) {
  const lines = Array.isArray(text) ? text : [text];
  const padding = 6;
  const lineHeight = 18;
  ctx.font = "14px Arial";
  const textWidth = Math.max(...lines.map(l => ctx.measureText(l).width));
  const bubbleW = textWidth + padding * 2;
  const bubbleH = lineHeight * lines.length + padding * 2;
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, bubbleW, bubbleH);
  ctx.strokeStyle = "#aaa";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, bubbleW, bubbleH);
  ctx.fillStyle = "#333";
  lines.forEach((line, i) => {
    ctx.fillText(line, x + padding, y + padding + lineHeight * (i + 1) - 4);
  });
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.drawImage(images.bird, birdX - birdSize / 2, birdY - birdSize / 2, birdSize, birdSize);

  if (distance(player, { x: birdX, y: birdY }) < 100) {
    drawSpeechBubble(birdSpeech(), birdX - birdSize / 2, birdY - birdSize / 2 - 50);
  }

  drawTraders();
  drawPlayer();

  if (showPlayerSpeech) {
    const text = playerSpeech();
    const lines = Array.isArray(text) ? text : [text];
    const padding = 6;
    const lineHeight = 18;
    ctx.font = "14px Arial";
    const textWidth = Math.max(...lines.map(l => ctx.measureText(l).width));
    const bubbleW = textWidth + padding * 2;
    const bubbleH = lineHeight * lines.length + padding * 2;
    drawSpeechBubble(text, WIDTH - bubbleW - 10, HEIGHT - bubbleH - 10);
  }
}

function drawPlayer() {
  const playerWidth = 60;
  ctx.drawImage(images.player, player.x - playerWidth * 0.5, player.y - playerWidth * 0.5, playerWidth, playerWidth);
}

function drawTraders() {
  traders.forEach(t => {
    const dist = distance(player, t);

    if (dist < 80) {
      ctx.fillStyle = TRADER_COLOR_OUTLINE;
      ctx.fillRect(t.x - 60, t.y - 50, 120, 100);
    }

    ctx.fillStyle = TRADER_COLOR;
    ctx.fillRect(t.x - 50, t.y - 40, 100, 80);

    // Stock items
    for (let i = 0; i < t.stock; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = t.x - 34 + col * 15;
      const y = t.y - 10 + row * 17;
      ctx.drawImage(images[t.type], x - 8, y - 8, 24, 24);
    }
  });
}

// ---- Movement ----
function move(dx, dy) {
  player.x += dx;
  player.y += dy;

  // Auto greeting
  const nearTrader = getNearTrader();
  statusMessage = nearTrader ? "Hello traveller" : "";
  showPlayerSpeech = false;
  updateUI();
  draw();
}

// ---- Input ----
function onKeydown(e) {
  const key = e.key.toLowerCase();

  if (key == "w") move(0, -10);
  else if (key == "s") move(0, 10);
  else if (key == "a") move(-10, 0);
  else if (key == "d") move(10, 0);
  else if (key == "t") {
    showPlayerSpeech = !showPlayerSpeech;
    draw();
  }
  else if (key == "e") {
    const nearTrader = getNearTrader();
    if (nearTrader) {
      buy(nearTrader);
    } else {
      statusMessage = "No trader nearby";
      console.log('Attempting to trade: ', statusMessage);
      updateUI();
    }
  }
}
window.addEventListener("keydown", onKeydown);

updateUI();
draw();
