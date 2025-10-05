//routes

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { 
    user: req.session.user 
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/admin', (req, res) => {
  res.render('admin');
});



module.exports = router;