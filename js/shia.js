
class Shia {
  constructor(level, diff_level, map, pX, pY, ctx, player){
    this.level = level;
    this.diff_level = diff_level;
    this.map = map;
    this.ctx = ctx;
    this.player = player

    this.game_width = 528;
    this.game_height = 528;
    this.img = new Image();
    this.img.src = "./images/shia-sprite-run.png";

    this.cycle_loop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.currentLoopIndex = 0;
    this.frameCount = 0;
    this.currentDirection = Math.floor(Math.random() * 4);

    this.mapMax = map.levels[level].cols * map.tsize;
    switch(this.currentDirection){
      case 0:
        this.sX = Math.max(pX - 264, 0);
        this.sY = pY;
        break;
      case 1:
        this.sX = Math.min(pX + 264, this.mapMax);
        this.sY = pY;
        break;
      case 2:
        this.sX = pX;
        this.sY = Math.max(pY - 264, 0);
        break;
      case 3:
        this.sX = pX;
        this.sY = Math.min(pY + 264, this.mapMax);
        break;
      default:
        break;
    }
    // if (this.currentDirection === 0){
    //   this.sX = Math.max(pX - 264, 0);
    // } else {
    //   this.sX = Math.min(pX + 264, this.mapMax);
    // }
    // this.sY = pY;

    this.width = 18;
    this.height = 32;
    
    this.movement_speed = 2 + (0.5 * this.level * this.diff_level);

    this.has_attacked = false;
  }



  drawFrame(frameX, frameY, canvasX, canvasY) {
    const SCALE = 1;
    const WIDTH = 18;
    const HEIGHT = 32;
    const SCALED_WIDTH = SCALE * WIDTH;
    const SCALED_HEIGHT = SCALE * HEIGHT;
    this.ctx.drawImage(this.img, frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT, canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
  }

  shiaGameLoop(){
    if (this.sX < 0 || this.sX > this.mapMax || this.sY < 0 || this.sY > this.mapMax){
      this.player.shia_surprise = false;
    }

    const FRAME_LIMIT = 10;
    let hasMoved = false;
    // const MOVEMENT_SPEED = 2 + (0.8 * this.level);

    switch(this.currentDirection){
      case 0:
        this.sX = this.sX + this.movement_speed;
        hasMoved = true;
        break;
      case 1:
        this.sX = this.sX - this.movement_speed;
        hasMoved = true;
        break;
      case 2:
        this.sY = this.sY + this.movement_speed;
        hasMoved = true;
        break;
      case 3:
        this.sY = this.sY - this.movement_speed;
        hasMoved = true;
        break;
      default:
        break;
    }
    // if (this.currentDirection === 0){
    //   this.sX = this.sX + MOVEMENT_SPEED;
    //   hasMoved = true;
    // } else {
    //   this.sX =this.sX - MOVEMENT_SPEED;
    //   hasMoved = true;
    // }

    if (hasMoved) {
      this.frameCount++;
      if (this.frameCount >= FRAME_LIMIT) {
        this.frameCount = 0;
        this.currentLoopIndex++;
        if (this.currentLoopIndex >= this.cycle_loop.length) {
          this.currentLoopIndex = 0;
        }
      }
    }
    this.drawFrame(
      this.cycle_loop[this.currentLoopIndex],
      (this.currentDirection % 2),
      this.sX,
      this.sY
    );
    if (!this.has_attacked &&this.sX < this.player.screenX + 10 &&
        this.sX + 28 > this.player.screenX &&
        this.sY < this.player.screenY + 20 &&
        this.sY + 40 > this.player.screenY){
          this.player.lives--;
          this.has_attacked = true;
    }

  }
}

module.exports = Shia;