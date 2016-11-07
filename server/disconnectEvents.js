const disconnectEvents = (io, socket, connections, users, players) => {
  socket.on('disconnect', function() {
    if (socket.isPlayer) { removeFromGames(socket); }
    socket.leave('lobby');
    delete connections[socket.id];
    delete users[socket.id];
    console.log("Connected: " + Object.keys(connections).length);
  });

  function removeFromGames(socket) {
    Players = players[socket.gameId];
    io.to(socket.gameId).emit('player offline', {
      seat: socket.seat
    });
    Players.splice(Players.indexOf(socket), 1);
    if (Players.length < 2) {
      io.to(socket.gameId).emit('reset game');
    }
  }
};
module.exports = disconnectEvents;
