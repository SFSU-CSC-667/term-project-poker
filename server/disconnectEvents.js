const disconnectEvents = (socket, connections, users, players) => {
  socket.on('disconnect', function() {
    socket.leave('lobby');
    socket.leave('game room');
    delete connections[socket.id];
    delete users[socket.id];
    players.splice(players.indexOf(socket), 1);
    console.log("Connected: " + connections.length);
  });
}

module.exports = disconnectEvents;
