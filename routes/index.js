module.exports = function(io) {
  var express = require('express');
  var router = express.Router();

  users = [];
  connections = [];

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Poker' });
  });

  router.get('/lobby', function(req, res, next) {
    res.render('lobby', { title: 'Poker' });
  });

  router.get('/gameroom', function(req, res, next) {
    res.render('gameroom', { title: 'Poker' });
  });

  io.on('connection', function(socket) {
    connections.push(socket);
    console.log("Connected: " + connections.length);

    socket.on('send message', function(data) {
        io.emit('chat update', { message: data });
    });

    socket.on('disconnect', function(data) {
      connections.splice(connections.indexOf(socket), 1);
      console.log("Disconnected");
    });
  })

  return router;
}
