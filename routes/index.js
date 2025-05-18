const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { 
    user: req.session.user // Passe l'utilisateur à la vue
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});



module.exports = router;