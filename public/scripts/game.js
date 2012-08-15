function Game() {
  this.game_board      = new Array(9);
  this.win_arr         = [[0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,5,8], [3,4,5], [6,7,8], [2,4,6]];
  this.human1          = null;
  this.human2          = null;
  this.AI1             = null;
  this.AI2             = null;
  this.mode            = null;
  this.turn            = 1;
}

Game.prototype.init_board = function() {
  for(var k = 0; k < this.game_board.length; k++) {
    this.game_board[k] = "-";
  }
}

Game.prototype.init_players = function(side, mode) {
  switch(mode) {
    case 0:
    case 1:
      this.AI1       = new AI(this.opposite_of(side));
      this.human1    = new Human(side);
      break; 
    case 2:
      this.human1     = new Human(side);
      this.human2     = new Human(this.opposite_of(side));
      break;
    case 3:
      this.AI1       = new AI(side);
      this.AI2       = new AI(this.opposite_of(side));
      break;
  }
  this.mode  = mode;
}

Game.prototype.play = function() {
  check_result = this.check_board_status();
  if (check_result != null) {
    this.finish_prompt(check_result);
  } else {
    this.turn += 1;
    switch(this.mode) {
      case 0:
        (this.turn % 2 == 0) ? this.human_move(this.human1, this)  : this.AI_move(this.AI1);
        break;
      case 1:
        (this.turn % 2 == 0) ? this.AI_move(this.AI1)              : this.human_move(this.human1, this);
        break;
      case 2:
        (this.turn % 2 == 0) ? this.human_move(this.human1, this)  : this.human_move(this.human2, this);
        break;
      case 3:
        (this.turn % 2 == 0) ? this.AI_move(this.AI1)              : this.AI_move(this.AI2);
        break;
    }
  }
}

Game.prototype.human_move = function(player, game) {
  $('td').unbind('click').click( function() {
    game_over = $('.won');
    if ($(this).hasClass('open') && game_over.length == 0) {
      move = parseInt($(this).attr('id'));
      game.mark_board(move, player.side);
      game.play();
    }
  });
}

Game.prototype.AI_move = function(player) {
  move = player.move(this.game_board);
  this.mark_board(move, player.side);
  this.play();
}

Game.prototype.opposite_of = function(side) {
  return ( side == "x" ) ? "o" : "x";
}

Game.prototype.mark_board = function(move, side) {
  this.game_board[move] = side;
  $('#'+move).html(side);
  $('#'+move).addClass('closed').removeClass('open');
}

Game.prototype.check_board_status = function() {
  if (this.is_winning_board()) {
    return "win"
  }
  else if (this.is_draw()) {
    return "draw";
  }
  return null
}

Game.prototype.finish_prompt = function(condition) {
  if (condition == "win") {
    switch(this.mode) {
      case 0:
        (this.turn % 2 == 0) ? this.generate_prompt(this.human1)  : this.generate_prompt(this.AI1);
        break;
      case 1:
        (this.turn % 2 == 0) ? this.generate_prompt(this.AI1)     : this.generate_prompt(this.human1);
        break;
      case 2:
        (this.turn % 2 == 0) ? this.generate_prompt(this.human1)  : this.generate_prompt(this.human2);
        break;
      case 3:
        (this.turn % 2 == 0) ? this.generate_prompt(this.AI1)     : this.generate_prompt(this.AI2); 
        break;
    }
  } else {
    $('.modal').html("It's a draw");
  }
}

Game.prototype.generate_prompt = function(player) {
  $('.modal').html("Player " + player.side + " wins!");
}

Game.prototype.is_winning_board = function() {
  for ( t = 0; t < this.win_arr.length; t++ ) {
    one = this.win_arr[t][0];
    two = this.win_arr[t][1];
    three = this.win_arr[t][2];
    
    if ( (this.game_board[one] == this.game_board[two] && this.game_board[two] == this.game_board[three]) && this.game_board[three] != "-" ) {
      this.winning_line(one,two,three);
      return true;
    }
  }
  return false;
}

Game.prototype.is_draw = function() {
  return ($.inArray("-", this.game_board) == -1) ? true : false;
} 

Game.prototype.winning_line = function(one, two, three) {
  $('#'+one+',#'+two+',#'+three).removeClass('closed, open').addClass('won');
}