function Stoplight() {

  this.spriteSheet = new createjs.SpriteSheet({
    images: ["/side-scroller/img/stoplight.png"],
    frames: {width:300, height:572, regX: 150, regY: 286},
    animations: {
      red: {
        frames: [0],
        speed: 0.1
      },
      yellow: {
        frames: [1],
        speed: 0.1
      },
      green: {
        frames: [2],
        speed: 0.1
      }
    }
  });
  this.sprite = new createjs.Sprite(this.spriteSheet, "red");

  this.init = function() {
    this.sprite.scaleX = 0.25;
    this.sprite.scaleY = 0.25;
  };

  this.getCanvasObject = function() {
    return this.sprite;
  };

  this.moveTo = function(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
  };

  this.moveLeft = function(n) {
    this.sprite.x = this.sprite.x - n;
  };

  this.getLeftBoundary = function() {
    return this.sprite.x - 71;
  };

  this.getRightBoundary = function() {
    return this.sprite.x + 71;
  };

  this.turnGreen = function() {
    this.sprite.gotoAndStop("green");
  };

  this.update = function() {

  };

}

function StoplightFactory() {
  this.create = function() {
    var stoplight = new Stoplight();
    stoplight.init();
    return stoplight;
  };
}

module.exports = new StoplightFactory();
