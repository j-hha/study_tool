// ------------------- set up express router -------------------
var express = require('express'),
    router = express.Router(),
    User = require('../models/users.js'),
    Topic = require('../models/topics.js'),
    Data = require('../models/data.js');


// ------------------- permissions middleware set up -------------------
var permissions = require('../middleware/permissions.js');

//GET topics new page
router.get('/new/:topicId', permissions.loggedIn, function (req, res) {
  Topic.findById(req.params.topicId, function (err, foundTopic) {
    res.render('data/new.ejs', {
      topic: foundTopic
    });
  });
});


//GET topics edit page
router.get('/:id/edit', permissions.loggedIn, function (req, res) {
  Data.findById(req.params.id, function (err, foundCard) {
    res.render('data/edit.ejs', {
      card: foundCard
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
    function(err, createdTopic) {
      res.redirect('/topics/' + req.params.topicId);
    });
});

// ------------------- PUT route -------------------


// ------------------- DELETE route -------------------

router.delete('/:id', permissions.loggedIn, function (req, res) {
  Data.findByIdAndRemove(req.params.id, function (err, deletedCard) {
    //FILL WITH LOGIC FOR DELETING DATA ID FROM USER AND TOPICS
    //redirect to topic show page!
    res.redirect('/topics' + deletedCard.topic);
  });
});

// ------------------- export controller -------------------
module.exports = router;
