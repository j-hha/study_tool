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
  res.render('topics/new.ejs');
});


//GET topics edit page
router.get('/:id/edit', permissions.loggedIn, function (req, res) {
  Topic.findById(req.params.id, function (err, foundTopic) {
    res.render('topics/edit.ejs', {
      topic: foundTopic
    });
  });
});


//GET topics show page
router.get('/:id', permissions.loggedIn, function (req, res) {
  Topic.findById(req.params.id, function (err, foundTopic) {
    Data.find({topic: req.params.id}, function (err, foundCard) {
      res.render('topics/show.ejs', {
        topic: foundTopic,
        cards: foundCard
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
      res.redirect('/topics');
    });
});

// ------------------- PUT route -------------------
router.put('/:id', permissions.loggedIn, function (req, res) {
  Topic.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, updatedTopic) {
    res.redirect('/topics/' + req.params.id);
  });
});

// ------------------- DELETE route -------------------
router.delete('/:id', permissions.loggedIn, function (req, res) {
  Topic.findByIdAndRemove(req.params.id, function (err, deletedTopic) {
    //FILL WITH LOGIC FOR DELETING TOPIC ID FROM USER AND FLASH CARDS
    res.redirect('/');
  });
});

// ------------------- export controller -------------------
module.exports = router;
