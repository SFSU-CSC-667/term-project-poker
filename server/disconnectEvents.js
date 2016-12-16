const disconnectEvents = (io, socket, connections, users, game, players, db) => {
  const GameDB = require('../db/models/GameDB');
  const gameDB = new GameDB(db);

  socket.on('disconnect', function() {
    if (socket.isPlayer) { removeFromGames(socket); }
    socket.leave('lobby');
    delete connections[socket.id];
    delete users[socket.id];
    console.log("Connected: " + Object.keys(connections).length);
    if (!Object.keys(connections).length) { io.guestCount = 0; }
  });

  function setPlayerStatusOff(data) {
    gameDB.setPlayerStatus(data, 'FALSE')
    .then(() => {
      console.log("Player status has been updated successfully.");
    })
    .catch(error => {
      console.log("An error occured while updating player status.", error);
    });
}

  function removeFromGames(socket) {
    if (socket.userName) {
      gameDB.playerInfo(socket)
      .then(playerData => {
        setPlayerStatusOff({ gameId: socket.gameId, playerId: playerData['userid'] });
      })
      .catch(error => {
        console.log("An error occured while getting player info.", error);
      });
    }

    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    io.to(socket.gameId).emit('player offline', {
      seat: socket.seat
    });
    if (game[socket.gameId]) {
      if (Game.seatsOccupied[Game.turn] === socket.seat) { skipTurn(socket);  }
      Game.seatsOccupied.splice(Game.seatsOccupied.indexOf(socket.seat), 1);
      players[socket.gameId].splice(Players.indexOf(socket), 1);
      io.to(socket.gameId).emit('unoccupy seat', { seat: socket.seat, seatsOccupied: Game.seatsOccupied });
    }
    console.log("Players: " + Players.length);
    countPlayersPlaying(socket);
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

  function countPlayersPlaying(socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    let potentialWinner = [];
    let count = 0;
    Players.forEach(player => {
      if (player.isPlaying) {
        potentialWinner.push(player);
        count++;
      }
    });
    if (potentialWinner.length === 1) {
      potentialWinner[0].emit('last player win');
    }
    return count;
  }
};
module.exports = disconnectEvents;
