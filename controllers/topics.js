// ------------------- set up express router -------------------
var express = require('express'),
    router = express.Router();

// ------------------- models -------------------
var User = require('../models/users.js'),
    Topic = require('../models/topics.js'),
    Data = require('../models/data.js');


// ------------------- permissions middleware set up -------------------
var permissions = require('../middleware/permissions.js');


// ------------------- GET routes -------------------
//GET topics index page
router.get('/', permissions.loggedIn, function (req, res) {
  Topic.find({}, function (err, allTopics) {
    User.findById(req.session.currentUserId, function (err, foundUser) {
      var userTopics = [],
          otherTopics = [];
      for (var i = 0; i < allTopics.length; i++) {
        if (allTopics[i].creator === foundUser.id) {
          userTopics.push(allTopics[i]);
        } else {
          otherTopics.push(allTopics[i]);
        }
      }
      res.render('topics/index.ejs', {
        userTopics: userTopics,
        otherTopics: otherTopics,
        user: foundUser
      });
    });
  });
});

//GET topics new page
router.get('/new', permissions.loggedIn, function (req, res) {
  User.findById(req.session.currentUserId, function(err, foundUser){
    res.render('topics/new.ejs', {
      user: foundUser
    });
  });
});

//GET topics edit page
router.get('/:id/revise', permissions.loggedIn, function (req, res) {
  Topic.findById(req.params.id, function (err, foundTopic) {
    User.findById(req.session.currentUserId, function(err, foundUser){
      res.render('topics/revise.ejs', {
        topic: foundTopic,
        user: foundUser
      });
    });
  });
});

//GET topics edit page
router.get('/:id/edit', permissions.loggedIn, function (req, res) {
  Topic.findById(req.params.id, function (err, foundTopic) {
    if (!err) {
      User.findById(req.session.currentUserId, function(err, foundUser){
        if (foundTopic.creator === foundUser.id) {
          res.render('topics/edit.ejs', {
            topic: foundTopic,
            user: foundUser
          });
        } else {
          res.status(403).send('403 Forbidden');
        }
      });
    } else {
      console.log(err);
      res.status(404).send('404 Not Found');
    }
  });
});

//GET for ajax request
router.get('/:id/cards', permissions.loggedIn, function (req, res) {
  Data.find({topic: req.params.id}, function (err, foundCards) {
    res.send(foundCards);
  });
});

//GET topics show page
router.get('/:id', permissions.loggedIn, function (req, res) {
  Topic.findById(req.params.id, function (err, foundTopic) {
    console.log(err);
    Data.find({topic: req.params.id}, function (err, foundCard) {
      User.findById(req.session.currentUserId, function(err, foundUser){
        res.render('topics/show.ejs', {
          topic: foundTopic,
          cards: foundCard,
          user: foundUser
        });
      });
    });
  });
});


// ------------------- POST route -------------------
//POST create new topic
router.post('/', permissions.loggedIn, function (req, res) {
    Topic.create(
    {
      title: req.body.title,
      description: req.body.description,
      creator: req.session.currentUserId
    },
    function(err, createdTopic) {
      User.findByIdAndUpdate(req.session.currentUserId, { $push: { topics: createdTopic._id } }, {'new': true}, function (err, updatedUser) {
        console.log(updatedUser);
        console.log(err);
        res.redirect('/topics');
      });
  });
});

// ------------------- PUT route -------------------
router.put('/:id', permissions.loggedIn, function (req, res) {
  Topic.findById(req.params.id, function (err, foundTopic) {
    if (foundTopic.creator === req.session.currentUserId) {
      Topic.findByIdAndUpdate(req.params.id, req.body, {'new': true}, function (err, updatedTopic) {
        res.redirect('/topics/' + req.params.id);
      });
    } else {
      res.status(403).send('403 Forbidden');
    }
  });
});

// ------------------- DELETE route -------------------
router.delete('/:id', permissions.loggedIn, function (req, res) {
  Topic.findById(req.params.id, function (err, foundTopic) {
    if (foundTopic.creator === req.session.currentUserId) {
      Topic.findByIdAndRemove(req.params.id, function (err, deletedTopic) {
        for (var i = 0; i < deletedTopic.flashcards.length; i++) {
          Data.findByIdAndRemove(deletedTopic.flashcards[i], function (err, deletedFlashcard) {
            console.log('topic and flashcard delete' + err);
            console.log('topic and flashcard delete' + deletedFlashcard);
          });
        }
        User.findByIdAndUpdate(deletedTopic.creator, { $pull: {topics: deletedTopic._id } }, {'new': true}, function(err, udpatedUser) {
          console.log('topic delete'+ err);
          console.log('topic delete' + udpatedUser);
          res.redirect('/');
        });
      });
    } else {
      res.status(403).send('403 Forbidden');
    }
  });
});

// ------------------- export controller -------------------
module.exports = router;
