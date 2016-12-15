function CanvasManager(canvasId) {

  this.stage = new createjs.Stage(canvasId);

  this.update = function() {
    this.stage.update();
  };

  this.addToStage = function(item) {
    this.stage.addChild(item);
  };

  this.addAllToStage = function(items) {
    for (var i = 0; i < items.length; i++) {
      this.stage.addChild(items[i]);
    }
  };

  this.removeFromStage = function(item) {
    this.stage.removeChild(item);
  };

  this.removeAllFromStage = function(items) {
    for (var i = 0; i < items.length; i++) {
      this.stage.removeChild(items[i]);
    }
  };

  this.getWidth = function() {
    return this.stage.canvas.width;
  };
}

function CanvasManagerFactory() {
  this.create = function(canvasId) {
    return new CanvasManager(canvasId);
  };
}

module.exports = new CanvasManagerFactory();
