const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    default: '',  // titre du chapitre, facultatif
  },
  releaseDate: {
    type: Date,
    default: null,  // date de sortie officielle
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  scanlator: {
    type: String,
    default: '', // nom du groupe qui a scanné/traduit
  },
  pages: {
    type: [String], // Stockage du chemin des images
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chapter', chapterSchema);
