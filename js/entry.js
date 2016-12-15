var Game = require('./game/Game');

$( document ).ready(function() {
  var game = Game.create("game-canvas");


  // CONTROLS
  $( document ).keydown(function(event) {

    switch (event.keyCode) {
      case 37:
        event.preventDefault();
        game.moveLeft();
        break;
      case 39:
        event.preventDefault();
        game.moveRight();
        break;
      case 32:
        console.log("JUMP");
        event.preventDefault();
        game.jump();
        break;
    }
  });

  $( document ).keyup(function(event) {
    if (event.keyCode != 32) {
      game.clearMove();
    }
  });
});
