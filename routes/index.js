module.exports = function(io) {
  var express = require('express');
  var router = express.Router();

  players = [];
  users = [];
  connections = [];

  io.on('connection', function(socket) {
    connections.push(socket);
    console.log("Connected: " + connections.length);

    socket.on('send message', function(data) {
      io.emit('chat update', { message: data });
    });

    socket.on('join request', function(data) {
      if (players.indexOf(socket) > -1)
        return;
      players.push(socket);
      io.emit('new player', {
        seat: data.seat,
        html: "<p>Name: " + data.user + " " + connections.indexOf(socket) + "</p>"
      });
      console.log("players " + players.length);
      if (players.length > 1)
        io.emit('game start', { turn: 0 })
    })
    socket.on('disconnect', function() {
      connections.splice(connections.indexOf(socket), 1);
      players.splice(players.indexOf(socket), 1);
      console.log("Connected: " + connections.length);
    });

    socket.on('next button', function() {
      io.emit('next turn', {});
    })
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
