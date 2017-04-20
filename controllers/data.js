// ------------------- set up express router -------------------
var express = require('express'),
    router = express.Router();

// ------------------- models -------------------
var User = require('../models/users.js'),
    Topic = require('../models/topics.js'),
    Data = require('../models/data.js');

// ------------------- permissions middleware set up -------------------
var permissions = require('../middleware/permissions.js');

//GET flash card new page
router.get('/new/:topicId', permissions.loggedIn, function (req, res) {
  Topic.findById(req.params.topicId, function (err, foundTopic) {
    if (!err) {
      if (foundTopic.creator === req.session.currentUserId) {
        res.render('data/new.ejs', {
          topic: foundTopic,
          user: req.session.currentUserId,
        });
      } else {
        res.status(403).send('403 Forbidden');
      }
    } else {
      res.status(404).send('404 Not Found');
    }
  });
});


//GET flash card edit page
router.get('/:id/edit', permissions.loggedIn, function (req, res) {
  Data.findById(req.params.id, function (err, foundCard) {
    if (!err) {
      if (foundCard.author === req.session.currentUserId) {
        res.render('data/edit.ejs', {
          card: foundCard,
          user: req.session.currentUserId
        });
      } else {
        res.status(403).send('403 Forbidden');
      }
    } else {
      res.status(404).send('404 Not Found');
    }
  });
});


// ------------------- POST route -------------------
router.post('/:topicId', permissions.loggedIn, function (req, res) {
  Topic.findById(req.params.topicId, function (err, foundTopic) {
    if (foundTopic.creator === req.session.currentUserId) {
      Data.create(
      {
        question: req.body.question,
        answer: req.body.answer,
        topic: req.params.topicId,
        author: req.session.currentUserId
      },
      function(err, createdCard) {
        Topic.findByIdAndUpdate(req.params.topicId, { $push: { flashcards: createdCard._id } }, {'new': true}, function(err, updatedTopic) {
          res.redirect('/topics/' + req.params.topicId);
        });
      });
    } else {
      res.status(403).send('403 Forbidden');
    }
  });
});


// ------------------- PUT route -------------------
router.put('/:id', permissions.loggedIn, function (req, res) {
  Data.findById(req.params.id, function (err, foundCard) {
    if (!err) {
      if (foundCard.author === req.session.currentUserId) {
        Data.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, updatedCard) {
          Topic.findById(updatedCard.topic, function (err, foundTopic) {
            res.redirect('/topics/' + updatedCard.topic);
          });
        });
      } else {
        res.status(403).send('403 Forbidden');
      }
    } else {
      res.status(404).send('404 Not Found');
    }
  });
});

// ------------------- DELETE route -------------------

router.delete('/:id', permissions.loggedIn, function (req, res) {
  Data.findById(req.params.id, function (err, foundCard) {
    if (!err) {
      if (foundCard.author === req.session.currentUserId) {
        Data.findByIdAndRemove(req.params.id, function (err, deletedCard) {
          Topic.findByIdAndUpdate(deletedCard.topic,
            { $pull: {flashcards: deletedCard._id} }, {'new': true}, function (err, updatedTopic) {
                console.log('delete card and update topic' + err);
                console.log('delete card and update topic' + updatedTopic);
              //redirect to topic show page!
              res.redirect('/topics/' + deletedCard.topic);
          });
        });
      } else {
        res.status(403).send('403 Forbidden');
      }
    } else {
      res.status(404).send('404 Not Found');
    }
    });
});

// ------------------- export controller -------------------
module.exports = router;
