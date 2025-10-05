const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Chapter = require('../models/Chapter');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📌 Fonction pour créer un dossier projet
function createProjectFolder(projectName) {
  const sanitizedFolderName = projectName.replace(/[^a-zA-Z0-9]/g, ''); // Supprime espaces + caractères spéciaux
  const folderPath = path.join(__dirname, '../public/uploads/', sanitizedFolderName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return { folderPath, sanitizedFolderName };
}

// 📌 Multer storage dynamique
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectName = req.body.title || "defaultProject";
    const { folderPath } = createProjectFolder(projectName);
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, "couverture" + path.extname(file.originalname)); // couverture.png
  }
});

const upload = multer({ storage: storage });

// 📌 ROUTE : Page formulaire création projet
router.get('/create', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'writer') {
    return res.redirect('/');
  }
  res.render('createProject', { user: req.session.user });
});

// 📌 ROUTE : POST création projet avec upload
router.post('/create', upload.single('coverImage'), async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'writer') {
    return res.redirect('/');
  }

  try {
    const {
      title,
      alternativeTitle,
      summary,
      author,
      artist
    } = req.body;

    const genres = Array.isArray(req.body.genres) ? req.body.genres : [req.body.genres].filter(Boolean);
    const themes = Array.isArray(req.body.themes) ? req.body.themes : [req.body.themes].filter(Boolean);

    const sanitizedFolderName = title.replace(/[^a-zA-Z0-9]/g, '');
    const coverUrl = req.file ? `/uploads/${sanitizedFolderName}/${req.file.filename}` : '';

    const project = new Project({
      title,
      alternativeTitle,
      summary,
      coverUrl,
      genres,
      themes,
      author,
      artist
    });

    await project.save();
    res.redirect(`/projects/${project._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la création du projet');
  }
});

// 📌 ROUTE : Affichage d'un projet et ses chapitres
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send('Projet introuvable');

    const chapters = await Chapter.find({ projectId: project._id }).sort({ number: 1 });

    res.render('projects', { project, chapters, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
