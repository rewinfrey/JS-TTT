function GameTree() {
  this.depth         = 1;
  this.max_side      = "";
  this.min_side      = "";
  this.max_score     = 0;
  this.min_score     = 0;
  this.temp_score    = 0;
  this.best_move     = -999;
  this.temp_board    = new Array(9);
  this.board         = new Array(9);
  this.open_board    = new Array(9);
  this.next_move_arr = new Array(9);
  this.win_arr       = [[0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,5,8], [3,4,5], [6,7,8], [2,4,6]];
}

GameTree.prototype.reset_min_max_scores = function() {
  this.max_score = 0;
  this.min_score = 0;
}

GameTree.prototype.cycle_through_open_board = function() {
  console.log("min side: "+this.min_side);
  console.log("max side: "+this.max_side);
  for ( z = 0; z < this.open_board.length; z++ ) {
    this.reset_min_max_scores();
    console.log("open board: "+this.open_board);
    console.log("this current move: "+this.open_board[z]);
    // get location of open space (representing the max player)
    temp_move = this.open_board[z];

    // set initial value for next_move_arr at current position for max player
    this.next_move_arr[temp_move] = 500;
    
    // marks this location according to the "max" side (x or o)
    this.board[temp_move] = this.max_side;
    
    // determine if this location is a winning move for min player (x or o)
    if (this.max_has_win(this.max_side)) {
      alert("max has win!");
      return true;
    }
            
    // updates the open_arr to account for this hypothetical max player move
    this.get_available_positions();
            
    for ( y = 0; y < this.open_board.length; y++ ) {
              
      // get location of open space (representing the min player)
      temp_move2 = this.open_board[y];
              
      // marks this location according to the "min" side (x or o)
     this.board[temp_move2] = this.min_side;
             
     // reduce looping by checking for symmetry 
             
     // determine if this location is a winning move for max player (x or o)
     if (this.min_has_win(this.min_side)) {
            alert("min has win!");
            //this.next_move_arr[p] = 999;
     } 
             
     // evaluate board (finds the max value and min value based on number of open columns, rows and diagonals for max and min players)
     this.find_max();
     this.find_min();
     
     // mark the result of max_score - min_score on a temporary array representing the location of the move for max
     // checks to see if the resulting score is less than the existing score at that location (best min score wins)
     this.mark_next_move_arr();
     
     // removes hypothetical min player mark from temporary board array to prepare for next iteration
     this.board[temp_move2] = "-";
     }
     
    // removes hypothetical max player mark from temporary board array to prepare for next iteration
    this.board[temp_move] = "-";
    
    // resets the open_arr for next iteration
    this.get_available_positions();    
  }
}

GameTree.prototype.min_max = function(game_board, max_side) {
  
  // initialize the game_tree object attributes
  this.initialize_game_tree(game_board, max_side);

  // heuristic 1: check if initial move
  if (this.check_initial_move()) {
    return 0;
  }
  
  this.cycle_through_open_board();  
  
  // find the best move by finding the max score of the hypothetical move array according to their max - min scores
  return this.find_best_move();
}

GameTree.prototype.mark_next_move_arr = function() {
  var result = this.evaluate_min();
  if ( result < this.next_move_arr[temp_move] ) {
    this.next_move_arr[temp_move] = result;
  } 
}

GameTree.prototype.find_best_move = function() {
  best_max = -999;
  //console.log("position values: "+this.next_move_arr);
  for ( var p = 0; p < this.next_move_arr.length; p++ ) {
    //console.log("p = "+p+" and next move arr= "+this.next_move_arr[p]);
    if ( this.next_move_arr[p] > best_max ) {
      //console.log("here");
      best_max = this.next_move_arr[p];
      best_move = p;
      //console.log("current best move: "+best_move+" with value of: "+this.next_move_arr[p]);
    }      
  }
  return best_move;
}

GameTree.prototype.evaluate_min = function() {
  return this.max_score - this.min_score;
}

GameTree.prototype.find_min = function() {
   this.min_score = this.evaluate_board(this.min_side);
  
  //this.min_score = ( temp_min_score < this.min_score ) ? temp_min_score : this.min_score;  
}

GameTree.prototype.find_max = function() {
  this.max_score = this.evaluate_board(this.max_side);
  
  //this.max_score = ( temp_max_score > this.max_score ) ? temp_max_score : this.max_score;
}


/****************************************************
              Evaluate Board Methods
****************************************************/
GameTree.prototype.check_initial_move = function() {
  return ($.inArray("x", this.board) && $.inArray("o", this.board) == -1);
}

GameTree.prototype.max_has_win = function(max_side) {
  return this.winning_move_found(max_side);
}

GameTree.prototype.min_has_win = function(min_side) {
  return this.winning_move_found(min_side);
}

GameTree.prototype.winning_move_found = function(side) {
  for ( t = 0; t < this.win_arr.length; t++ ) {
    one = this.win_arr[t][0];
    two = this.win_arr[t][1];
    three = this.win_arr[t][2];
    console.log("winning move arr: "+this.board[one] + "," + this.board[two] + "," + this.board[three]);
    if ( (this.board[one] == this.board[two] && this.board[two] == this.board[three]) && this.board[three] == side ) {
      alert("Win!");
      return true;
    }
  }
  return false;
}

GameTree.prototype.evaluate_board = function(side) {
  this.temp_score = 0;
  temp_arr = [];

  for(var h = 0; h < this.win_arr.length; h++) {
    one   = this.win_arr[h][0];
    two   = this.win_arr[h][1];
    three = this.win_arr[h][2];
    temp_arr = [this.board[one],this.board[two],this.board[three]];
    other_side = this.switch_side(side);
    this.temp_score += ( (this.temp_arr_has_side() || this.temp_arr_has_blank()) && !this.temp_arr_has_other_side(other_side) ) ? 1 : 0;
  }
  return this.temp_score;
}

GameTree.prototype.temp_arr_has_side = function() {
  return this.to_boolean($.inArray(side, temp_arr));
}

GameTree.prototype.temp_arr_has_other_side = function(other_side) {
  return this.to_boolean($.inArray(other_side, temp_arr));
}

GameTree.prototype.temp_arr_has_blank = function() {
  return this.to_boolean($.inArray("-", temp_arr));
}

/*****************************************************
                  Helper Methods
*****************************************************/
GameTree.prototype.to_boolean = function(value) {
  return (value == -1) ? false : true;
}

GameTree.prototype.switch_side = function(side) {
  return ( side == "x" ) ? "o" : "x";
}

/******************************************************
              Configuring Game Board Methods
******************************************************/
GameTree.prototype.get_available_positions = function() {
  // initialize the open_arr to clear pre-existing values
  this.open_board = [];
  for ( var k = 0; k < this.board.length; k++ ) {
    ( this.board[k] == "-" ) ? this.open_board.push(k) : null;
  }
}


/******************************************************
                Initialization Methods
******************************************************/

GameTree.prototype.initialize_game_tree = function(game_board, max_side) {
  // initialize min and max sides
  this.set_min_max_sides(max_side);

  // initialize the game tree board
  this.board = game_board;
  
  // initialize next_move_arr
  this.next_move_arr = [];

  // get available positions
  this.get_available_positions();  
}

GameTree.prototype.determine_min = function(max_side) {
  return (this.max_side == "o") ? "x" : "o";
}

GameTree.prototype.set_min_max_sides = function(max_side) {
  this.max_side = max_side;
  this.min_side = this.determine_min(max_side);
}



