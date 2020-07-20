/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);
	
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
	  }, 2000);
	}
	
	function win(){
	  const winScreen = document.getElementById('win-screen');
	  winScreen.style.visibility = "visible";
	  level = 1;
	  setTimeout( () => {
	    document.addEventListener("keydown", run)
	  }, 2000);
	}
	
	function lose(){
	  const loseScreen = document.getElementById('lose-screen');
	  loseScreen.style.visibility = "visible";
	  level = 1;
	  setTimeout( () => {
	    document.addEventListener("keydown", run)
	  }, 2000);
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	const Map = __webpack_require__(2);
	const TileMaps = __webpack_require__(6)
	
	
	class GameView {
	  constructor(canvas, level, win, lose, next){
	    this.canvas = canvas;
	    this.ctx = canvas.getContext("2d");
	    this.map = new Map(canvas, level);
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
	            
	  }
	
	  bindKeyHandlers() {
	    window.addEventListener("keydown", (e) => {
	      this.player.key_presses[e.key] = true;
	    });
	
	    window.addEventListener("keyup", (e) => {
	      this.player.key_presses[e.key] = false;
	    });
	    window.addEventListener("keydown", (e) => {
	      let audio = document.getElementById("audio");
	      if (e.key === 'm') {
	        if (audio.paused){
	          audio.play();
	        } else {
	          audio.pause();
	        }
	      }
	    });
	    window.addEventListener("keydown", (e) => {
	      if (e.key === ' ') {
	        this.player.search();
	        this.tipScroll();
	      }
	    });
	    window.addEventListener("keydown", (e) => {
	      if (e.key === 'e') {this.player.tossLimb()}
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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(3);
	const Camera = __webpack_require__(5)
	const TileMaps = __webpack_require__(6)
	
	class Map {
	  constructor(canvas, level){
	    this.level = level;
	    this.canvas = canvas;
	    this.ctx = canvas.getContext('2d');
	    this.tiles = new Image();
	    this.tiles.src = './images/sprite-background.png';
	
	    this.generateLevels(1);
	    this.generateLevels(2);
	    this.generateLevels(3);
	    this.generateLevels(4);
	    this.generateLevels(5);
	    this.generateLevels(6);
	    this.generateLevels(7);
	    this.generateLevels(8);
	    this.generateLevels(9);
	    this.generateLevels(10);
	
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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	// const Position = require('./position.js');
	const Shia = __webpack_require__(4)
	
	class Player {
	  constructor(level, map, x, y, ctx) {
	    this.level = level;
	    this.game_width = 512;
	    this.game_height = 512;
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
	    this.surprise_text.src = "./images/empty.png"
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
	    } else if (search.includes('surprise')){
	      this.shia = new Shia(this.level, this.map, this.screenX, this.screenY, this.ctx, this);
	      this.shia_surprise = true;
	      this.surprise_text.src = './images/shia_surprise.png'
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
	    if (this.key_presses.w || this.key_presses.ArrowUp) {
	      this.collide(0, -MOVEMENT_SPEED);
	      hasMoved = true;
	      if (this.shia && this.screenY === 256){this.shia.sY+=MOVEMENT_SPEED};
	    } else if (this.key_presses.s || this.key_presses.ArrowDown) {
	      this.collide(0, MOVEMENT_SPEED);
	      hasMoved = true;
	      if (this.shia && this.screenY === 256){this.shia.sY-=MOVEMENT_SPEED};
	    }
	
	    if (this.key_presses.a || this.key_presses.ArrowLeft) {
	      this.collide(-MOVEMENT_SPEED, 0)
	      this.currentDirection = FACING_LEFT;
	      hasMoved = true;
	      if (this.shia && this.screenX === 256){this.shia.sX+=MOVEMENT_SPEED};
	    } else if (this.key_presses.d || this.key_presses.ArrowRight) {
	      this.collide(MOVEMENT_SPEED, 0)
	      this.currentDirection = FACING_RIGHT;
	      hasMoved = true;
	      if (this.shia && this.screenX === 256){this.shia.sX-=MOVEMENT_SPEED};
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

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	
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
	    const MOVEMENT_SPEED = 2 + (0.5 * this.level);
	
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

/***/ }),
/* 5 */
/***/ (function(module, exports) {

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

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	
	module.exports = {
	  tsize: 66,
	  levels: { },
	  getTile: function (level, layer, col, row) {
	    return this.levels[level].layers[layer][row][col];
	  },
	  isSolidXY: function (level, x, y) {
	      var col = Math.floor((x - 6) / this.tsize);
	      var row = Math.floor((y - 6) / this.tsize);
	      var tile = this.getTile(level, 1, col, row);
	      var isSolid = (![0,3,4,10,11].includes(tile));
	      if (tile === 3){
	        this.levels[level].layers[1][row][col] = 4;
	        window.setTimeout(()=>{
	          this.levels[level].layers[1][row][col] = 3;
	        },1500);
	      }
	      return isSolid;
	  },
	  isSearchable: function (level, x, y, has_key) {
	    var col = Math.floor(x / this.tsize);
	    var row = Math.floor(y / this.tsize);
	    var tile = this.getTile(level, 1, col, row);
	    var tile2 = this.getTile(level, 2, col, row);
	    if (tile === 3 || tile === 4){
	      if (tile2 === 1 && !has_key){
	        return 'key';
	      } else if (tile2 === 2){
	        return 'surprise';
	      } else if (tile2 === 3){
	        this.levels[level].layers[2][row][col] = 0;
	        return 'medicine';
	      } else if (tile2 === 4){
	        this.levels[level].layers[2][row][col] = 0;
	        return 'limb';
	      }
	      return 'nothing';
	    }
	    if (tile === 10 || tile === 11){
	      if (has_key){
	        return 'escaped';
	      } else {
	        return 'no keys';
	      }
	    }
	    return null;
	  }
	}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map