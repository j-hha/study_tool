// ------------------- set up express router -------------------
var express = require('express'),
    router = express.Router(),
    User = require('../models/users.js'),
    bcrypt = require('bcrypt');

// ------------------- permissions middleware set up -------------------
var permissions = require('../middleware/permissions.js');


// ------------------- GET routes -------------------

// GET index page
router.get('/', permissions.loggedIn,  function (req, res) {
    res.render('users/index.ejs', {
      currentUser: req.session.currentUser
    });
});

// GET sign-up page
router.get('/new', function (req, res) {
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
router.get('/:id', permissions.loggedIn, function (req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    res.render('users/show.ejs', {
      user: foundUser
    });
  });
});

// ------------------- POST routes -------------------

router.post('/', permissions.unknownUser, function (req, res) {
  console.log(req.body);
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  User.create(req.body, function(err, createdUser) {
    console.log(err);
    console.log(createdUser);
    res.redirect('/');
  });
});

// ------------------- PUT routes -------------------
router.put('/:id', function (req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, updatedUser) {
    res.redirect('/users/' + req.params.id);
  });
});

// ------------------- export controller -------------------
module.exports = router;
