const disconnectEvents = (socket, connections, players) => {
  socket.on('disconnect', function() {
    socket.leave('lobby');
    socket.leave('game room');
    connections.splice(connections.indexOf(socket), 1);
    players.splice(players.indexOf(socket), 1);
    console.log("Connected: " + connections.length);
  });
}

module.exports = disconnectEvents;
