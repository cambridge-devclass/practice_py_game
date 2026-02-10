const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const goldEl = document.getElementById("gold");
const applesEl = document.getElementById("apples");
const daggersEl = document.getElementById("daggers");
const traderApplesEl = document.getElementById("appleTraderStock");
const traderDaggersEl = document.getElementById("daggerTraderStock");
const tradeMsgEl = document.getElementById("tradeMsg");

const WIDTH = 800;
const HEIGHT = 600;

const TRADER_COLOR = "#928762";
const TRADER_COLOR_OUTLINE = "#B8AC82";

let playerX = 400;
let playerY = 350;

const appleTraderX = 280;
const appleTraderY = 220;
const daggerTraderX = 520;
const daggerTraderY = 220;

const birdSize = 80;
const birdX = 10 + birdSize / 2;
const birdY = HEIGHT - 10 - birdSize / 2;

let showPlayerSpeech = false;

// ---- Images ----
const images = {};
images.player = new Image();
images.player.onload = draw;
images.player.src = "assets/player_01_128_3.png";
images.apple = new Image();
images.apple.onload = draw;
images.apple.src = "assets/apple_01_50.png";
images.dagger = new Image();
images.dagger.onload = draw;
images.dagger.src = "assets/dagger_01.png";
images.bird = new Image();
images.bird.onload = draw;
images.bird.src = "assets/bird_02.png";

function drawPlayer() {
  const size = 60;
  ctx.drawImage(images.player, playerX - size * 0.5, playerY - size * 0.5, size, size);
}

function drawTrader(tx, ty, itemImage, stock) {
  const dist = Math.hypot(playerX - tx, playerY - ty);

  if (dist < 100) {
    ctx.fillStyle = TRADER_COLOR_OUTLINE;
    ctx.fillRect(tx - 60, ty - 50, 120, 100);
  }

  ctx.fillStyle = TRADER_COLOR;
  ctx.fillRect(tx - 50, ty - 40, 100, 80);

  for (let i = 0; i < stock; i++) {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = tx - 34 + col * 15;
    const y = ty - 10 + row * 17;
    ctx.drawImage(itemImage, x - 8, y - 8, 24, 24);
  }
}

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
  ctx.fillStyle = "#b2c88e";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.drawImage(images.bird, birdX - birdSize / 2, birdY - birdSize / 2, birdSize, birdSize);

  if (Math.hypot(playerX - birdX, playerY - birdY) < 100) {
    const text = birdSpeech();
    drawSpeechBubble(text, birdX - birdSize / 2, birdY - birdSize / 2 - 50);
  }

  drawTrader(appleTraderX, appleTraderY, images.apple, traderApples);
  drawTrader(daggerTraderX, daggerTraderY, images.dagger, traderDaggers);
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

function updateUI() {
  goldEl.textContent = `Gold: ${playerGold}`;
  applesEl.textContent = `Apples: ${playerApples}`;
  daggersEl.textContent = `Daggers: ${playerDaggers}`;
  const nearApple = Math.hypot(playerX - appleTraderX, playerY - appleTraderY) < 100;
  const nearDagger = Math.hypot(playerX - daggerTraderX, playerY - daggerTraderY) < 100;
  traderApplesEl.textContent = nearApple ? `Apples: ${traderApples}` : "";
  traderDaggersEl.textContent = nearDagger ? `Daggers: ${traderDaggers}` : "";
  if (nearApple || nearDagger) {
    tradeMsgEl.textContent = "Hello traveller";
  } else {
    tradeMsgEl.textContent = "";
  }
}

function move(dx, dy) {
  playerX += dx;
  playerY += dy;
  showPlayerSpeech = false;
  updateUI();
  draw();
}

document.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case "w": move(0, -10); break;
    case "s": move(0, 10); break;
    case "a": move(-10, 0); break;
    case "d": move(10, 0); break;
    case "e":
      if (Math.hypot(playerX - appleTraderX, playerY - appleTraderY) < 100) {
        buyApple();
      } else if (Math.hypot(playerX - daggerTraderX, playerY - daggerTraderY) < 100) {
        buyDagger();
      } else {
        tradeMsgEl.textContent = "No trader nearby.";
      }
      break;
    case "t":
      showPlayerSpeech = !showPlayerSpeech;
      draw();
      break;
    case "r":
      if (Math.hypot(playerX - appleTraderX, playerY - appleTraderY) < 100) {
        sellApple();
      } else if (Math.hypot(playerX - daggerTraderX, playerY - daggerTraderY) < 100) {
        sellDagger();
      } else {
        tradeMsgEl.textContent = "No trader nearby.";
      }
      break;
  }
});

updateUI();
draw();
