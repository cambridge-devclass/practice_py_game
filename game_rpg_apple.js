"use strict";

// ---- Player ----
let playerGold = 10;
let playerApples = 0;

// ---- Trader ----
let traderApples = 7;


// ---- Apple Trader ----
function buyApple() {
  const price = 1;

  // Complete the trade logic below:
  // * Make changes to player and trader properties.
  // * The screen will be updated for you, don't worry about drawing logic -
  // - it is done inside updateUI() and draw() functions
  // - don't remove these functions from buyApple().


  statusMessage = "You bought an apple!";
  updateUI();
  draw();
}
