const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true,
  },
  pageNumber: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,  // URL ou chemin vers l'image de la page
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Page', pageSchema);
