"use strict";
console.log("Welcome to the game 👋");

// ---- Player ----
const player = {
  x: 400,
  y: 350,
  gold: 10,
  apple: 0,
  dagger: 0,
  flower: 0
};

// ---- Traders ----
const traders = [
  { type: "apple", x: 270, y: 220, stock: 6 },
  { type: "dagger", x: 400, y: 220, stock: 4 },
  { type: "flower", x: 530, y: 220, stock: 3 }
];

// ---- Speech ----
function birdSpeech() {
  return "Hi!";
}

function playerSpeech() {
  return "Hi there!";
}

// ---- Interaction ----
function buy(trader) {
  statusMessage = "Trading is not implemented yet!";
  console.log('Attempting to trade, trader:', trader);
  // Complete the trade logic below:
  // * Make changes to player and traders properties.
  // * The screen will be updated for you, don't worry about drawing logic -
  // - it is done inside updateUI() and draw() functions
  // - don't remove this functions from buy().
  // 
  // Hint: the trader argument is already prented to console, 
  // check it's value if you need idea for the next step


  updateUI();
  draw();
}
