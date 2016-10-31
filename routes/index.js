module.exports = function(io) {
  var express = require('express');
  var router = express.Router();
  let turn;
  let gameStarted = false;
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
      console.log("Players " + players.length);
      if (players.length > 1 && !gameStarted) {
        turn = 0;
        gameStarted = true;
        players[turn].emit('game start', { turn: turn })
      }
    })
    socket.on('disconnect', function() {
      connections.splice(connections.indexOf(socket), 1);
      players.splice(players.indexOf(socket), 1);
      console.log("Connected: " + connections.length);
    });

    socket.on('next button', function() {
      if (players[turn + 1]) {
        turn++;
        players[turn].emit('next turn', { turn: turn });
      } else {
        // Round over
        console.log("Round over");
        turn = 0;
        players[turn].emit('next turn', { turn: turn });
      }
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
