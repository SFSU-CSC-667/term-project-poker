module.exports = function(io, db) {
  const express = require('express');
  const router = express.Router();
  const ioConnect = require('../server/ioServer.js');

  db.query('SELECT FirstName FROM Users WHERE UserId=1').then(response => {
      console.log("Test DB query: ", response);
  })

  io.on('connection', socket => ioConnect(io, socket, db));

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
