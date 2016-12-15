/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);

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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var CanvasManager = __webpack_require__(2);
	var QuestionOverlayService = __webpack_require__(3);
	var Bicycle = __webpack_require__(4);
	var Checkpoint = __webpack_require__(5);
	var Background = __webpack_require__(8);

	var questions = __webpack_require__(9);

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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	function QuestionOverlayService() {

	  this.overlayIsActive = false;

	  this.showQuestionOverlay = function(question) {
	    this.overlayIsActive = true;

	    $("#question-text").text(question.text);
	    var choicesDiv = $("#question-choices");
	    for (var i = 0; i < question.choices.length; i++) {
	      choicesDiv.append( "<input type='radio' name='choices' value='" + question.choices[i] + "' />  " + question.choices[i] + "<br />");
	    }
	    $("#question-overlay").removeClass("hide");

	    var that = this;
	    $("#submit-answer").click(function(evt) {
	      question.isAnswered = true;
	      question.isCorrect = that.validate(question);
	      that.showFeedback(question);
	    });
	  };

	  this.hideQuestionOverlay = function() {
	    this.overlayIsActive = false;
	    $("#question-text").text("");
	    $("#question-choices").text("");
	    $("#feedback-text").text("");
	    $("#is-correct").text("");
	    $("#question-main").removeClass("hide");
	    $("#question-feedback").addClass("hide");
	    $("#question-overlay").addClass("hide");
	  };

	  this.validate = function(question) {
	    var userAnswer = $("input[name=choices]:checked").val();
	    return (userAnswer === question.correctAnswer);
	  };

	  this.showFeedback = function(question) {
	    var $isCorrect = $("#is-correct");
	    if (question.isCorrect) {
	      $isCorrect.text("You answered correctly!");
	    } else {
	      $isCorrect.text("Your answer was incorrect.");
	    }
	    $("#feedback-text").text(question.feedback);
	    $("#question-main").addClass("hide");
	    $("#question-feedback").removeClass("hide");

	    var that = this;
	    $("#close-overlay").click(function(evt) {
	      that.hideQuestionOverlay();
	    });
	  };
	}

	function QuestionOverlayServiceFactory() {
	  this.create = function() {
	    return new QuestionOverlayService();
	  };
	}

	module.exports = new QuestionOverlayServiceFactory();


/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Stoplight = __webpack_require__(6);
	var Cow = __webpack_require__(7);

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


/***/ },
/* 6 */
/***/ function(module, exports) {

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


/***/ },
/* 7 */
/***/ function(module, exports) {

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


/***/ },
/* 8 */
/***/ function(module, exports) {

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


/***/ },
/* 9 */
/***/ function(module, exports) {

	
	var questions = [
	  {
	    text: "What does your treatment team recommend you do if you think you might have a bleed?",
	    choices: ["Don’t delay. Treat right away!", "Freak out", "Throw a temper tantrum", "Throw a temper tantrum and THEN freak out"],
	    correctAnswer: "Don’t delay. Treat right away!",
	    feedback: "This is a feedback placeholder.",
	    isAnswered: false,
	    isCorrect: null
	  },
	  {
	    text: "Which of these is an example of a safe sport?",
	    choices: ["Rock Climbing", "Football", "Rugby", "Golf"],
	    correctAnswer: "Golf",
	    feedback: "This is a feedback placeholder.",
	    isAnswered: false,
	    isCorrect: null
	  },
	  {
	    text: "What does your treatment team recommend you do if you think you might have a bleed?",
	    choices: ["Don’t delay. Treat right away!", "Freak out", "Throw a temper tantrum", "Throw a temper tantrum and THEN freak out"],
	    correctAnswer: "Don’t delay. Treat right away!",
	    feedback: "This is a feedback placeholder.",
	    isAnswered: false,
	    isCorrect: null
	  }
	];

	module.exports = questions;


/***/ }
/******/ ]);