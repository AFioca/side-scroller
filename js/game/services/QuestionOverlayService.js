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
