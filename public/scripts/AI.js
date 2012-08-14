function AI(side) {
  this.turn       = 1;
  this.side       = side;
  this.min_side   = "";
  this.board      = new Array(9);
  this.open_moves = new Array(9);
  this.last_move  = new Array();
  this.win_arr    = [[0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,5,8], [3,4,5], [6,7,8], [2,4,6]];
}

AI.prototype.move = function(game_board, side) {
  this.board = game_board;
  return (this.turn == 1) ? this.initialize_game_AI(side) : this.maximize();
}


/*****************************************************
                Initialization Methods
 *****************************************************/
AI.prototype.initialize_game_AI = function() {
  // initialize min and max sides
  this.set_min_max_sides();
  this.turn += 1;
  return this.maximize();
}

AI.prototype.set_min_max_sides = function() {
  side          = this.side;
  this.min_side = this.opposite_of(side);
}

AI.prototype.opposite_of = function(side) {
  return (side == "o") ? "x" : "o";
}

/*****************************************************
                      Helper Methods
******************************************************/
AI.prototype.get_available_moves = function() {
  // initialize the open_arr to clear pre-existing values
  this.open_moves = [];
  for ( var k = 0; k < this.board.length; k++ ) {
    ( this.board[k] == "-" ) ? this.open_moves.push(k) : null;
  }
}

AI.prototype.revert_last_move = function() {
  this.board[this.last_move.pop()] = "-";
  this.winner = null;
}

AI.prototype.mark_board = function(move, side) {
  this.board[move] = side;
  this.last_move.push(move);
}

AI.prototype.game_over = function() {
  return ( $.inArray('-', this.board) == -1 ) ? true : false;
}

AI.prototype.evaluate_board = function(side, move) {
  score = 0;
  temp_arr = [];
  
  for(var h = 0; h < this.win_arr.length; h++) {
    one   = this.win_arr[h][0];
    two   = this.win_arr[h][1];
    three = this.win_arr[h][2];
    temp_arr = [this.board[one],this.board[two],this.board[three]];
    score += ( (this.temp_arr_has_side(temp_arr) || this.temp_arr_has_blank(temp_arr)) && !this.temp_arr_has_other_side(temp_arr, this.opposite_of(side)) ) ? 1 : 0;
  }

  // favors the center square
  score += ( (move == 4) && (side == this.side) ) ? 7 : 0;

  // slightly favors the corners
  score += ( move == 0 || move == 2 || move == 6 || move == 8 ) ? 2 : 0;

  score += ( move == 0 && this.board[1] == this.min_side || this.board[3] == this.min_side ) ? 3 : 0;

  score += ( move == 2 && this.board[1] == this.min_side || this.board[5] == this.min_side ) ? 3 : 0;

  score += ( move == 6 && this.board[3] == this.min_side || this.board[7] == this.min_side ) ? 3 : 0;

  score += ( move == 8 && this.board[5] == this.min_side || this.board[7] == this.min_side ) ? 3 : 0;

  score += ( move == 1 || move == 3 || move == 5 || move == 7 ) ? this.prevent_forking() : 0;

  return score;
}

AI.prototype.prevent_forking = function() {
  forkable_corners = [0,2,6,8];
  has_corner = [];
  for ( f = 0; f < forkable_corners.length; f++ ) {
    square = forkable_corners[f];
    if ( this.board[square] == this.min_side) {
      has_corner.push(forkable_corners[f]);
    }
  }
  return ( has_corner.length > 1 ) ? 6 : 0;
}

AI.prototype.winning_move = function(side) {
  for ( t = 0; t < this.win_arr.length; t++ ) {
    one = this.win_arr[t][0];
    two = this.win_arr[t][1];
    three = this.win_arr[t][2];

    if ( (this.board[one] == this.board[two] && this.board[two] == this.board[three]) && this.board[three] == side ) {
      return true;
    }
  }
  return false;
}

AI.prototype.temp_arr_has_side = function(temp_arr) {
  return this.to_boolean($.inArray(side, temp_arr));
}

AI.prototype.temp_arr_has_other_side = function(temp_arr, other_side) {
  return this.to_boolean($.inArray(other_side, temp_arr));
}

AI.prototype.temp_arr_has_blank = function(temp_arr) {
  return this.to_boolean($.inArray("-", temp_arr));
}

AI.prototype.to_boolean = function(value) {
  return (value == -1) ? false : true;
}

/*****************************************************
                      AI Logic
******************************************************/
AI.prototype.maximize = function() {
  this.max_score = null;
  this.max_move  = null;

  this.get_available_moves();

  for ( var z = 0; z < this.open_moves.length; z++ ) {

    this.mark_board(this.open_moves[z], this.side);

    // check if game over?
    if ( this.game_over() ) {
      return this.open_moves[z]
    }

    // check if winning move 
    if ( this.winning_move(this.side) ) {
      this.revert_last_move();
      return this.open_moves[z]
    } 

    temp_max     = this.evaluate_board(this.side, this.open_moves[z]);
    temp_move    = this.open_moves[z];
    min_response = this.minimize(temp_max);

    // check if min has winning move
    if (min_response['best_score'] == 1000) {
      temp_move = min_response['best_move'];
    }

    this.revert_last_move();

    if (this.max_score == null || min_response['best_score'] > this.max_score) {
      this.max_score = min_response['best_score'];
      this.max_move = temp_move;
    }
  }

  return this.max_move;
}

AI.prototype.minimize = function(temp_max) {
  this.min_score = null;
  this.min_move  = null;

  for ( var p = 0; p < this.open_moves.length; p++) {
    this.mark_board(this.open_moves[p], this.min_side);

    if ( this.winning_move(this.min_side) ) {
      this.revert_last_move();
      return response = {best_score:1000, best_move:this.open_moves[p]}
    }

    temp_min       = this.evaluate_board(this.min_side, this.open_moves[p]);
    current_result = temp_max - temp_min;

    this.revert_last_move();

    if ( this.min_score == null || current_result < this.min_score ) {
      this.min_score = current_result;
      this.min_move = this.open_moves[p];
    }
  }

  return response = {best_score:this.min_score, best_move:this.min_move};
}