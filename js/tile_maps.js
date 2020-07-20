
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