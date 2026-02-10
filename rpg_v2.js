const WIDTH = 600;
const HEIGHT = 450;

const BG_COLOR = "#b2c88e";
const TRADER_COLOR = "#928762";
const TRADER_COLOR_OUTLINE = "#B8AC82";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ---- Images ----
const images = {};
const imageSources = {
  player: "assets/player_01_128.png",
  apple: "assets/apple_01_32.png",
  dagger: "assets/dagger_01_50.png"
};

let imagesLoaded = 0;
for (const key in imageSources) {
  images[key] = new Image();
  images[key].src = imageSources[key];
  images[key].onload = () => {
    imagesLoaded++;
    if (imagesLoaded === Object.keys(imageSources).length) {
      draw();
    }
  };
}

// ---- Player ----
const player = {
  x: 300,
  y: 300,
  gold: 10,
  apple: 0,
  dagger: 0
};

// ---- Traders ----
const traders = [
  { type: "apple", x: 200, y: 200, stock: 6 },
  { type: "dagger", x: 400, y: 200, stock: 4 }
];

// ---- UI message ----
let statusMessage = "";

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
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  drawTraders();
  drawPlayer();
  drawUI();
  drawMessage();
}

function drawPlayer() {
  ctx.drawImage(images.player, player.x - 16, player.y - 16, 32, 32);
}

function drawTraders() {
  traders.forEach(t => {
    const dist = distance(player, t);

    if (dist < 80) {
      nearTrader = true;
      ctx.fillStyle = TRADER_COLOR_OUTLINE;
      ctx.fillRect(t.x - 60, t.y - 50, 120, 100);
    }

    ctx.fillStyle = TRADER_COLOR;
    ctx.fillRect(t.x - 50, t.y - 40, 100, 80);

    // Stock items
    for (let i = 0; i < t.stock; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = t.x - 30 + col * 15;
      const y = t.y + row * 17;
      ctx.drawImage(images[t.type], x - 8, y - 8, 16, 16);
    }
  });
}

function drawUI() {
  ctx.fillStyle = "black";
  ctx.font = "14px Arial";
  ctx.fillText("WASD: Move, E: Trade", 10, 20);
  ctx.fillText(
    `Gold: ${player.gold} | Apples: ${player.apple} | Daggers: ${player.dagger}`,
    10, 40
  );
}

function drawMessage() {
  if (statusMessage) {
    ctx.textAlign = "right";
    ctx.font = "16px Arial";
    ctx.fillText(statusMessage, WIDTH - 10, 20);
    ctx.textAlign = "left"; // reset
  }
}

// ---- Movement ----
function move(dx, dy) {
  player.x += dx;
  player.y += dy;

  // Auto greeting
  const nearTrader = getNearTrader();
  statusMessage = nearTrader ? "Hello traveller" : "";
  draw();
}

// ---- Interaction ----
function buy(trader) {
  statusMessage = "Trading is not implemented yet!";
  console.log('Attempting to trade, trader:', trader);
  // Complete the trade logic below. 
  // Keep the line "draw()" at the end of the function - 
  // - it updates the screen when inventory is changed.

  draw();
}

// ---- Input ----
function onKeydown(e) {
  const key = e.key.toLowerCase();

  if (key == "w") move(0, -10);
  else if (key == "s") move(0, 10);
  else if (key == "a") move(-10, 0);
  else if (key == "d") move(10, 0);
  else if (key == "e") {
    const nearTrader = getNearTrader();
    if (nearTrader) {
      buy(nearTrader);
    } else {
      statusMessage = "No trader nearby";
      console.log('Attempting to trade: ', statusMessage);
      drawMessage();
    }
  }
}
window.addEventListener("keydown", onKeydown);
