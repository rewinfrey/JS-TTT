function ComputerPlayer(side) {
  this.computer_arr   = new Array(9);
  this.available_moves = new Array(9);
  this.side           = side
}

function init_comp_arr() {
  var comp_arr = new Array(9);
  for(var i = 0; i < comp_arr.length; i++) {
    comp_arr[i] = 0;
  }
  return comp_arr;
}
  
ComputerPlayer.prototype.set_move = function(location) {
  this.computer_arr[parseInt(location) - 1] = 1;
}

ComputerPlayer.prototype.get_available_moves = function(current_board) {
  console.log(current_board);
  for(var j = 0; j < current_board.length; j++) {
    this.available_moves[j] = current_board[j] == "-" ? 1 : 0;
  }
}