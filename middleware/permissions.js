// ------------------- require user model -------------------
var User = require('../models/users.js');

// ------------------- permissions object -------------------

var permissions = {
  // Allows logged in users to navigate to restricted pages, unknown users are sent back to the landing page
  loggedIn: function (req, res, next) {
    if (req.session.currentUserId !== undefined) {
      User.findById(req.session.currentUserId, function (err, foundUser) {
        if (foundUser !== undefined) {
          return next();
        } else {
          return res.redirect('/topics');
        }
      });
    } else {
      return res.redirect('/sessions/new');
    }
  },
  // Allows unknown users to access landing page, sign in and sign up pages, users who have already signed in are sent back to the users index page if they try to access these sites
  unknownUser: function (req, res, next) {
    if (req.session.currentUserId === undefined) {
      return next();
    } else {
      return res.redirect('/topics');
    }
  },
  author: function (req, res, next) {
    if (req.session.currentUserId !== undefined) {
      return next();
  } else {
    return res.redirect('/topics');
  }
}
};

module.exports = permissions;


// THIS CODE IS BASED ON THE FOLLOWING SOURCES:
// - http://www.codexpedia.com/node-js/a-very-basic-session-auth-in-node-js-with-express-js/
// - https://expressjs.com/en/guide/writing-middleware.html
