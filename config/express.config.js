// configuration de express
const express = require('express');
const path = require('path');

const configureExpress = (app) => {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = configureExpress;