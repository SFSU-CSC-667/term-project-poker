module.exports = function(io) {
  const express = require('express');
  const router = express.Router();
  const ioConnect = require('../server.js');

  io.on('connection', socket => ioConnect(io, socket));

  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Poker' });
  });

  router.get('/lobby', function(req, res, next) {
    res.render('lobby', { title: 'Poker' });
  });

  router.get('/gameroom', function(req, res, next) {
    res.render('gameroom', { title: 'Poker' });
  });

  return router;
}
