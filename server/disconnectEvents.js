const disconnectEvents = (socket, connections, users, players) => {
  socket.on('disconnect', function() {
    socket.leave('lobby');
    socket.leave('game room');
    delete connections[socket.id];
    delete users[socket.id];
    removeFromGames(socket)
    console.log("Connected: " + Object.keys(connections).length);
  });

  function removeFromGames(socket) {
    for (let gameId in players) {
      players[gameId].splice(players[gameId].indexOf(socket), 1);
    }
  }
}
module.exports = disconnectEvents;
