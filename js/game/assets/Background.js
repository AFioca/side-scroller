function Background() {

  this.background = new createjs.Shape();

  this.lines = new createjs.Shape();

  this.clouds = new createjs.Shape();

  this.init = function() {
    this.background.graphics.beginFill("green");
    // handle width dynamically
    this.background.graphics.drawRect(0, 500, 1000, 100);
    this.background.graphics.beginFill("gray");
    this.background.graphics.drawRect(0, 350, 1000, 150);
    this.background.graphics.beginFill("green");
    this.background.graphics.drawRect(0, 300, 1000, 50);
    this.background.graphics.beginFill("#99ccff");
    this.background.graphics.drawRect(0, 0, 1000, 300);

    this.lines.graphics.beginStroke("white").setStrokeStyle(10).setStrokeDash([50, 50], 0);
    this.lines.graphics.moveTo(0, 425).lineTo(2000, 425);

    this.clouds.graphics.beginFill("white");
    this.clouds.graphics.drawEllipse(50, 100, 125, 75);
    this.clouds.graphics.drawEllipse(100, 75, 125, 75);
    this.clouds.graphics.drawEllipse(150, 100, 125, 75);

    this.clouds.graphics.drawEllipse(600, 50, 125, 75);
    this.clouds.graphics.drawEllipse(650, 25, 125, 75);
    this.clouds.graphics.drawEllipse(650, 75, 125, 75);
    this.clouds.graphics.drawEllipse(700, 50, 125, 75);

    this.clouds.graphics.drawEllipse(1050, 100, 125, 75);
    this.clouds.graphics.drawEllipse(1100, 75, 125, 75);
    this.clouds.graphics.drawEllipse(1150, 100, 125, 75);

    this.clouds.graphics.drawEllipse(1600, 50, 125, 75);
    this.clouds.graphics.drawEllipse(1650, 25, 125, 75);
    this.clouds.graphics.drawEllipse(1650, 75, 125, 75);
    this.clouds.graphics.drawEllipse(1700, 50, 125, 75);

  };

  this.getCanvasObjects = function() {
    return [this.background, this.clouds, this.lines];
  };

  this.moveLeft = function(speed) {
    this.moveLines(speed);
    this.moveClouds(speed/2);
  };

  this.moveLines = function(n) {
    this.lines.x = this.lines.x - n;
    if (this.lines.x <= -1000) {
      this.lines.x = 0;
    }
  };

  this.moveClouds = function(n) {
    this.clouds.x = this.clouds.x - n;
    if (this.clouds.x <= -1000) {
      this.clouds.x = 0;
    }
  };
}

function BackgroundFactory() {
  this.create = function() {
    var background = new Background();
    background.init();
    return background;
  };
}

module.exports = new BackgroundFactory();
