"use strict";

// ---- Player ----
// let playerGold = 10; // Initialized in game_v1_apple.js
let playerDaggers = 0;

// ---- Dagger Trader ----
let traderDaggers = 4;

// ---- Interactions ----
function buyDagger() {
  const price = 3;

  // Complete the trade logic below:
  // * Make changes to playerGold, playerDaggers and traderDaggers variables.
  // * The screen will be updated for you, don't worry about drawing logic -
  // - it is done inside updateUI() and draw() functions
  // - don't remove this functions from buyDagger().

  tradeMsgEl.textContent = "You bought a dagger!";
  updateUI();
  draw();
}
