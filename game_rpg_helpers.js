const WIDTH = 950;
const HEIGHT = 600;

const BG_COLOR = "#b2c88e";
const TRADER_COLOR = "#928762";
const TRADER_COLOR_OUTLINE = "#B8AC82";
const SMALL_TRADERS_BG_COLOR = "#9db27b";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const detectDist = 80;
const detectDistSmall = 60;
const traderSize = { w: 85, h: 75 };
const traderSizeSmall = { w: 65, h: 60 };

const goldEl = document.getElementById("goldEl");
const appleEl = document.getElementById("appleEl");
const daggerEl = document.getElementById("daggerEl");
const flowerEl = document.getElementById("flowerEl");
const carrotEl = document.getElementById("carrotEl");
const mushroomEl = document.getElementById("mushroomEl");
const acornEl = document.getElementById("acornEl");
const twigEl = document.getElementById("twigEl");
const onionEl = document.getElementById("onionEl");
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
images.flower.src = "assets/flower_02.png";
images.carrot = new Image();
images.carrot.onload = draw;
images.carrot.src = "assets/carrot_02.png";
images.mushroom = new Image();
images.mushroom.onload = draw;
images.mushroom.src = "assets/mushroom_01.png";
images.bird = new Image();
images.bird.onload = draw;
images.bird.src = "assets/bird_02.png";
images.dirt = new Image();
images.dirt.onload = draw;
images.dirt.src = "assets/grass_02.jpg";
images.acorn = new Image();
images.acorn.onload = draw;
images.acorn.src = "assets/acorn_03.png";
images.onion = new Image();
images.onion.onload = draw;
images.onion.src = "assets/onion_01.png";
images.twig = new Image();
images.twig.onload = draw;
images.twig.src = "assets/twig_01.png";
images.bkg = new Image();
images.bkg.onload = draw;
images.bkg.src = "assets/bkg_04.png";

const birdSize = 80;
const birdX = 20 + birdSize / 2;
const birdY = HEIGHT - 10 - birdSize / 2;

let showPlayerSpeech = false;

// ---- Player & Traders for drawing ----
const playerDraw = {
  x: 450,
  y: 350,
};
const tradersDraw = [
  { type: "apple", x: 320, y: 220, },
  { type: "dagger", x: 450, y: 220 },
  { type: "onion", x: 710, y: 235 },
  // { type: "acorn", x: 700, y: 235 },
  // { type: "flower", x: 700, y: 235 },
  // { type: "carrot", x: 700, y: 370 },
  { type: "twig", x: 700, y: 370 },
  { type: "mushroom", x: 800, y: 305 },
  // { type: "acorn", x: 610, y: 235 },
];

// ---- UI ----
let statusMessage = "";

function updateUI() {
  goldEl.textContent = `Gold: ${playerGold}`;
  appleEl.textContent = `Apples: ${playerApples}`;
  daggerEl.textContent = `Daggers: ${playerDaggers}`;
  mushroomEl.textContent = `Mushrooms: ${player.mushroom}`;
  twigEl.textContent = `Twigs: ${player.twig}`;
  onionEl.textContent = `Onions: ${player.onion}`;
  // flowerEl.textContent = `Flowers: ${player.flower}`;
  // carrotEl.textContent = `Carrots: ${player.carrot}`;
  // acornEl.textContent = `Berries: ${player.acorn}`;
  const nearTrader = getNearTrader();
  traderStockEl.textContent = nearTrader ? `${nearTrader.type}s: ${getStock(nearTrader.type)}` : "";
  statusMsgEl.textContent = statusMessage;
}

// ---- Helpers ----
function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getTraderGroup(type) {
  return (type === "carrot" || type === "flower" || type === "mushroom" || type === "acorn" || type === "twig" || type === "onion");
}

