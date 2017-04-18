var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: { type: String, required: true, minlength: 3, unique: true},
  password: { type: String, required: true},
  topics: [],
  stats: [
    {
      topicId: Object,
      numRevised: Number,
      percentageCorrect: Number
    }
  ]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
