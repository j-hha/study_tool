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


// ------------------- set up express-session -------------------
var session = require('express-session');
app.use(session({
  secret: 'just for testing purposes',
  resave: false,
  saveUninitialized: false
}))


// ------------------- set up usersController -------------------
var usersController = require('./controllers/users.js');
app.use('/users', usersController);


// ------------------- set up topicsController -------------------
var topicsController = require('./controllers/topics.js');
app.use('/topics', topicsController);

// ------------------- set up dataController -------------------
var dataController = require('./controllers/data.js');
app.use('/data', dataController);


// ------------------- set up sessionsController -------------------
var sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);


// ------------------- connect to database -------------------
var mongoose = require('mongoose'),
    db = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/study_tool');

db.once('open', function() {
  console.log('Server for study_app connected to mongo');
});

// ------------------- permissions middleware set up -------------------
var permissions = require('./middleware/permissions.js');


// ------------------- routes -------------------

// GET landing page
app.get('/', permissions.unknownUser, function (req, res) {
  res.render('index.ejs');
});


// ------------------- server listening -------------------
app.listen(port, function () {
  console.log('Server for study_app listening at port ' + port);
});
