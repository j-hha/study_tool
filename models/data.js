var mongoose = require('mongoose');

var flashcardSchema = mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  topic: { type: [ String ], required: true },
  author: { type: String, required: true }
});

var Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
