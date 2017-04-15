// ------------------- set up express router -------------------
var express = require('express'),
    router = express.Router(),
    User = require('../models/users.js'),
    bcrypt = require('bcrypt');

// ------------------- GET routes -------------------

// get sign-up page
router.get('/new', function(req, res) {
  res.render('users/new.ejs');
})


// ------------------- POST routes -------------------

router.post('/', function (req, res) {
  console.log(req.body);
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  User.create(req.body, function(err, createdUser) {
    console.log(err);
    console.log(createdUser);
    res.redirect('/');
  });
});

// ------------------- export controller -------------------
module.exports = router;
