let turn,
gameStarted = false,
players = [],
users = [],
connections = [];

const ioConnect = (io, socket) => {
    socket.join('lobby');
    connections.push(socket);
    console.log("Connected: " + connections.length);

    socket.on('send message', function(data) {
      io.emit('chat update', { message: data });
    });

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
        html: "<p>Name: " + data.user + " " + connections.indexOf(socket) + "</p>"
      });
      console.log("Players " + players.length);
      if (players.length > 1 && !gameStarted) {
        turn = 0;
        gameStarted = true;
        players[turn].emit('run game', { turn: turn });
      }
    });

    socket.on('disconnect', function() {
      socket.leave('lobby');
      socket.leave('game room');
      connections.splice(connections.indexOf(socket), 1);
      players.splice(players.indexOf(socket), 1);
      console.log("Connected: " + connections.length);
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

module.exports = ioConnect;
