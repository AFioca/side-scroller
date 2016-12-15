var CanvasManager = require('./managers/CanvasManager');
var QuestionOverlayService = require('./services/QuestionOverlayService');
var Bicycle = require('./assets/Bicycle');
var Checkpoint = require('./assets/Checkpoint');
var Background = require('./assets/Background');

var questions = require('./config/Questions');

function Game(canvasId) {

  this.canvasManager = CanvasManager.create(canvasId);
  this.questionOverlayService = QuestionOverlayService.create();

  this.gameSpeed = 3;
  this.isPaused = false;
  this.gameOver = false;

  this.bicycle = Bicycle.create();
  this.move = null;
  this.background = Background.create();

  this.checkpoints = [];
  this.previousCheckpoint = null;
  this.currentCheckpoint = null;
  this.completedCheckpoints = [];

  this.init = function() {

    this.canvasManager.addAllToStage(this.background.getCanvasObjects());

    this._initializeCheckpoints();

    this.canvasManager.addToStage(this.bicycle.getCanvasObject());

    this.bicycle.moveTo(150, 350);

    this.configureTicker();
  };

  this.tick = function() {
    if (this.gameOver) {

    } else if (!this.isPaused) {

      // move background
      this.background.moveLeft(this.gameSpeed);

      if (this.move) {
        this.bicycle.move(this.move, this.canvasManager.getWidth() * 0.8);
      }

      // update checkpoints
      this._updatePreviousCheckpoint();
      this.currentCheckpoint.moveAssets(this.gameSpeed);
      if (!this.bicycle.isJumping) { // move into checkpoint?
        this.currentCheckpoint.handleCollisions(this.bicycle);
      }

      // check for player hitting checkpoing
      if (!this.currentCheckpoint.isComplete && this.currentCheckpoint.isAtStoplight(this.bicycle)) {
        this.isPaused = true;
        this.atCheckpoint = true;
        // this.questionOverlayService.showQuestionOverlay(this.currentCheckpoint.question); // should be a toggle
      }

      this.bicycle.update();
      this.canvasManager.update();

    } else if (this.atCheckpoint &&
               !this.currentCheckpoint.question.isAnswered &&
               !this.questionOverlayService.overlayIsActive) {

      this.questionOverlayService.showQuestionOverlay(this.currentCheckpoint.question);

    } else if (this.atCheckpoint &&
               this.currentCheckpoint.question.isAnswered &&
               !this.questionOverlayService.overlayIsActive) {

      if (this.currentCheckpoint.question.isCorrect) {
        this._beginNextCheckpoint();
      } else {
        this._resetCurrentCheckpoint();
      }
      this.isPaused = false;
      this.atCheckpoint = false;
    }
  };

  this.configureTicker = function() {
    createjs.Ticker.useRAF = true; // not sure what this does yt
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.tick.bind(this));
  };

  this.jump = function() {
    this.bicycle.jump();
  };

  this.moveRight = function() {
    this.move = "right";
  };

  this.moveLeft = function() {
    this.move = "left";
  };

  this.clearMove = function() {
    this.move = null;
  };

  this._initializeCheckpoints = function() {
    this._generateCheckpoints();
    this._setNewCurrentCheckpoint();
  };

  this._generateCheckpoints = function() {
    var checkpointCount = questions.length;
    for (var i = 0; i < checkpointCount; i++) {
      this.checkpoints.push(Checkpoint.create(questions[i]));
    }
  };

  this._setNewCurrentCheckpoint = function() { //increment?
    var startingX = 0;
    if (this.currentCheckpoint != null) {
      this.previousCheckpoint = this.currentCheckpoint;
    }

    this.currentCheckpoint = this.checkpoints.shift();
    this.currentCheckpoint.init(this.bicycle.getCurrentX());
    this.canvasManager.addAllToStage(this.currentCheckpoint.getCanvasObjects());

  };

  this._updatePreviousCheckpoint = function() {
    if (this.previousCheckpoint) {
      this.previousCheckpoint.moveAssets(this.gameSpeed);
      if (this.previousCheckpoint.getRightBoundary() <= 0) {
        this.canvasManager.removeAllFromStage(this.previousCheckpoint.getCanvasObjects());
        this.completedCheckpoints.push(this.previousCheckpoint);
        this.previousCheckpoint = null;
      }
    }
  };

  this._beginNextCheckpoint = function() {
    this.currentCheckpoint.completeCheckpoint();
    this.currentCheckpoint.moveAssets(10);
    if (this.checkpoints.length > 0) {
      this.canvasManager.removeFromStage(this.bicycle.getCanvasObject());
      this._setNewCurrentCheckpoint();
      this.canvasManager.addToStage(this.bicycle.getCanvasObject());
    } else {
      this.gameOver = true;
    }
  };

  this._resetCurrentCheckpoint = function() {
    this.bicycle.moveTo(150, 350);
    this.canvasManager.removeFromStage(this.bicycle.getCanvasObject());
    this.canvasManager.removeAllFromStage(this.currentCheckpoint.getCanvasObjects());
    this.currentCheckpoint.reset(this.bicycle.getCurrentX());
    this.canvasManager.addAllToStage(this.currentCheckpoint.getCanvasObjects());
    this.canvasManager.addToStage(this.bicycle.getCanvasObject());
  };
}

function GameFactory() {
  this.create = function(canvasId) {
    var game = new Game(canvasId);
    game.init();
    return game;
  };
}

module.exports = new GameFactory();
