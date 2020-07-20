const GameView = require("./game_view.js");

// Initialize canvas and display splash
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", run);
});

let level = 1;

function next(){
  const nextScreen = document.getElementById('next-screen');
  const levelMsg = document.getElementById('level-message');
  levelMsg.innerHTML = `You escaped Shia on Level ${level}!`;
  level += 1;
  nextScreen.style.visibility = "visible";
  setTimeout( () => {
    document.addEventListener("keydown", run)
  }, 500);
}

function win(){
  const winScreen = document.getElementById('win-screen');
  winScreen.style.visibility = "visible";
  level = 1;
  setTimeout( () => {
    document.addEventListener("keydown", run)
  }, 500);
}

function lose(){
  let loseMsg = document.getElementById("lose-level");
  loseMsg.innerHTML = `You made it to level ${level}, but then you`;
  const loseScreen = document.getElementById('lose-screen');
  loseScreen.style.visibility = "visible";
  level = 1;
  setTimeout( () => {
    document.addEventListener("keydown", run)
  }, 500);
}

function run() {
  const canvas = document.getElementById("canvas");
  canvas.width = 512;
  canvas.height = 512;

  const game_screens = document.querySelectorAll('.screen');
  for (let screen of game_screens) {
    screen.style.visibility = "hidden";
  }
  
  window.GameView = new GameView(canvas,level, win, lose, next);
  window.GameView.start();
  document.removeEventListener("keydown", run);
}