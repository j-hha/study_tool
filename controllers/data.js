// ------------------- set up express router -------------------
var express = require('express'),
    router = express.Router();

// ------------------- models -------------------
var User = require('../models/users.js'),
    Topic = require('../models/topics.js'),
    Data = require('../models/data.js');

// ------------------- permissions middleware set up -------------------
var permissions = require('../middleware/permissions.js');

//GET topics new page
router.get('/new/:topicId', permissions.loggedIn, function (req, res) {
  Topic.findById(req.params.topicId, function (err, foundTopic) {
    res.render('data/new.ejs', {
      topic: foundTopic,
      user: req.session.currentUserId
    });
  });
});


//GET topics edit page
router.get('/:id/edit', permissions.loggedIn, function (req, res) {
  Data.findById(req.params.id, function (err, foundCard) {
    res.render('data/edit.ejs', {
      card: foundCard,
      user: req.session.currentUserId
    });
  });
});


// ------------------- POST route -------------------
router.post('/:topicId', permissions.loggedIn, function (req, res) {
    Data.create(
    {
      question: req.body.question,
      answer: req.body.answer,
      topic: req.params.topicId,
      author: req.session.currentUserId
    },
    function(err, createdCard) {
      console.log('create card' + err);
      console.log('create card' + createdCard);
      Topic.findByIdAndUpdate(req.params.topicId, { $push: { flashcards: createdCard._id } }, {'new': true}, function(err, updatedTopic) {
        console.log('create card + update' + err);
        console.log('create card + update' + updatedTopic);
        res.redirect('/topics/' + req.params.topicId);
      });
    });
  });


// ------------------- PUT route -------------------
router.put('/:id', permissions.loggedIn, function (req, res) {
  Data.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, updatedCard) {
    Topic.findById(updatedCard.topic, function (err, foundTopic) {
      res.redirect('/topics/' + updatedCard.topic);
    });
  });
});

// ------------------- DELETE route -------------------

router.delete('/:id', permissions.loggedIn, function (req, res) {
  Data.findByIdAndRemove(req.params.id, function (err, deletedCard) {
    //FILL WITH LOGIC FOR DELETING DATA ID FROM TOPICS
    Topic.findByIdAndUpdate(deletedCard.topic,
      { $pull: {flashcards: deletedCard._id} }, {'new': true}, function (err, updatedTopic) {
          console.log('delete card and update topic' + err);
          console.log('delete card and update topic' + updatedTopic);
        //redirect to topic show page!
        res.redirect('/topics/' + deletedCard.topic);
    });
  });
});

// ------------------- export controller -------------------
module.exports = router;
