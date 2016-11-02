let gameStarted = false,
turn;

const gameEvents = (io, socket, players) => {
  socket.on('game viewer', function() {
    socket.leave('lobby');
    socket.join('game room');
  });

  socket.on('join request', function(data) {
    if (players.indexOf(socket) > -1)
      return;
    players.push(socket);
    io.to('game room').emit('new player', {
      seat: data.seat,
      html: "<p>Name: " + data.user + " " + players.indexOf(socket) + "</p>"
    });
    console.log("Players " + players.length);
    if (players.length > 1 && !gameStarted) {
      turn = 0;
      gameStarted = true;
      players[turn].emit('run game', { turn: turn });
    }
  });

  socket.on('next button', function() {
    if (players[turn + 1]) {
      turn++;
      players[turn].emit('run game', { turn: turn });
    } else {
      // Round over
      console.log("Round over");
      turn = 0;
      players[turn].emit('run game', { turn: turn });
    }
  });
};

module.exports = gameEvents;
