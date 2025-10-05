const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  alternativeTitle: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    default: ''
  },
  coverUrl: {
    type: String,
    default: ''
  },
  genres: {
  type: [String],
  default: []
  },
  themes: {
    type: [String],
    default: []
  },
  author: {
    type: String,
    default: ''
  },
  artist: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
