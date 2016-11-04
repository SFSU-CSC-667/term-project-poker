let gameStarted = false,
turn,
deck = {};

const gameEvents = (io, socket, players) => {
  const Deck = require('../poker-game/deck.js');
  socket.on('game viewer', function() {
    socket.leave('lobby');
    socket.join('game room');
  });

  socket.on('join request', (data) => {
    if (!players[data.gameId])
      players[data.gameId] = [];
    if (players[data.gameId].indexOf(socket) > -1)
      return;
    players[data.gameId].push(socket);
    socket['seat'] = data.seat;
    console.log(players[data.gameId].indexOf(socket));
    io.to('game room').emit('new player', {
      seat: data.seat,
      html: "<p>Name: " + data.user + " " + players[data.gameId].indexOf(socket) + "</p>"
    });
    console.log("Players " + players[data.gameId].length);
    if (players[data.gameId].length > 1 && !gameStarted) {
      startGame(data);
    }
  });

  socket.on('next button', (data) => {
    if (players[turn + 1]) {
      turn++;
      players[data.gameId][turn].emit('run game', { turn: turn });
    } else {
      // Round over
      console.log("Round over");
      turn = 0;
      players[data.gameId][turn].emit('run game', { turn: turn });
    }
  });

  function startGame(data) {
    deck[data.gameId] = new Deck();
    deck[data.gameId].shuffle();
    turn = 0;
    gameStarted = true;
    // Testing stuff
    players[data.gameId].forEach((player) => {
      player.emit('get cards', {
        seat: player['seat'],
        first: deck[data.gameId].draw(),
        second: deck[data.gameId].draw()
      });
    });
    players[data.gameId][turn].emit('run game', { turn: turn });
  }
};

module.exports = gameEvents;
