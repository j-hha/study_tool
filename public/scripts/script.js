$(function() {
var pageElements = {
  $qField: $('.quiz-question'),
  $aField: $('.quiz-answer')
}

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
startGame();
changeView.$fillForm();
});

var allFlashCards = [
  {
    question: "question 1",
    answer: "answer 1"
  },
  {
    question: "question 2",
    answer: "answer 2"
  },
  {
    question: "question 3",
    answer: "answer 3"
  },
  {
    question: "question 4",
    answer: "answer 4"
  },
  {
    question: "question 5",
    answer: "answer 5"
  },
  {
    question: "question 6",
    answer: "answer 6"
  },
  {
    question: "question 7",
    answer: "answer 7"
  }
];

var currentRound = 0;
var currentCard = {};
var possibilities = [];

// increases num of current round - as long as currentRound < allFlashCards.length
var increaseRound = function () {
  if (currentRound < allFlashCards.length-1) {
    currentRound++;
    getCurrentCard();
    console.log(allFlashCards.length);
    console.log(currentRound);
  } else {
    console.log("The END!");
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
    return true;
  } else {
    console.log('Your answer ' + answer);
    console.log('incorrect');
    return false;
  }
};

// var askQuestion = function () {
//   console.log(currentCard.question);
//   for (var i = 0; i < possibilities.length; i++) {
//     console.log(possibilities[i]);
//   }
// }

var addCorrectAnswer = function () {
  var randomNum = Math.floor(Math.random()*3);
  possibilities.splice(randomNum, 0, currentCard.answer)
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

// startGame();
// compareAnswers('answer 1');
// getCurrentCard();
// compareAnswers('answer 2');
// getCurrentCard();
// compareAnswers('answer 3');
// getCurrentCard();
// compareAnswers('answer 4');
// getCurrentCard();
// compareAnswers('answer 5');
// getCurrentCard();
// compareAnswers('answer 6');
// getCurrentCard();
// compareAnswers('answer 7');




//// ajax

// var currentPage = window.location.href;
// var ajaxRequest = currentPage.replace('revise', 'cards');
// var allFlashCards = [];

// $.ajax(ajaxRequest)
//  .done(function(data) {
//    for (var i = 0; i < data.length; i++) {
//      allFlashCards.push(data[i]);
//    }
//    console.log(allFlashCards);
//
//    for (var i = 0; i < allFlashCards.length; i++) {
//      console.log("hi loop");
//      var randomNum = Math.floor(Math.random()*allFlashCards.length);
//      if (randomNum === i) {
//        cardToShuffle = allFlashCards[i]
//        allFlashCards.splice(randomNum, 1);
//        allFlashCards.push(cardToShuffle);
//      }
//    }
//    console.log(allFlashCards);
//
//  });
