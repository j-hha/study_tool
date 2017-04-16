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

// GET create success page
router.get('/:id/edit/success',  function (req, res) {
  res.render('status.ejs', {
    success: true,
    origin: 'update user'
  })
});

// GET create success page
router.get('/:id/edit/fail',  function (req, res) {
  res.render('status.ejs', {
    success: false,
    origin: 'update user'
  })
});

// ------------------- POST route -------------------
// create new user
router.post('/', permissions.unknownUser, function (req, res) {
  console.log(req.body);
  // Please note: validating here that the user did not leave the password field empty (rather than relying on the schema validation) is vital! If an empty string gets passed to bcrypt, the result will be a string with a length > 0. An empty string as the password will therefore pass the Schema validation
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
    if (err) {
      res.redirect('/users/' + req.params.id + '/edit/fail');
    } else {
      res.redirect('/users/' + req.params.id + '/edit/success');
    }
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
