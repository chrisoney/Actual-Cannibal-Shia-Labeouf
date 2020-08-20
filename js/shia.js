
class Shia {
  constructor(level, map, pX, pY, ctx, player){
    this.level = level;
    this.map = map;
    this.ctx = ctx;
    this.player = player

    this.game_width = 512;
    this.game_height = 512;
    this.img = new Image();
    this.img.src = "./images/shia-sprite-run.png";

    this.cycle_loop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.currentLoopIndex = 0;
    this.frameCount = 0;
    this.currentDirection = Math.floor(Math.random() * 2);

    this.mapMax = map.levels[level].cols * map.tsize;
    if (this.currentDirection === 0){
      this.sX = Math.max(pX - 560, 0);
    } else {
      this.sX = Math.min(pX + 512, this.mapMax - 5);
    }
    this.sY = pY;

    this.width = 18;
    this.height = 32;
    
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
    if (this.sX < 0 || this.sX > this.mapMax){
      this.player.shia_surprise = false;
    }

    const FRAME_LIMIT = 10;
    let hasMoved = false;
    const MOVEMENT_SPEED = 2 + (0.8 * this.level);

    if (this.currentDirection === 0){
      this.sX = this.sX + MOVEMENT_SPEED;
      hasMoved = true;
    } else {
      this.sX =this.sX - MOVEMENT_SPEED;
      hasMoved = true;
    }

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
      this.currentDirection,
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