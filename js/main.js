const GameView = require("./game_view.js");

// Initialize canvas and display splash
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", tutorial);
  playPause();
});

let level = 1;
let diff_level = 0.5;

function playPause(){
  document.addEventListener("keydown", (e) => {
    let audio = document.getElementById("audio");
    if (e.key === 'm') {
      if (audio.paused){
        audio.play();
      } else {
        audio.pause();
      }
    }
  });
}

function tutorial(){
  document.getElementById("audio").play();
  const tipScreen = document.getElementById('tip-screen');
  tipScreen.style.visibility = "visible";
  setTimeout( () => {
    document.addEventListener("keydown", difficulty)
  }, 500);
  document.removeEventListener("keydown", tutorial);
}

function difficulty(){
  const difficultyScreen = document.getElementById('difficulty');
  const easy = document.getElementById('easy');
  difficultyScreen.style.visibility = "visible";
  easy.classList.add('highlight');

  const diffLevels = ['easy', 'medium', 'hard'];
  const diffEles = [];
  diffLevels.forEach((diff) => {
    diffEles.push(document.getElementById(diff))
  })
  diffEles.forEach((ele) => {
    ele.addEventListener("click", ()=> {
      const others = document.getElementsByClassName("difficulty-level");
      for (let i = 0; i < others.length; i++){
        others[i].classList.remove('highlight');
      }
      switch(ele.id){
        case 'easy':
          diff_level = 0.5;
          break;
        case 'medium':
          diff_level = 1;
          break;
        case 'hard':
          diff_level = 1.5;
          break;
        default:
          break;
      }
      ele.classList.add('highlight');
    })
  })
  setTimeout( () => {
    document.addEventListener("keydown", run)
  }, 500);
  document.removeEventListener("keydown", difficulty);
  // diffEles.forEach((ele) => {
  //   ele.removeEventListener("click", );
  // })
}

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
  loseMsg.innerHTML = `You made it to Level ${level}, but then you`;
  const loseScreen = document.getElementById('lose-screen');
  loseScreen.style.visibility = "visible";
  level = 1;
  setTimeout( () => {
    document.addEventListener("keydown", run)
  }, 500);
}

function run() {
  const canvas = document.getElementById("canvas");
  canvas.width = 528;
  canvas.height = 528;
  const game_screens = document.querySelectorAll('.screen');
  for (let screen of game_screens) {
    screen.style.visibility = "hidden";
  }
  window.GameView = new GameView(canvas,level, diff_level, win, lose, next);
  window.GameView.start();
  document.removeEventListener("keydown", run);
}