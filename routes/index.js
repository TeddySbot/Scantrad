const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

// router.post('/upload', uploadController.uploadVideo);
// router.get('/videos', videoController.listVideos);
// router.get('/videos/:filename', videoController.showVideo);

module.exports = router;