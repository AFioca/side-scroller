var Stoplight = require('./Stoplight');
var Cow = require('./Cow');

function Checkpoint(question) {

  this.startingX = null;
  this.stoplight = null;
  this.numberOfCows = Math.floor(Math.random()*(4-1+1)+1);
  this.cows = null;
  this.finalCowLocation = 0;
  this.isComplete = false;

  this.question = question;

  this.init = function(startingX) {
    this.startingX = startingX;
    this.cows = [];
    this._createCows();
    this.stoplight = Stoplight.create();
    this._placeStoplight();
  };

  this.reset = function(startingX) {
    this.cows = null;
    this.stoplight = null;
    this.question.isAnswered = false;
    this.question.isCorrect = null;
    this.init(startingX);
  };

  this.completeCheckpoint = function() {
    this.isComplete = true;
    this.stoplight.turnGreen();
  };

  this.getCanvasObjects = function() {
    var canvasObjects = [];
    for (var i = 0; i < this.cows.length; i++) {
      canvasObjects.push(this.cows[i].getCanvasObject());
    }
    canvasObjects.push(this.stoplight.getCanvasObject());
    return canvasObjects;
  };

  this.moveAssets = function(speed) {
    // if a cow moves out of canvas, remove it?
    for (var i = 0; i < this.cows.length; i++) {
      this.cows[i].moveLeft(speed);
      this.cows[i].update();
    }
    this.stoplight.moveLeft(speed);
  };

  this.handleCollisions = function(bike) {
    for (var i = 0; i < this.cows.length; i++) {
      var cow = this.cows[i];
      if ((!cow.isTipped && !cow.isTipping) && this.bikeCollidesWithCow(bike, cow)){
        cow.tip();
        bike.toggleFlashing();
      }
    }
  };

  this.isAtStoplight = function(bike) {
    return (bike.getRightBoundary() >= this.stoplight.getLeftBoundary());
  };


  this.bikeCollidesWithCow = function(bike, cow) {
    return (cow.getLeftBoundary() <= bike.getRightBoundary() && cow.getRightBoundary() >= bike.getLeftBoundary());
  };

  this.getRightBoundary = function() {
    return this.stoplight.getRightBoundary();
  };

  this._createCows = function() {
    this.startingX = this.startingX + Math.floor(Math.random()*(1000-400+1)+400);
    var startingY = 375;

    for (var i = 0; i < this.numberOfCows; i++) {
      var cow = Cow.create();
      cow.moveTo(this.startingX, startingY);
      this.cows.push(cow);
      this.startingX = this.startingX + Math.floor(Math.random()*(900-400+1)+400);
    }
    this.finalCowLocation = this.startingX;
  };

  this._placeStoplight = function() {
    this.stoplight.moveTo(this.finalCowLocation + 200, 280);
  };

}

function CheckpointFactory() {
  this.create = function(question) {
    var checkpoint = new Checkpoint(question);
    // checkpoint.init();
    return checkpoint;
  };
}

module.exports = new CheckpointFactory();
