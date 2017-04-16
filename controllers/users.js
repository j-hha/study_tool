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
    origin: 'new user'
  })
});

// GET create success page
router.get('/new/fail',  function (req, res) {
  res.render('status.ejs', {
    success: false,
    origin: 'new user'
  })
});

// GET sign-up page
router.get('/new', permissions.unknownUser, function (req, res) {
    res.render('users/new.ejs');
});

// GET edit page
router.get('/:id/edit', permissions.loggedIn, function (req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    res.render('users/edit.ejs', {
      user: foundUser
    });
  });
});

// GET show page
// router.get('/:id', permissions.loggedIn, function (req, res) {
//   User.findById(req.params.id, function(err, foundUser) {
//     Topic.find({creator: foundUser.id}, function (err, foundTopics) {
//       res.render('users/show.ejs', {
//         user: foundUser,
//         topics: foundTopics
//       });
//     });
//   });
// });

// ------------------- POST route -------------------
// create new user
router.post('/', permissions.unknownUser, function (req, res) {
  console.log(req.body);
    if (req.body.password.trim() !== "" && req.body.password === req.body.passwordConfirm) {
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
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, updatedUser) {
    res.redirect('/topics');
  });
});

// update password
router.put('/:id/password', permissions.loggedIn, function (req, res) {
  if (req.body.password.trim() !== "" && req.body.password === req.body.passwordConfirm) {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    User.findByIdAndUpdate(req.params.id,
      {
        password: req.body.password
      }, {new: true}, function (err, updatedUser) {
        console.log(err);
        console.log(updatedUser);
      res.redirect('/topics');
    });
  } else {
      res.send('UPDATE FAILED');
  }
});

// ------------------- DELETE route -------------------
// delete user as well as user's topics and flash cards
router.delete('/:id', permissions.loggedIn, function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, deletedUser) {
    console.log(err);
    console.log(deletedUser);
    //FILL WITH LOGIC FOR DELETING TOPICS AND FLASH CARDS
    req.session.destroy(function () {
      res.redirect('/');
    });
  });
});

// ------------------- export controller -------------------
module.exports = router;
