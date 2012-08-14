$(document).ready( function(){
  /* for testing to skip prompts
      testing setup
      $('#right_side_bar').hide();
      $('#left_side_bar').hide();
      $('#game_mode_buttons').html("");
      game_mode = 3;
      side = "x";
      initialize_game(); */
 init_page();  
});

function init_page() {
  $('.modal').html("");
  $('#game_board').hide();
  $('#right_side_bar').hide();
  $('#left_side_bar').hide();
  //$('#modal').hide();
  $left_side_bar = $('#left_side_bar').html();
  $('#wrapper').html($left_side_bar);
  $('#0').addClass('selected');
  display_prompt();
  $('.unselected').click( function(){
     assign_side($(this));
     display_prompt(); 
  });
}

function display_prompt() {
  prompt = $('.selected').attr('prompt');
  $('#game_mode_prompt').text(prompt);
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

function process_mode() {
  game_mode = parseInt($('.selected').attr('id'));  
  switch(game_mode) {
    case 0:
    case 1:
    case 2:
      choose_mark();
      break;
    case 3:
      display_game();
      break;
  }  
}

function determine_mark_header() {
  switch(game_mode) {
    case 0:
    case 1:
      $('#player_mark_header>h3').html("Choose human player mark:");
      break;
    case 2:
      $('#player_mark_header>h3').html("Choose player 1 mark:");
      break;
  }
}

function choose_mark() {
  $('#game_mode').fadeOut( function(){
    $('#wrapper').fadeOut( function(){
      $right_side_bar = $('#right_side_bar').html();
      $('#wrapper').html($right_side_bar);
      determine_mark_header();
      $('#wrapper').fadeIn( function(){
        $('#x').addClass('selected');
        $('.unselected').click( function(){
            assign_side($(this));
        });
      });
    });
  });
}


function display_game() {
  original_side = (game_mode == 3) ? 'x' : $('.selected').attr("id");  
  $('#player_mark').fadeOut( function(){
    $('#wrapper').fadeOut( function(){
      $game_board = $('#game_board').html();
      $('#wrapper').html($game_board);
      $('#wrapper').fadeIn( function(){
        initialize_game();
      });
    });
  });
}

function initialize_game() {
  $('td').html("");
  $('.won').removeClass('won').addClass('open');
  $('.closed').removeClass('closed').addClass('open');
  $('.modal').html("");
  game = new Game();
  game.init_board(); 
  game.init_players(original_side, game_mode);    
  game.play();        
}