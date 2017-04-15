// ------------------- set up express router -------------------
var express = require('express'),
    router = express.Router();


// ------------------- require user model -------------------
var User = require('../models/users.js');


// ------------------- require encryption package -------------------
var bcrypt = require('bcrypt');


// ------------------- GET route --> log in page -------------------
router.get('/new', function(req, res){
  res.render('sessions/new.ejs');
});


// ------------------- POST route --> user logs in -------------------
router.post('/', function(req, res) {
  User.findOne({ username: req.body.username }, function (err, foundUser) {
    console.log(foundUser);
    if(bcrypt.compareSync(req.body.password, foundUser.password)) {
      req.session.currentUserId = foundUser.id;
      console.log(req.session.currentUserId);
      // JUST FOR TESTING
      res.redirect('/users');
    } else {
      // JUST FOR TESTING
      res.send('ERROR');
    }
  });
});


// ------------------- DELETE route --> user logs out -------------------
router.delete('/', function (req, res) {
  req.session.destroy(function () {
    res.redirect('/');
  });
});

// ------------------- export controller -------------------
module.exports = router;
