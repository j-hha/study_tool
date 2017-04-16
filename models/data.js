var mongoose = require('mongoose');

var flashcardSchema = mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  topic: { type: Object, required: true },
  author: { type: Object, required: true }
});

var Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
