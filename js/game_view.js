const Map = require('./map');
const TileMaps = require('./tile_maps')


class GameView {
  constructor(canvas, level, diff_level, win, lose, next){
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.map = new Map(canvas, level, diff_level);
    this.player = this.map.player;
    this.camera = this.map.camera;
    this.playing = true;
    this.winCB = win;
    this.loseCB = lose;
    this.nextCB = next;
    this.level = level;
    this.tips = ['If you have "meat" and Shia appears, you can distract him by pressing the E button',
                 'You need your keys before you can escape the level in your car',
                 'Finding medicine will heal you, but only if you\'re already injured',
                 'If Shia has already surprised you from a log, he\'s probably still watching it',
                 'You can mute and unmute the music with the M key',
                 'The spacebar can be used for both searching logs and starting your car',
                 'Shia gets faster every level so work on those reflexes!',
                ]

    this.tip = this.tips[Math.floor(Math.random() * this.tips.length)];
    document.getElementById("tips").innerHTML = `< ${this.tip} >`;

    window.setInterval(() => {
      this.player.surprise_text.src = './images/empty.png'
    }, 2000);

    this.bindKeyHandlers = this.bindKeyHandlers.bind(this);
  }

  bindKeyHandlers() {
    window.addEventListener("keydown", (e) => {
      this.player.key_presses[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.player.key_presses[e.key] = false;
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === ' ') {
        this.player.search();
      }
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === 'e') {this.player.tossLimb()}
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === 't') {this.tipScroll();}
    });
  }

  escaped(){
    return this.player.escaped();
  }

  eaten(){
    return this.player.eaten();
  }

  start(){
    this.bindKeyHandlers();
    requestAnimationFrame(this.step.bind(this));
  }

  tipScroll(){
    this.tip = this.tips[Math.floor(Math.random() * this.tips.length)];
    document.getElementById("tips").innerHTML = `< ${this.tip} >`;
  }

  step () {

    this.map.draw(this.ctx);
    this.map.player.gameLoop();

    this.camera.update();

    if (this.escaped()){
      if (this.level <= 9){
        this.nextCB();
        this.player.has_key = false;
      }
      else {
        this.winCB();
      }
    } 
    else if (this.eaten()){
      this.loseCB();
    }
    else {
      requestAnimationFrame(this.step.bind(this));
    }
  }
}
module.exports = GameView;