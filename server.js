// ------------------- set up express -------------------
var express = require('express'),
    app = express(),
    port = 3000;


// ------------------- set up bodyParser -------------------
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// ------------------- set up methodOverride -------------------
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

// ------------------- require local files -------------------



// ------------------- connect to database -------------------
var mongoose = require('mongoose'),
    db = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/auth');

db.once('open', function() {
  console.log('Server for study_app connected to mongo');
});

// ------------------- routes -------------------
app.get('/', function (req, res) {
  res.render('index.ejs');
});


// ------------------- server listening -------------------
app.listen(port, function () {
  console.log('Server for study_app listening at port ' + port);
});
