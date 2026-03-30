"use strict";
console.log("Welcome to the game 👋");

// ---- Player ----
// let playerGold = 10; // Initialized in game_v1_apple.js

const player = {
  x: 400,
  y: 350,
  onion: 0,
  mushroom: 0,
  twig: 0,
};

// ---- Traders ----
const traders = [
  { type: "onion", stock: 5 },
  { type: "mushroom", stock: 3 },
  { type: "twig", stock: 4 },
];


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