function getNearTrader() {
  for (const t of tradersDraw) {
    const dist = getTraderGroup(t.type) ? detectDistSmall : detectDist; 
    if (distance(playerDraw, t) < dist) {
      const trader = traders.find(tr => tr.type === t.type);
      return trader || t;
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
  // ctx.drawImage(images.bkg, 0, 0, WIDTH, HEIGHT);

  ctx.drawImage(images.bird, birdX - birdSize / 2, birdY - birdSize / 2, birdSize, birdSize);

  if (distance(playerDraw, { x: birdX, y: birdY }) < 100) {
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
  ctx.drawImage(images.player, playerDraw.x - playerWidth * 0.5, playerDraw.y - playerWidth * 0.5, playerWidth, playerWidth);
}

function getStock(type) {
  if (type === "apple") return traderApples;
  if (type === "dagger") return traderDaggers;
  const trader = traders.find(tr => tr.type === type);
  return trader ? trader.stock : 0;
}

function drawTraderSmall(t, dist) {
  const hw = traderSizeSmall.w / 2;
  const hh = traderSizeSmall.h / 2;

  if (dist < detectDistSmall) {
    ctx.fillStyle = TRADER_COLOR_OUTLINE;
    ctx.fillRect(t.x - hw, t.y - hh, traderSizeSmall.w, traderSizeSmall.h);
  }

  // Stock items
  for (let i = 0; i < getStock(t.type); i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = t.x - hw + 14 + col * 15;
    const y = t.y - hh + 20 + row * 17;
    const img = images[t.type];
    const h = 24;
    const w = h * img.naturalWidth / img.naturalHeight;
    ctx.drawImage(img, x - 8, y - 8, w, h);
  }
}

function drawTraders() {
  // Background grouping rect for small traders
  const pad = 25;
  const hw = traderSizeSmall.w / 2;
  const hh = traderSizeSmall.h / 2;
  const smallTraders = tradersDraw.filter(t => getTraderGroup(t.type));
  const minX = Math.min(...smallTraders.map(t => t.x - hw)) - pad;
  const maxX = Math.max(...smallTraders.map(t => t.x + hw)) + pad;
  const minY = Math.min(...smallTraders.map(t => t.y - hh)) - pad;
  const maxY = Math.max(...smallTraders.map(t => t.y + hh)) + pad;
  const rectW = maxX - minX;
  const rectH = maxY - minY;
  ctx.fillStyle = SMALL_TRADERS_BG_COLOR;
  ctx.fillRect(minX, minY, rectW, rectH);

  tradersDraw.forEach(t => {
    const dist = distance(playerDraw, t);

    if (getTraderGroup(t.type)) {
      drawTraderSmall(t, dist);
      return;
    }

    const hw = traderSize.w / 2;
    const hh = traderSize.h / 2;
    const pad = 10;

    if (dist < detectDist) {
      ctx.fillStyle = TRADER_COLOR_OUTLINE;
      ctx.fillRect(t.x - hw - pad, t.y - hh - pad, traderSize.w + pad * 2, traderSize.h + pad * 2);
    }

    ctx.fillStyle = TRADER_COLOR;
    ctx.fillRect(t.x - hw, t.y - hh, traderSize.w, traderSize.h);
    /*
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(t.x - hw, t.y - hh, traderSize.w, traderSize.h);
    */

    // Stock items
    for (let i = 0; i < getStock(t.type); i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = t.x - hw + 16 + col * 15;
      const y = t.y - hh + 30 + row * 17;
      const img = images[t.type];
      const h = 24;
      const w = h * img.naturalWidth / img.naturalHeight;
      ctx.drawImage(img, x - 8, y - 8, w, h);
    }
  });
}

// ---- Movement ----
function move(dx, dy) {
  playerDraw.x += dx;
  playerDraw.y += dy;

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
      if (nearTrader.type === "apple") { snapshotBeforeBuyApple(); buyApple(); setTimeout(testBuyApple, 100); }
      else if (nearTrader.type === "dagger") { snapshotBeforeBuyDagger(); buyDagger(); setTimeout(testBuyDagger, 100); }
      else { snapshotBeforeBuy(nearTrader); buy(nearTrader); setTimeout(testBuy, 100); }
    } else {
      statusMessage = "No trader nearby";
      console.log('Attempting to trade: ', statusMessage);
      updateUI();
    }
  }
  else if (key == "r") {
    const nearTrader = getNearTrader();
    if (nearTrader) {
      if (nearTrader.type === "apple") { snapshotBeforeSellApple(); sellApple(); setTimeout(testSellApple, 100); }
      else if (nearTrader.type === "dagger") { snapshotBeforeSellDagger(); sellDagger(); setTimeout(testSellDagger, 100); }
      else { snapshotBeforeSell(nearTrader); sell(nearTrader); setTimeout(testSell, 100); }
    } else {
      statusMessage = "No trader nearby";
      updateUI();
    }
  }
}
window.addEventListener("keydown", onKeydown);

updateUI();
draw();
