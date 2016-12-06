module.exports = function(io, db) {
  const express = require('express');
  const router = express.Router();
  const ioConnect = require('../server/ioServer.js');

  io.guestCount = 0;

  io.on('connection', socket => ioConnect(io, socket, db));

  router.get('/', (request, response, next) => {
    response.render('index', { title: 'Poker' });
  });

  router.get('/lobby', (request, response, next) => {
    response.render('lobby', { title: 'Poker' });
  });

  router.get('/gameroom', (request, response, next) => {
    response.render('gameroom', { title: 'Poker' });
  });

  return router;
};
