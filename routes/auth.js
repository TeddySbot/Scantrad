// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;
    
    // Validation
    if (password !== passwordConfirm) {
      return res.status(400).render('signup', { 
        error: 'Passwords do not match',
        formData: req.body 
      });
    }

    // Création utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).render('signup', { 
      error: 'Registration failed',
      formData: req.body 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
      if (!req.session) {
          throw new Error('Session non initialisée');
      }

      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
          return res.status(400).render('login', {
              error: 'Email et mot de passe requis',
              formData: { email }
          });
      }

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).render('login', {
              error: 'Identifiants incorrects',
              formData: { email }
          });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).render('login', {
              error: 'Identifiants incorrects',
              formData: { email }
          });
      }

      // Stockage dans la session
      req.session.user = {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
      };

      // Enregistrement de la session avant redirection
      req.session.save(err => {
          if (err) {
              console.error('Erreur sauvegarde session:', err);
              return res.status(500).render('login', {
                  error: 'Erreur lors de la connexion',
                  formData: { email }
              });
          }
          res.redirect('/');
      });

  } catch (error) {
      console.error('Erreur de connexion:', error);
      res.status(500).render('login', {
          error: 'Erreur serveur lors de la connexion',
          formData: req.body
      });
  }
});


router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('Erreur lors de la déconnexion :', err);
        return res.status(500).send('Erreur lors de la déconnexion.');
      }
      res.clearCookie('connect.sid'); // Nom par défaut du cookie de session
      res.redirect('/login');
    });
  } else {
    res.redirect('/login');
  }
});


module.exports = router;