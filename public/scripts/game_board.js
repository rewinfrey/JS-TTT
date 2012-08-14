function GameBoard() {
  this.game_arr        = new Array(9);
  this.winning_moves   = [[0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,5,8], [3,4,5], [6,7,8], [2,4,6]];
  this.human1          = "";
  this.human2          = "";
  this.AI1             = "";
  this.AI2             = "";
  this.game_mode       = 0;
}
  
GameBoard.prototype.init_board_matrix = function() {
  for(var k = 0; k < this.game_arr.length; k++) {
    this.game_arr[k] = "-";
  }
}

GameBoard.prototype.init_players = function(side, player_arrangement) {
  switch(player_arrangement) {
    case "HumanvAI":
      this.human1     = side;
      this.AI1        = this.opposite_of(side);
      this.game_mode  = 0;
      break;
    case "AIvHuman":
      this.AI1       = side;
      this.human1    = this.opposite_of(side);
      this.game_mode = 1;
      break; 
    case "HumanvHuman":
      this.human1     = side;
      this.human2     = this.opposite_of(side);
      this.game_mode = 2;
      break;
    case "AIvAI":
      this.AI1       = side;
      this.AI2       = this.opposite_of(side);
      this.game_mode = 3;
      break;
  }
}
  
GameBoard.prototype.opposite_of = function(side) {
  return ( side == "x" ) ? "o" : "x";
}

GameBoard.prototype.update_board = function(location, side) {
  this.game_arr[parseInt(location)] = side;
}

GameBoard.prototype.evaluate_game = function() {
  board = this.game_arr;
  if ( board[0] === board[1] && board[1] === board[2] && board[0] != "-" ) {
    winning_line(0,1,2);
    return true;
  }
  else if ( board[0] === board[3] && board[3] === board[6] && board[0] != "-" ) {
    winning_line(0,3,6);
    return true;
  }
  else if ( board[0] === board[4] && board[0] === board[8] && board[0] != "-" ) {
    winning_line(0,4,9);
    return true;
  }
  else if ( board[1] === board[4] && board[1] === board[7] && board[1] != "-"  ) {
    winnng_line(1,4,7);
    return true;
  }
  else if ( board[2] === board[5] && board[2] === board[8] && board[2] != "-" ) {
    winning_line(2,5,8);
    return true;
  }
  else if ( board[2] === board[4] && board[2] === board[6] && board[2] != "-" ) {
    winning_line(2,4,6);
    return true;
  }
  else if ( board[3] === board[4] && board[3] === board[5] && board[3] != "-" ) {
    winning_line(3,4,5);
    return true;
  }
  else if ( board[6] === board[7] && board[6] === board[8] && board[6] != "-" ) {
    winning_line(6,7,8);
    return true;
  }
  return false; 
}

function winning_line(one, two, three) {
  $('#'+one+',#'+two+',#'+three).removeClass('closed, open').addClass('won');
}

// if computer goes first, first move should be corner
function check_initial_move(side) {
  if ( this.initial_move ) {
    return 0;
  }
}

function computer_side(side) {
  return (side == "x") ? "o" : "x";
}
function evaluate_next_move() {}