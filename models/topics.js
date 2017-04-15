var mongoose = require('mongoose');

var topicSchema = mongoose.Schema({
  title: { type: String, required: true },
  flashcards: { type: [ String ] },
  creator: { type: String, required: true },
});

var Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
