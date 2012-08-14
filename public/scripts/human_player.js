function HumanPlayer(side) {
  this.side      = side;
  this.human_arr = new Array(9);
}

HumanPlayer.prototype.init_arr = function() {
  for(var j = 0; j < this.human_arr.length; j++) {
    this.human_arr[j] = 0;
  }
}

HumanPlayer.prototype.set_move = function(location) {
  this.human_arr[parseInt(location)] = 1;
}
