const Player = require('./player');
const Camera = require('./camera')
const TileMaps = require('./tile_maps')

class Map {
  constructor(canvas, level){
    this.level = level;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.tiles = new Image();
    this.tiles.src = './images/sprite-background.png';

    this.generateLevels(level);

    this.camera = new Camera(level, TileMaps, 512, 512);
    this.player = new Player(level, TileMaps, 100, 100, this.ctx);
    this.camera.follow(this.player);
  }
  generateObstacles(level){
    let size = 9 + (level * 3);

    let obstacles = [];
    
    // create logs
    for (let x = 0; x < 4 + level; x++){
      obstacles.push(3);
    }
    
    // populate layer with obstacles

    while(obstacles.length > 0){
      let x = Math.floor(Math.random() * (size - 2) + 1);
      let y = Math.floor(Math.random() * (size - 2) + 1);
      if (TileMaps.levels[level].layers[1][x][y] !== 0) {continue;}

      if (TileMaps.levels[level].layers[1][x + 1][y] !== 0 &&
          TileMaps.levels[level].layers[1][x - 1][y] !== 0 &&
          TileMaps.levels[level].layers[1][x][y + 1] !== 0 &&
          TileMaps.levels[level].layers[1][x][y - 1] !== 0) { continue; }
      if (x === 1 && y === 1) { continue;}
      TileMaps.levels[level].layers[1][x][y] = obstacles.shift();
    }

    //place car
    let car = [10,11];
    while(car.length > 0){
      let x = Math.floor(Math.random() * (size - 2) + 1);
      let y = Math.floor(Math.random() * (size - 2) + 1);
      if (TileMaps.levels[level].layers[1][x][y] === 0 && TileMaps.levels[level].layers[1][x][y + 1] === 0){
        TileMaps.levels[level].layers[1][x][y] = car.shift();
        TileMaps.levels[level].layers[1][x][y + 1] = car.shift();
      }
    }
  }

  addTrees(level) {
    let dimensions = 9 + (level * 3) - 2;
    let maxTunnels = dimensions * 3;
    let maxLength = dimensions - 2;
    let map = [];
    for (var i = 0; i < dimensions; i++){
      let row = [];
      for (var x = 0; x < dimensions; x++){
        row.push(5);
      }
      map.push(row);
    }
    let currentRow = 0;
    let currentColumn = 0;
    let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let lastDirection = [];
    let randomDirection;
    while (maxTunnels && dimensions && maxLength) {


      do {
         randomDirection = directions[Math.floor(Math.random() * directions.length)];
      } while ((randomDirection[0] === -lastDirection[0] && randomDirection[1] === -lastDirection[1]) || (randomDirection[0] === lastDirection[0] && randomDirection[1] === lastDirection[1]));

      var randomLength = Math.ceil(Math.random() * maxLength),
        tunnelLength = 0;

      while (tunnelLength < randomLength) {
        if (((currentRow === 0) && (randomDirection[0] === -1)) ||
            ((currentColumn === 0) && (randomDirection[1] === -1)) ||
            ((currentRow === dimensions - 1) && (randomDirection[0] === 1)) ||
            ((currentColumn === dimensions - 1) && (randomDirection[1] === 1))) {
          break;
        } else {
          map[currentRow][currentColumn] = 0;
          currentRow += randomDirection[0];
          currentColumn += randomDirection[1];
          tunnelLength++;
        }
      }

      if (tunnelLength) {
        lastDirection = randomDirection;
        maxTunnels--;
      }
    }
    return map;
  };


  generateItemsAndShias(level){
    let hidden = [];
    let total = 4 + level;
    hidden.push(1);
    let medicine = Math.floor(Math.random() * 2);
    if (medicine === 1){
      hidden.push(3);
    }
    let bait = Math.floor(Math.random() * 2);
    if (bait === 1){
      hidden.push(4);
    }
    while (hidden.length < total) {
      hidden.push(2);
    }

    // shuffle the items and shias
    for(let i = hidden.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i)
      const temp = hidden[i]
      hidden[i] = hidden[j]
      hidden[j] = temp
    }

