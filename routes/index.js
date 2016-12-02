module.exports = function(io, db) {
  const express = require('express');
  const router = express.Router();
  const ioConnect = require('../server/ioServer.js');

  // Testing db, remove this later;
  db.query('SELECT FirstName FROM Users WHERE UserId=1').then(response => {
      console.log("Test DB query: ", response);
  });

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
