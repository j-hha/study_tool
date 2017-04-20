// ------------------- set up express router -------------------
var express = require('express'),
    router = express.Router(),
    bcrypt = require('bcrypt');


// ------------------- models -------------------
var User = require('../models/users.js'),
    Topic = require('../models/topics.js'),
    Data = require('../models/data.js');


// ------------------- permissions middleware set up -------------------
var permissions = require('../middleware/permissions.js');


// ------------------- GET routes -------------------
// GET create success page
router.get('/new/success',  function (req, res) {
  res.render('status.ejs', {
    success: true,
    origin: 'new user',
    user: req.session.currentUserId
  });
});

// GET create fail page
router.get('/new/fail',  function (req, res) {
  res.render('status.ejs', {
    success: false,
    origin: 'new user',
    user: req.session.currentUserId
  });
});

// GET sign-up page
router.get('/new', permissions.unknownUser, function (req, res) {
    res.render('users/new.ejs', {
      user: req.session.currentUserId
    });
});

// GET delete user profile success page
router.get('/delete/success', function (req, res) {
  res.render('status.ejs', {
    success: true,
    origin: 'delete profile',
    user: req.session.currentUserId
  });
});

// GET delete user profile fail page
router.get('/:id/delete/fail', permissions.loggedIn,  function (req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    res.render('status.ejs', {
      success: false,
      origin: 'delete profile',
      user: foundUser,
    });
  });
});

// GET edit page
router.get('/:id/edit', permissions.loggedIn, function (req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (!err) {
      if (foundUser.id === req.session.currentUserId) {
        res.render('users/edit.ejs', {
          user: foundUser
        });
      } else {
        res.status(403).send('403 Forbidden');
      }
    } else {
      res.status(404).send('404 Not Found');
    }
  });
});

// GET  edit success page
router.get('/:id/edit/success', permissions.loggedIn,  function (req, res) {
  User.findById(req.params.id, function(err, foundUser) {
      res.render('status.ejs', {
        success: true,
        origin: 'update user',
        user: foundUser
    });
  });
});

// GET edit fail page
router.get('/:id/edit/fail', permissions.loggedIn,  function (req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    res.render('status.ejs', {
      success: false,
      origin: 'update user',
      user: foundUser
    });
  });
});

// GET edit password success page
router.get('/:id/edit/password/success', permissions.loggedIn, function (req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    res.render('status.ejs', {
      success: true,
      origin: 'update password',
      user: foundUser
    });
  });
});

// GET edit password fail page
router.get('/:id/edit/password/fail', permissions.loggedIn,  function (req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    res.render('status.ejs', {
      success: false,
      origin: 'update password',
      user: foundUser
    });
  });
});


// ------------------- POST route -------------------
// create new user
router.post('/', permissions.unknownUser, function (req, res) {
  console.log(req.body);
  // Please note: validating here that the user did not leave the password field empty (rather than relying on the schema validation) is vital! If an empty string gets passed to bcrypt, the result will be a string with a length > 0. An empty string as the password will therefore pass the Schema validation. This is a backup in case in-browser validation fails.
    if (req.body.password.length >= 8 && req.body.password === req.body.passwordConfirm) {
      req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
      User.create(req.body, function(err, createdUser) {
        if (err) {
          res.redirect('/users/new/fail');
        } else {
          res.redirect('/users/new/success');
        }
      });
    } else {
      res.redirect('/users/new/fail');
    }
});

// ------------------- PUT route -------------------
// update user information
router.put('/:id', permissions.loggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (!err) {
      if (foundUser.id === req.session.currentUserId) {
        User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }, function (err, updatedUser) {
          if (err) {
            res.redirect('/users/' + req.params.id + '/edit/fail');
          } else {
            res.redirect('/users/' + req.params.id + '/edit/success');
          }
        });
      } else {
        res.status(403).send('403 Forbidden');
      }
    } else {
      res.status(404).send('404 Not Found');
    }
  });
});

// update password
router.put('/:id/password', permissions.loggedIn, function (req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (!err) {
      if (foundUser.id === req.session.currentUserId) {
        if (req.body.password.length >= 8 && req.body.password === req.body.passwordConfirm) {
          req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
          User.findByIdAndUpdate(req.params.id,
            {
              password: req.body.password
            }, { runValidators: true }, function (err, updatedUser) {
              console.log(err);
              console.log(updatedUser);
            res.redirect('/users/' + req.params.id + '/edit/password/success');
          });
        } else {
          res.redirect('/users/' + req.params.id + '/edit/password/fail');
        }
      } else {
        res.status(403).send('403 Forbidden');
      }
    } else {
      res.status(404).send('404 Not Found');
    }
  });
});

// ------------------- DELETE route -------------------
// delete user as well as user's topics and flash cards
router.delete('/:id', permissions.loggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (!err) {
      if (foundUser.id === req.session.currentUserId) {
        User.findByIdAndRemove(req.params.id, function (err, deletedUser) {
          console.log(err);
          console.log(deletedUser);
          for (var i = 0; i < deletedUser.topics.length; i++) {
            Topic.findByIdAndRemove(deletedUser.topics[i], function(err, deletedTopic) {
              console.log(err);
              console.log(deletedTopic);
              for (var j = 0; j < deletedTopic.flashcards.length; j++) {
                Data.findByIdAndRemove(deletedTopic.flashcards[j], function (err, deletedFlashcard) {
                  console.log('topic and flashcard delete' + err);
                  console.log('topic and flashcard delete' + deletedFlashcard);
                });
              }
            });
          }
          if (!err) {
            req.session.destroy(function () {
              res.redirect('/users/delete/success');
            });
          } else {
            res.redirect('/users/' + req.params.id + 'delete/fail');
          }
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
