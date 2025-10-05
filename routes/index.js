//routes

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');



router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }); // Les plus récents en premier
    res.render('index', { user: req.session.user, projects });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});


module.exports = router;