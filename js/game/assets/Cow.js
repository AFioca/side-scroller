function Cow() {

  this.spriteSheet = new createjs.SpriteSheet({
    images: ["/side-scroller/img/cow.png"],
    frames: {width:600, height:600, regX: 300, regY: 300},
    animations: {
      default: {
        frames: [0],
        speed: 0.1
      },
      hit: {
        frames: [1],
        speed: 0.1
      },
      dead: {
        frames: [2],
        speed: 0.1
      }
    }
  });
  this.sprite = new createjs.Sprite(this.spriteSheet, "default");

  this.isTipping = false;
  this.isTipped = false;
  this.angle = 0;

  this.init = function() {
    this.sprite.scaleX = 0.20;
    this.sprite.scaleY = 0.20;
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

  this.move = function(n) {
    this.sprite.x = this.sprite.x + n;
  };

  this.getLeftBoundary = function() {
    return this.sprite.x - 60;
  };

  this.getRightBoundary = function() {
    return this.sprite.x + 60;
  };

  this.update = function() {
    if (this.isTipping) {
      this._tip();
    }
  };

  this.tip = function() {
    this.move(5);
    this.sprite.gotoAndStop("hit");
    this.isTipping = true;
  };

  this._tip = function() {
    if (this.sprite.rotation < 90) {
      this.sprite.rotation = this.sprite.rotation + 5;
    } else {
      this.isTipping = false;
      this.isTipped = true;
      this.sprite.gotoAndStop("dead");
    }
  };
}

function CowFactory() {
  this.create = function() {
    var cow = new Cow();
    cow.init();
    return cow;
  };
}

module.exports = new CowFactory();
