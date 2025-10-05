const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage pour les chapitres
const chapterStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { number } = req.body;
      const project = await Project.findById(req.params.projectId);

      if (!project) return cb(new Error("Projet introuvable"));

      const sanitizedFolderName = project.title.replace(/\s+/g, '');
      const folderPath = path.join(__dirname, `../public/uploads/${sanitizedFolderName}/${number}`);

      fs.mkdirSync(folderPath, { recursive: true });
      cb(null, folderPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    // On renomme les pages en page1.png, page2.png, ...
    const extension = path.extname(file.originalname);
    if (!req.fileIndex) req.fileIndex = 1;

    const filename = `page${req.fileIndex}${extension}`;
    req.fileIndex++;

    cb(null, filename);
  }
});

const chapterUpload = multer({ storage: chapterStorage });

// FORMULAIRE : création chapitre
router.get('/create/:projectId', async (req, res) => {
  const projectId = req.params.projectId;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).send("Projet introuvable");

  res.render('createChapter', { project });
});

// POST : création chapitre
router.post('/create/:projectId', chapterUpload.array('pages'), async (req, res) => {
  try {
    const { number, title, releaseDate, scanlator } = req.body;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
    const sanitizedFolderName = project.title.replace(/\s+/g, '');

    // On stocke les chemins corrects selon la nouvelle organisation
    const pages = req.files.map((file, index) => {
      return `/uploads/${sanitizedFolderName}/${number}/page${index + 1}${path.extname(file.originalname)}`;
    });

    const chapter = new Chapter({
      number,
      title,
      releaseDate,
      projectId,
      scanlator,
      pages
    });

    await chapter.save();
    res.redirect(`/projects/${projectId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la création du chapitre');
  }
});

// LECTURE : lire un chapitre
router.get('/:chapterId', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);
    if (!chapter) return res.status(404).send('Chapitre introuvable');

    res.render('readChapter', { chapter });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
