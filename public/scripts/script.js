$(function() {
var pageElements = {
  $qField: $('.quiz-question'),
  $aField: $('.quiz-answer'),
  $endMessage: $('<div>')
}


// ------------------------------ Ajax Request -------------------------------

var currentPage = window.location.href;
var ajaxRequest = currentPage.replace('revise', 'cards');

$.ajax(ajaxRequest)
 .done(function(data) {
   for (var i = 0; i < data.length; i++) {
     allFlashCards.push(data[i]);
   }
   console.log(allFlashCards);
   startGame();
   changeView.$fillForm();
 });

 // --------------------------------------------------------------------------

var changeView = {
  $fillForm: function () {
    pageElements.$qField.text(currentCard.question);
    for (var i = 0; i < pageElements.$aField.length; i++) {
      pageElements.$aField.eq(i).text(possibilities[i]);
    }
  },
  $turnGreen: function (element) {
    element.css('background-color', '#6cdea0');
    element.css('color', '#fff');
    this.$resetAnswerColor(element);
  },
  $turnRed: function (element) {
    element.css('background-color', 'red');
    element.css('color', '#fff');
    this.$showCorrect();
    this.$resetAnswerColor(element);
  },
  $showCorrect: function() {
    setTimeout(function () {
      for (var i = 0; i < pageElements.$aField.length; i++) {
        if (pageElements.$aField.eq(i).text() === currentCard.answer) {
          changeView.$turnGreen(pageElements.$aField.eq(i));
        }
      }
    }, 300);
  },
  $resetAnswerColor: function (element) {
    setTimeout(function () {
      element.css('background-color', '#fff');
      element.css('color', '#000');
    }, 1000);
  },
  $resetView: function () {
    setTimeout(function () {
      resetForNextRound();
      changeView.$fillForm();
    }, 1300);
  }
}

var clickEvents = {
  $checkAnwser: function () {
    console.log('THE CURRENT ROUND IS ' + currentRound);
    var result = compareAnswers($(this).text());
    if (result === true) {
      changeView.$turnGreen($(this));
      changeView.$resetView();
    } else {
      changeView.$turnRed($(this));
      changeView.$resetView();
    }
  }
}

pageElements.$aField.on('click', clickEvents.$checkAnwser);

});

// ------------------------- Vanilla JS ---------------------------------

var currentRound = 0;
var currentCard = {};
var possibilities = [];
var allFlashCards = [];
var scoreCorrect = 0;
var scoreWrong = 0;
var total = allFlashCards.length;


// calculates stats
var tallyScores = function () {
};

// increases num of current round - as long as currentRound < allFlashCards.length
var increaseRound = function () {
  if (currentRound < allFlashCards.length-1) {
    currentRound++;
    getCurrentCard();
    console.log(allFlashCards.length);
    console.log(currentRound);
    return true;
  } else {
    console.log("The END!");
    return false;
  }
};

// add currentCard object back to allFlashCards array at its original position
var resetForNextRound = function () {
  allFlashCards.splice(currentRound, 0, currentCard);
  currentCard = {};
  possibilities = [];
  increaseRound();
};

var compareAnswers = function (answer) {
  if (answer === currentCard.answer) {
    console.log('Your answer ' + answer);
    console.log('correct');
    scoreCorrect++;
    return true;
  } else {
    console.log('Your answer ' + answer);
    console.log('incorrect');
    scoreWrong++;
    return false;
  }
};

var addCorrectAnswer = function () {
  var randomNum = Math.floor(Math.random()*3);
  possibilities.splice(randomNum, 0, currentCard.answer);
};

var addWrongAnswers = function () {
  //generates a random number smaller than the highest index of the array
  var randomNum = Math.floor(Math.random()*(allFlashCards.length-1));
  // pushes answer at that index into wrong answers array
  possibilities.push(allFlashCards[randomNum].answer);
  possibilities.push(allFlashCards[randomNum + 1].answer);
  addCorrectAnswer();
};

// remove card object holding question and answer to be revised from allFlashCards array and save object in currentCard variable
var getCurrentCard = function () {
  currentCard = allFlashCards[currentRound];
  allFlashCards.splice(currentRound, 1);
  console.log(allFlashCards.length);
  addWrongAnswers();
};

// shuffles all flash cards ahead of game start
var shuffleFlashCards = function () {
  for (var i = 0; i < allFlashCards.length; i++) {
    var randomNum = Math.floor(Math.random()*allFlashCards.length);
      cardToShuffle = allFlashCards[randomNum]
      allFlashCards.splice(randomNum, 1);
      allFlashCards.push(cardToShuffle);
  }
  console.log(allFlashCards.length);
  getCurrentCard();
};

var startGame = function () {
  shuffleFlashCards();
};
