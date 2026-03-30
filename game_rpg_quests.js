"use strict";

const quests = [
  { id: 1, description: "Buy apple", complete: false },
  { id: 2, description: "Sell apple", complete: false },
  { id: 3, description: "Buy dagger", complete: false },
  { id: 4, description: "Sell dagger", complete: false },
  { id: 5, description: "Buy mushroom", complete: false },
  { id: 6, description: "Sell mushroom", complete: false },
  { id: 7, description: "Wave to the bird", complete: false },
  { id: 8, description: "Talk to the bird", complete: false },
  { id: 9, description: "Sell mushrooms to citizen", complete: false },
];

function saveQuestProgress() {
  const data = {};
  quests.forEach(q => { data[q.id] = q.complete; });
  localStorage.setItem("questProgress", JSON.stringify(data));
}

function loadQuestProgress() {
  const raw = localStorage.getItem("questProgress");
  if (!raw) return;
  const data = JSON.parse(raw);
  console.log('loadedProgress:', data);
  quests.forEach(q => { if (data[q.id] !== undefined) q.complete = data[q.id]; });
}

function renderQuests() {
  const list = document.getElementById("questsList");
  list.innerHTML = "";
  quests.forEach(q => {
    const div = document.createElement("div");
    div.textContent = (q.complete ? "✓ " : "• ") + q.description;
    div.style.color = q.complete ? "rgb(38, 158, 38)" : "";
    list.appendChild(div);
  });
}

let _beforeBuyApple = null;

function snapshotBeforeBuyApple() {
  _beforeBuyApple = { gold: playerGold, apples: playerApples, stock: traderApples };
}

function testBuyApple() {
  if (!_beforeBuyApple) return;
  const { gold, apples, stock } = _beforeBuyApple;

  const stockDecreased = traderApples === stock - 1;
  const applesIncreased = playerApples === apples + 1;
  const goldDecreased = playerGold < gold;

  if (stockDecreased && applesIncreased && goldDecreased) {
    quests[0].complete = true;
    saveQuestProgress();
    renderQuests();
  }
  console.log('Tested:', quests[0]);

}

let _beforeBuyDagger = null;

function snapshotBeforeBuyDagger() {
  _beforeBuyDagger = { gold: playerGold, daggers: playerDaggers, stock: traderDaggers };
}

function testBuyDagger() {
  if (!_beforeBuyDagger) return;
  const { gold, daggers, stock } = _beforeBuyDagger;

  const stockDecreased = traderDaggers === stock - 1;
  const daggersIncreased = playerDaggers === daggers + 1;
  const goldDecreased = playerGold < gold;

  if (stockDecreased && daggersIncreased && goldDecreased) {
    quests[2].complete = true;
    renderQuests();
  }
  console.log('Tested:', quests[2]);
}

let _beforeSellApple = null;

function snapshotBeforeSellApple() {
  _beforeSellApple = { gold: playerGold, apples: playerApples, stock: traderApples };
}

function testSellApple() {
  if (!_beforeSellApple) return;
  const { gold, apples, stock } = _beforeSellApple;

  const stockIncreased = traderApples === stock + 1;
  const applesDecreased = playerApples === apples - 1;
  const goldIncreased = playerGold > gold;

  if (stockIncreased && applesDecreased && goldIncreased) {
    quests[1].complete = true;
    saveQuestProgress();
    renderQuests();
  }
  // console.log('Tested:', quests[1]);
}

let _beforeSellDagger = null;

function snapshotBeforeSellDagger() {
  _beforeSellDagger = { gold: playerGold, daggers: playerDaggers, stock: traderDaggers };
}

function testSellDagger() {
  if (!_beforeSellDagger) return;
  const { gold, daggers, stock } = _beforeSellDagger;

  const stockIncreased = traderDaggers === stock + 1;
  const daggersDecreased = playerDaggers === daggers - 1;
  const goldIncreased = playerGold > gold;

  if (stockIncreased && daggersDecreased && goldIncreased) {
    quests[3].complete = true;
    saveQuestProgress();
    renderQuests();
  }
  // console.log('Tested:', quests[3]);
}

let _beforeBuy = null;

function snapshotBeforeBuy(trader) {
  _beforeBuy = { trader, gold: playerGold, count: player[trader.type], stock: trader.stock };
}

function testBuy() {
  if (!_beforeBuy) return;
  const { trader, gold, count, stock } = _beforeBuy;
  const type = trader.type;

  const stockDecreased = trader.stock === stock - 1;
  const countIncreased = player[type] === count + 1;
  const goldDecreased = playerGold < gold;

  const quest = quests.find(q => q.description.toLowerCase() === `buy ${type}`);
  if (quest && stockDecreased && countIncreased && goldDecreased) {
    quest.complete = true;
    saveQuestProgress();
    renderQuests();
  }
  // console.log('Tested buy:', type, quest);
}

let _beforeSell = null;

function snapshotBeforeSell(trader) {
  _beforeSell = { trader, gold: playerGold, count: player[trader.type], stock: trader.stock };
}

function testSell() {
  if (!_beforeSell) return;
  const { trader, gold, count, stock } = _beforeSell;
  const type = trader.type;

  const stockIncreased = trader.stock === stock + 1;
  const countDecreased = player[type] === count - 1;
  const goldIncreased = playerGold > gold;

  const quest = quests.find(q => q.description.toLowerCase() === `sell ${type}`);
  if (quest && stockIncreased && countDecreased && goldIncreased) {
    quest.complete = true;
    saveQuestProgress();
    renderQuests();
  }
  // console.log('Tested sell:', type, quest);
}

let _armRotatedNearBird = false;

function snapshotArmRotatedNearBird() {
  if (distance(playerDraw, { x: birdX, y: birdY }) < 100) {
    _armRotatedNearBird = true;
  }
}

function testWaveNearBird() {
  if (_armRotatedNearBird) {
    quests[6].complete = true;
    saveQuestProgress();
    renderQuests();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuestProgress();
  renderQuests();
});
