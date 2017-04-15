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



// ------------------- DELETE route --> user logs out -------------------


// ------------------- export controller -------------------
module.exports = router;
