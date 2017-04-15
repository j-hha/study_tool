var mongoose = require('mongoose');

var topicSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  flashcards: { type: [ String ] },
  creator: { type: Object, required: true },
});

var Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
