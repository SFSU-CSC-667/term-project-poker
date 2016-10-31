module.exports = function(io) {
  var express = require('express');
  var router = express.Router();

  users = [];
  connections = [];

  io.on('connection', function(socket) {
    connections.push(socket);
    console.log("Connected: " + connections.length);

    socket.on('send message', function(data) {
      io.emit('chat update', { message: data });
    });

    socket.on('join request', function(data) {
      io.emit('new player', { user: data.user,
                              seat: data.seat,
                              connection: connections.indexOf(socket) });
    })
    socket.on('disconnect', function() {
      connections.splice(connections.indexOf(socket), 1);
      io.emit('game disconnect');
      console.log("Disconnected");
    });
  })

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
