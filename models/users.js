var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: { type: String, minlength: 3, unique: true, required: true},
  password: { type: String, required: true},
  topics: { type: [ String ] },
  stats: [
    {
      topicId: String,
      numRevised: Number,
      percentageCorrect: Number
    }
  ]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
