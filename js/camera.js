class Camera {
  constructor(level, map, width, height){
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.levels[level].cols * map.tsize - width;
    this.maxY = map.levels[level].rows * map.tsize - height;
  }

  follow(sprite) {
    this.following = sprite;
    sprite.screenX = 0;
    sprite.screenY = 0;
  }
  update() {
    // center sprite if possible
    this.following.screenX = this.width / 2;
    this.following.screenY = this.height / 2;

    // camera follows sprite
    this.x = this.following.position.x - this.width / 2;
    this.y = this.following.position.y - this.height / 2;
    // clamp the values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));

    // change coordinates for corners

    // left and right sides
    if (this.following.position.x < this.width / 2 ||
        this.following.position.x > this.maxX + this.width / 2) {
        this.following.screenX = this.following.position.x - this.x;
    }
    // top and bottom
    if (this.following.position.y < this.height / 2 ||
        this.following.position.y > this.maxY + this.height / 2) {
        this.following.screenY = this.following.position.y - this.y;
    }
  }
}

module.exports = Camera;