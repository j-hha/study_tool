// ------------------- set up express router -------------------
var express = require('express'),
    router = express.Router(),
    User = require('../models/users.js'),
    Topic = require('../models/topics.js'),
    Data = require('../models/data.js');


// ------------------- permissions middleware set up -------------------
var permissions = require('../middleware/permissions.js');


// ------------------- GET routes -------------------
//GET topics index page
router.get('/', function (req, res) {
  Topic.find({}, function (err, allTopics) {
    console.log(allTopics);
    res.render('topics/index.ejs', {
      topics: allTopics
    });
  });
});

//GET topics new page
router.get('/new', function (req, res) {
  res.render('topics/new.ejs');
});


//GET topics edit page
router.get('/:id/edit', function (req, res) {
  Topic.findById(req.params.id, function (err, foundTopic) {
    res.render('topics/edit.ejs', {
      topic: foundTopic
    });
  });
});


//GET topics show page
router.get('/:id', function (req, res) {
  res.send('TOPICS SHOW ROUTE WORKS');
});


// ------------------- POST route -------------------
//POST create new topic
router.post('/', function (req, res) {
    Topic.create(
    {
      title: req.body.title,
      description: req.body.description,
      creator: req.session.currentUserId
    },
    function(err, createdTopic) {
      console.log(err);
      console.log(createdTopic);
    });
  res.redirect('/topics');
});

// ------------------- PUT route -------------------
router.put('/:id', function (req, res) {
  Topic.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, updatedTopic) {
    console.log(err);
    console.log(updatedTopic);
    res.redirect('/topics/' + req.params.id);
  });
});

// ------------------- export controller -------------------
module.exports = router;
