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
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    io.to(socket.gameId).emit('player offline', {
      seat: socket.seat
    });
    if (game[socket.gameId]) {
      if (Game.seatsOccupied[Game.turn] === socket.seat) { skipTurn(socket); }
      Game.seatsOccupied.splice(Game.seatsOccupied.indexOf(socket.seat), 1);
      players[socket.gameId].splice(Players.indexOf(socket), 1);
      io.to(socket.gameId).emit('unoccupy seat', { seat: socket.seat, seatsOccupied: Game.seatsOccupied });
    }
    socket.leave(socket.gameId);
    socket.status = 'Offline';
    if (!Players.length) {
      delete game[socket.gameId];
      io.to(socket.gameId).emit('reset game');
    }
  }

  function skipTurn(socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    if (Players[Game.turn + 1] && Players[Game.turn + 1].fold) {
      Game.turn++;
      skipTurn(socket);
    } else if (Players[Game.turn + 1]) {
      Game.turn++;
      io.to(socket.gameId).emit('turn flag', { seat: Game.seatsOccupied[Game.turn] });
      Players[Game.turn].emit('player turn', { turn: Game.turn, callMinimum: Game.currentCallMinimum });
    } else {
      Game.turn = 0;
      if (Players[Game.turn].fold) { skipTurn(socket); return; }
      io.to(socket.gameId).emit('turn flag', { seat: Game.seatsOccupied[Game.turn] });
      Players[Game.turn].emit('player turn', { turn: Game.turn, callMinimum: Game.currentCallMinimum });
    }
  }
};
module.exports = disconnectEvents;
