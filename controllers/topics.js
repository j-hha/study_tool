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
  res.send('TOPICS ROUTE WORKS');
});

//GET topics new page
router.get('/new', function (req, res) {
  res.send('TOPICS NEW ROUTE WORKS');
});


//GET topics edit page
router.get('/:id/edit', function (req, res) {
  res.send('TOPICS EDIT ROUTE WORKS');
});

//GET topics show page
router.get('/:id', function (req, res) {
  res.send('TOPICS SHOW ROUTE WORKS');
});

// ------------------- export controller -------------------
module.exports = router;
