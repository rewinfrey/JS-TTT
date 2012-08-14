function AI() {
  this.turn       = 1;
  this.max_side   = "";
  this.min_side   = "";
  this.board      = new Array(9);
  this.open_moves = new Array(9);
  this.last_move  = new Array();
  this.win_arr    = [[0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,5,8], [3,4,5], [6,7,8], [2,4,6]];
}

AI.prototype.move = function(game_board, max_side) {
  return (this.turn == 1) ? this.initialize_game_AI(game_board, max_side) : this.maximize(); 
}


/*****************************************************
                Initialization Methods
 *****************************************************/
AI.prototype.initialize_game_AI = function(game_board, max_side) {
  // initialize min and max sides
  this.set_min_max_sides(max_side);

  // initialize the game tree board
  this.board = game_board;

  this.turn += 1;
  return this.maximize();
}

AI.prototype.set_min_max_sides = function(max_side) {
  this.max_side = max_side;
  this.min_side = this.opposite_of(max_side);
}

AI.prototype.opposite_of = function(side) {
  return (side == "o") ? "x" : "o";
}

AI.prototype.check_initial_move = function() {
  return ($.inArray("x", this.board) && $.inArray("o", this.board) == -1);
}


/******************************************************
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
  score += ( (move == 4) && (side == this.max_side) ) ? 5 : 0;
  score += ( move == 0 || move == 2 || move == 6 || move == 8 ) ? 0 : 0;

  return score;
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
    
    this.mark_board(this.open_moves[z], this.max_side);
    
    // check if game over?
    if ( this.game_over() ) {
      return best_response = {best_score:0, best_move:this.open_moves[z]}
    }
    
    // check if winning move 
    if ( this.winning_move(this.max_side) ) {
      this.revert_last_move();
      return best_response = {best_score:1000, best_move:this.open_moves[z]}
    } 

    temp_max     = this.evaluate_board(this.max_side, this.open_moves[z]);
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
  return best_response = {best_score:this.max_score, best_move:this.max_move};
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