const disconnectEvents = (io, socket, connections, users, game, players, db) => {
  socket.on('disconnect', function() {
    if (socket.isPlayer) { removeFromGames(socket); }
    socket.leave('lobby');
    delete connections[socket.id];
    delete users[socket.id];
    console.log("Connected: " + Object.keys(connections).length);
    if (!Object.keys(connections).length) { io.guestCount = 0; }
  });

  function setPlayerStatus(data) {
    GameQuery = "UPDATE Players SET IsPlaying=FALSE WHERE GameId=${ gameId } AND UserId=${ playerId };";
    db.none(GameQuery, {
      gameId: data.gameId,
        playerId: data.playerId
    })
        .then(() => {
            console.log("Player status has been updated successfully.");
        })
        .catch(error => {
            console.log("An error occured while updating player status.");
        });
  }

  function getPlayerInfo(socket) {
    let GameQuery = "SELECT * FROM Users WHERE Email=${ UserName };";
    return db.one(GameQuery, {
      UserName: socket.userName
    });
  }

  function removeFromGames(socket) {
    if (socket.userName) {
      getPlayerInfo(socket)
      .then(playerData => {
        setPlayerStatus({
          gameId: socket.gameId,
            playerId: playerData['userid']
        });
      })
      .catch(error => {
        console.log("An error occured while getting player info.");
      });
    }
    Players = players[socket.gameId];
    io.to(socket.gameId).emit('player offline', {
      seat: socket.seat
    });
    Players.splice(Players.indexOf(socket), 1);
    if (Players.length < 2) {
      delete game[socket.gameId];
      io.to(socket.gameId).emit('reset game');
    }
    socket.leave(socket.gameId);
    socket.status = 'Offline';
  }
};
module.exports = disconnectEvents;
