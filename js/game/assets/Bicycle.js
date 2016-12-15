function Bicycle() {

  this.isFlashing = false;
  this.flashCounter = 0;
  this.isJumping = false;
  this.jumpCounter = 0;

  this.spriteSheet = new createjs.SpriteSheet({
    images: ["/side-scroller/img/bike-sprite.png"],
    frames: {width:200, height:200, regX: 100, regY: 100},
    animations: {
      default: {
        frames: [0],
        speed: 0.1
      },
      hurt: {
        frames: [0, 1],
        speed: 0.1
      }
    }
  });
  this.sprite = new createjs.Sprite(this.spriteSheet, "default");

  this.getCanvasObject = function() {
    return this.sprite;
  };

  this.moveTo = function(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
  };

  this.move = function(direction, maxWidth) {
    if (direction === "right" && (this.getRightBoundary() + 10) <= maxWidth) {
      this.moveRight();
    } else if (direction === "left" && (this.getLeftBoundary() - 10) >= 0) {
      this.moveLeft();
    }
  };

  this.moveRight = function() {
    this.sprite.x = this.sprite.x + 10;
  };

  this.moveLeft = function() {
    this.sprite.x = this.sprite.x - 10;
  };

  this.jump = function() {
    this.isJumping = true;
  };

  this.update = function() {
    if (this.isJumping) {
      this._jump();
    }
    if (this.isFlashing) {
      this._flash();
    }
  };

  this.toggleFlashing = function() {
    this.isFlashing = !this.isFlashing;
    if (this.isFlashing) {
      this.sprite.gotoAndPlay("hurt");
    } else {
      this.sprite.gotoAndStop("defailt");
    }
  };

  this._flash = function() {
    if (this.flashCounter < 120) {
      this.flashCounter = this.flashCounter + 1;
    } else {
      this.toggleFlashing();
      this.flashCounter = 0;
    }
  };

  this.getRightBoundary = function() {
    return this.sprite.x + 100;
  };

  this.getLeftBoundary = function() {
    return this.sprite.x - 100;
  };

  this.getCurrentX = function() {
    return this.sprite.x;
  };

  this._jump = function() {
    var n = 10;
    this.jumpCounter = this.jumpCounter + 1;
    if (this.jumpCounter <= 20) {
      this.sprite.y = this.sprite.y - n;
    } else if (this.jumpCounter <= 40) {
      this.sprite.y = this.sprite.y + n;
    } else {
      this.isJumping = false;
      this.jumpCounter = 0;
    }
  };
}

function BicycleFactory() {
  this.create = function() {
    return new Bicycle();
  };
}

module.exports = new BicycleFactory();
