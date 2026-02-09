
const WIDTH = 800;
const HEIGHT = 600;

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

let loaded = 0;
for (const key in imageSources) {
  images[key] = new Image();
  images[key].src = imageSources[key];
  images[key].onload = () => {
    loaded++;
    if (loaded === Object.keys(imageSources).length) {
      loop();
    }
  };
}

// ---- Player ----
const player = {
  x: 400,
  y: 350,
  size: 20,
  gold: 10,
  apple: 0,
  dagger: 0
};

// ---- Traders ----
const traders = [
  { type: "apple", x: 250, y: 200, stock: 6 },
  { type: "dagger", x: 550, y: 200, stock: 4 }
];

// ---- Input ----
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// ---- Helpers ----
function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// ---- UI ----
function drawUI() {
  ctx.fillStyle = "black";
  ctx.font = "14px Arial";
  ctx.fillText(
    `WASD: Move, E: Trade`,
    10, 20
  );
  ctx.fillText(
    `Player Gold: ${player.gold} | Apples: ${player.apple} | Daggers: ${player.dagger}`,
    10, 40
  );
}

// ---- Traders ----
function drawTraders() {
  let greeting = false;

  traders.forEach(t => {
    const dist = distance(player, t);

    // Outline when close
    if (dist < 130) {
      greeting = true;
      ctx.fillStyle = TRADER_COLOR_OUTLINE;
      ctx.fillRect(t.x - 80, t.y - 60, 160, 120);
    }

    // Trader body
    ctx.fillStyle = TRADER_COLOR;
    ctx.fillRect(t.x - 70, t.y - 50, 140, 100);

    // Items
    for (let i = 0; i < t.stock; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = t.x - 40 + col * 20;
      const y = t.y + row * 20;

      ctx.drawImage(images[t.type], x - 8, y - 8, 16, 16);
    }
  });

  document.title = greeting ? "Hello traveller" : "Trading Hub RPG";
}

// ---- Movement ----
function move(dx, dy) {
  player.x += dx;
  player.y += dy;
}

// ---- Interaction ----
function buy(trader) {
  const price = 1;
  document.title = "Trading is not implemented yet!";

  // (stub for future trade logic)

  drawUI();
}

// ---- Update ----
function update() {
  if (keys["w"]) move(0, -5);
  if (keys["s"]) move(0, 5);
  if (keys["a"]) move(-5, 0);
  if (keys["d"]) move(5, 0);

  if (keys["e"]) {
    for (const t of traders) {
      if (distance(player, t) < 130) {
        buy(t);
        keys["e"] = false;
        return;
      }
    }
    document.title = "No trader nearby";
    keys["e"] = false;
  }
}

// ---- Draw ----
function draw() {
  // Background
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  drawTraders();

  // Player
  ctx.drawImage(
    images.player,
    player.x - 16,
    player.y - 16,
    32,
    32
  );

  drawUI();
}

// ---- Game Loop ----
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