    for (let i = 1; i < TileMaps.levels[level].rows - 1; i++){
      for (let j = 1; j < TileMaps.levels[level].rows - 1; j++){
        if (TileMaps.levels[level].layers[1][i][j] === 3){
          TileMaps.levels[level].layers[2][i][j] = hidden.shift();
        }
      }
    }
  }

  generateLevels(level){
    TileMaps.levels[level] = {layers: [[],[],[]]};
    let size = 9 + (level * 3);
    TileMaps.levels[level].cols = size;
    TileMaps.levels[level].rows = size;
    let firstLayer = [];
    for (let i = 0; i < size; i++){
      let row = [];
      for (let j = 0; j < size; j++){
        row.push(9);
      }
      firstLayer.push(row);
    }
    TileMaps.levels[level].layers[0] = firstLayer;

    let secondLayer = [];
    let innerMap = this.addTrees(level);
    secondLayer.push(new Array(size).fill(5));
    for (let k = 1; k < size - 1; k++){
      let row = [5];
      row = row.concat(innerMap.shift());
      row.push(5);
      secondLayer.push(row);
    }
    secondLayer.push(new Array(size).fill(5));
    TileMaps.levels[level].layers[1] = secondLayer;

    let thirdLayer = [];
    for (let i = 0; i < size; i++){
      let row = [];
      for (let j = 0; j < size; j++){
        row.push(0);
      }
      thirdLayer.push(row);
    }
    TileMaps.levels[level].layers[2] = thirdLayer;
    this.generateObstacles(level);
    this.generateItemsAndShias(level);
  }


  drawLayer(layer) {
    var startCol = Math.floor(this.camera.x / TileMaps.tsize);
    var endCol = startCol + (this.camera.width / TileMaps.tsize);
    var startRow = Math.floor(this.camera.y / TileMaps.tsize);
    var endRow = startRow + (this.camera.height / TileMaps.tsize);
    var offsetX = -this.camera.x + startCol * TileMaps.tsize;
    var offsetY = -this.camera.y + startRow * TileMaps.tsize;

    for (var c = startCol; c <= endCol; c++) {
        for (var r = startRow; r <= endRow; r++) {
            var tile = TileMaps.getTile(this.level,layer, c, r);
            var x = (c - startCol) * TileMaps.tsize + offsetX;
            var y = (r - startRow) * TileMaps.tsize + offsetY;
            if (tile !== 0) { // empty
                this.ctx.drawImage(
                    this.tiles,
                    (tile - 1) * TileMaps.tsize,
                    0,
                    TileMaps.tsize,
                    TileMaps.tsize,
                    Math.round(x),
                    Math.round(y),
                    TileMaps.tsize,
                    TileMaps.tsize
                );
            }
        }
    }
  }

  drawGrid() {
    var width = TileMaps.levels[this.level].cols * TileMaps.tsize;
    var height = TileMaps.levels[this.level].rows * TileMaps.tsize;
    var x, y;
    for (var r = 0; r < TileMaps.levels[this.level].rows; r++) {
        x = - this.camera.x;
        y = r * TileMaps.tsize - this.camera.y;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(width, y);
        this.ctx.stroke();
    }
    for (var c = 0; c < TileMaps.levels[this.level].cols; c++) {
        x = c * TileMaps.tsize - this.camera.x;
        y = - this.camera.y;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, height);
        this.ctx.strokeStyle = '#017320';
        // 528a26 lighter background
        // 017320 darker background
        this.ctx.stroke();
    }
  }

  draw(ctx){
    this.drawLayer(0);
    this.drawGrid();
    this.drawLayer(1);
    this.player.gameLoop();
  }

}

module.exports = Map;