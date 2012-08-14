$(document).ready( function(){
  init_page();  
});

function init_page() {
  $('#game_board').hide();
  $('#right_side_bar').hide();
  $('#left_side_bar').hide();
  $('#modal').hide();
  $left_side_bar = $('#left_side_bar').html();
  $('#wrapper').html($left_side_bar);
  $('#0').addClass('selected');
  $('.unselected').click( function(){
     assign_side($(this)); 
  });
}

function assign_side(element) {
  if($(element).hasClass("unselected")) {
    $('.selected').removeClass("selected").addClass("unselected");
    $(element).removeClass("unselected").addClass("selected");
  } else {
    $(".unselected").removeClass("unselected").addClass("selected");
    $(element).removeClass("selected").addClass("unselected");
  }
}

function choose_mark() {
  game_mode = parseInt($('.selected').attr('id'));  
  
  $('#game_mode').fadeOut( function(){
    $('#wrapper').fadeOut( function(){
      $right_side_bar = $('#right_side_bar').html();
      $('#wrapper').html($right_side_bar);
      $('#wrapper').fadeIn( function(){
        $('#x').addClass('selected');
        $('.unselected').click( function(){
            assign_side($(this));
        });    
      });
    });      
  });
}


function start_game() {
  side = $('.selected').attr("id");  
  console.log(side);
  //$('td').removeClass('won').addClass('open').html("");
  //$('#start').html("New Game");
  //initialize_game();
  //game_loop();
}

/*****************************************************
                Initialization Methods
 *****************************************************/

function initialize_game() {
  init_game_board();
  init_human_player();
  init_AI();
}

function init_game_board() {
  game_board = new GameBoard();
  game_board.init_board_matrix(); 
  game_board.init_players(side);        
}

function init_human_player() {
  human = new HumanPlayer(side);
  human.init_arr();
}

function init_AI() {
  game_AI = new AI();
}

function init_tree_eval() {
  game_tree = new GameTree();
}

function init_comp_player() {
  computer                   = new ComputerPlayer(game_board.computer_player);
  computer.computer_arr      = computer.available_moves = init_comp_arr();
}

/*****************************************************
                    Game Methods
 *****************************************************/

function game_loop() {
  //best_move = game_tree.min_max(game_board.game_arr, "o");
  response = game_AI.move(game_board.game_arr, "o");
  console.log("best move: "+response['best_move']+" best score: "+response['best_score']);
  $("#"+response['best_move']).html("o");
  game_board.game_arr[response['best_move']] = "o";
  human_move(); 
}

function human_move() {
  $('td').unbind('click').click( function() {
    $(this).html(human.side);
    move = $(this).attr('id');
    human.set_move(move);
    game_board.update_board(move, human.side);
    game_board.evaluate_game();
    game_board.turn += 1;
    game_loop();
  });
}

function computer_move() {
  console.log("computer_move");
  console.log(computer);
  computer.get_available_moves(game_board.game_arr);
  console.log(computer);
  game_board.turn += 1;
  game_loop();
}

function game_finish(side) {
  alert("Player "+side+" wins!");
}
