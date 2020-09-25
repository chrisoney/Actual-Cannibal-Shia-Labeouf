// const Position = require('./position.js');
const Shia = require('./shia')

class Player {
  constructor(level, map, x, y, ctx) {
    this.level = level;
    this.game_width = 528;
    this.game_height = 528;
    this.img = new Image();
    this.img.src = "./images/player-sprite-run.png";
    this.position = {
      x: x,
      y: y,
    }
    this.ctx = ctx;
    this.cycle_loop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.currentLoopIndex = 0;
    this.frameCount = 0;
    this.currentDirection = 0;
    this.key_presses = {};

    this.width = 18;
    this.height = 32;

    this.map = map;

    this.has_key = false;
    this.text_box = new Image();
    this.text_box.src = '';

    this.has_escaped = false;
    this.has_been_eaten = false;

    this.shia = false;
    this.shia_surprise = false;

    this.lives = 3;
    this.limbs = 0;

    this.surprise_text = new Image();
    this.surprise_text.src = "./images/empty.png";

    this.colliding = false;
  }

  drawFrame(frameX, frameY, canvasX, canvasY) {
    const SCALE = 1;
    const WIDTH = 18;
    const HEIGHT = 32;
    const SCALED_WIDTH = SCALE * WIDTH;
    const SCALED_HEIGHT = SCALE * HEIGHT;
    this.ctx.drawImage(this.img, frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT, canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
  }

  collide(dirX, dirY) {
    let old_pos = {x: this.position.x, y: this.position.y};


    old_pos.x += dirX;
    var left = old_pos.x;
    var right = old_pos.x + this.width;
    var top = old_pos.y;
    var bottom = old_pos.y + this.height;

    // check for collisions on sprite sides
    var collision =
        this.map.isSolidXY(this.level, left, top) ||
        this.map.isSolidXY(this.level, right, top) ||
        this.map.isSolidXY(this.level, right, bottom) ||
        this.map.isSolidXY(this.level, left, bottom);
    if (!collision){
      this.position = {x: old_pos.x, y: old_pos.y};
      this.colliding = false;
    } else {
      this.colliding = true;
    }

    old_pos = {x: this.position.x, y: this.position.y};

    old_pos.y += dirY;

    var left = old_pos.x;
    var right = old_pos.x + this.width;
    var top = old_pos.y;
    var bottom = old_pos.y + this.height;

    collision = 
    this.map.isSolidXY(this.level, left, top) ||
    this.map.isSolidXY(this.level, right, top) ||
    this.map.isSolidXY(this.level, right, bottom) ||
    this.map.isSolidXY(this.level, left, bottom);
    if (!collision){
      this.position = {x: old_pos.x, y: old_pos.y};
      this.colliding = false;
    } else {
      this.colliding = true;
    }
  }

  search(){
    var left = this.position.x - this.width / 2;
    var right = this.position.x + this.width / 2 - 1;
    var top = this.position.y - this.height / 2;
    var bottom = this.position.y + this.height / 2 - 1;

    var search = [
        this.map.isSearchable(this.level, left, top, this.has_key),
        this.map.isSearchable(this.level, right, top, this.has_key),
        this.map.isSearchable(this.level, right, bottom, this.has_key),
        this.map.isSearchable(this.level, left, bottom, this.has_key)];
    
    if (search.includes('key')){
      this.has_key = true;
      this.text_box.src = "./images/found_keys.png";
    } else if (search.includes('escaped')){
      this.has_escaped = true;
    } else if (search.includes('no keys')){
      this.text_box.src = "./images/no_keys.png";
    } else if (search.includes('surprise') && this.shia === false){
      this.shia = new Shia(this.level, this.map, this.screenX, this.screenY, this.ctx, this);
      this.shia_surprise = true;
      document.getElementById("tips").innerHTML = `<img src="./images/shia_surprise.png" alt="shia"/>`;
      window.setTimeout(() => {
        this.shia_surpise = false;
        document.getElementById("tips").innerHTML = "";
      }, 2000);
    } else if (search.includes('medicine')){
      if (this.lives < 3){ this.lives++; }
      this.text_box.src = "./images/medicine.png";
    } else if (search.includes('limb')){
      this.limbs++;
      this.text_box.src = "./images/limb.png"
    } else if (search.includes('nothing')){
      this.text_box.src = "./images/found_nothing.png";
    } 
    else {
      this.text_box.src = "";
    }
  }

  escaped(){
    return this.has_escaped;
  }

  eaten(){
    return this.has_been_eaten;
  }

  updateLives(){
    if (this.lives === 0){
      this.has_been_eaten = true;
    }
    let hearts = '';
    for (let x = 0; x < this.lives; x++){
      hearts += '<img src="./images/full_heart.png" />';
    }
    for (let y = this.lives; y < 3; y++){
      hearts += '<img src="./images/empty_heart.png" />';
    }
    document.getElementById("hearts").innerHTML = hearts;
  }

  tossLimb(){
    if (this.shia_surprise && this.limbs > 0){
      this.limbs-=1;
      this.shia.currentDirection = (this.shia.currentDirection + 1) % 2;
      this.shia.img.src = "./images/shia-sprite-run-foot.png";
    }
  }
  
  gameLoop() {
    if (this.has_key){
      document.getElementById("key").innerHTML = '<img src="./images/key.png" />x 1';
    } else {
      document.getElementById("key").innerHTML = '';
    }

    if (this.limbs > 0){
      document.getElementById("limb").innerHTML = `<img src="./images/foot.png" />x ${this.limbs}`
    } else {
      document.getElementById("limb").innerHTML = '';
    }

    this.updateLives();

    if (!this.shia_surprise){
      this.shia = false;
    } else {
      this.shia.shiaGameLoop();
    }

    const FRAME_LIMIT = 10;
    const FACING_RIGHT = 0;
    const FACING_LEFT = 1;
    let hasMoved = false;
    const MOVEMENT_SPEED = 2;
    if (this.key_presses.w || this.key_presses.W || this.key_presses.ArrowUp) {
      this.collide(0, -MOVEMENT_SPEED);
      hasMoved = true;
      if (this.shia && !this.colliding && this.screenY === 264 ){this.shia.sY += this.shia.movement_speed};
    } else if (this.key_presses.s || this.key_presses.S || this.key_presses.ArrowDown) {
      this.collide(0, MOVEMENT_SPEED);
      hasMoved = true;
      if (this.shia && !this.colliding && this.screenY === 264 ){this.shia.sY -= this.shia.movement_speed};
    }

    if (this.key_presses.a || this.key_presses.A || this.key_presses.ArrowLeft) {
      this.collide(-MOVEMENT_SPEED, 0)
      this.currentDirection = FACING_LEFT;
      hasMoved = true;
      if (this.shia && !this.colliding && this.screenX === 264 ){this.shia.sX += this.shia.movement_speed};
    } else if (this.key_presses.d || this.key_presses.D || this.key_presses.ArrowRight) {
      this.collide(MOVEMENT_SPEED, 0)
      this.currentDirection = FACING_RIGHT;
      hasMoved = true;
      if (this.shia && !this.colliding && this.screenX === 264 ){this.shia.sX -= this.shia.movement_speed};
      // if (this.shia && this.colliding) {this.shia.sX -= MOVEMENT_SPEED};
    }


    if (hasMoved) {
      this.frameCount++;
      if (this.frameCount >= FRAME_LIMIT) {
        this.frameCount = 0;
        this.currentLoopIndex++;
        if (this.currentLoopIndex >= this.cycle_loop.length) {
          this.currentLoopIndex = 0;
        }
        this.text_box.src = "./images/empty.png";
      }
    }
    this.drawFrame(
      this.cycle_loop[this.currentLoopIndex],
      this.currentDirection,
      this.screenX - this.width/2,
      this.screenY - this.height/2
    );
    this.ctx.drawImage(this.text_box, this.screenX, this.screenY - 70, 120, 60)
    this.ctx.drawImage(this.surprise_text, this.screenX - 150, this.screenY - 120, 300, 100);
  }

}

module.exports = Player;