let game = {};

const gameEvents = (io, socket, players, db) => {
  const Deck = require('../poker/deck.js');

  socket.on('create game request', data => {
    db.one('INSERT INTO Games (GameName, MaxPlayers, MinBid, MinChips) VALUES' +
    `('${ data.gameName }', 4, 50, 500) RETURNING GameId`)
    .then(response => {
      socket.emit('create game response', {
        success: 1,
        gameId: response.gameid,
        gameName: data.gameName
      })
     })
     .catch(response => {
       console.log(response);
       socket.emit('create game response', { success: 0 });
     })
  });

  socket.on('game viewer', data => {
    socket.leave('lobby');
    if (data.gameId) {
      socket.join(data.gameId);
      socket.gameId = data.gameId;
    } else {
      socket.join(1);
      socket.gameId = 1;
    }
  });

  socket.on('next button', data => {
    let Game = game[socket.gameId];
    if (players[Game.turn + 1]) {
      Game.turn++;
      players[socket.gameId][Game.turn].emit('run game', { turn: Game.turn });
    } else {
      dealerCheck(Game.round, socket, data);
      console.log("Round over")
      Game.round++;
      Game.turn = 0;
      players[socket.gameId][Game.turn].emit('run game', { turn: Game.turn });
    }
  });

  socket.on('join request', data => {
    let gameId = socket.gameId;
    if (!players[gameId])
      players[gameId] = [];
    if (players[gameId].indexOf(socket) > -1)
      return;
    if (!game[gameId])
      game[gameId] = { deck: new Deck(), turn: 0, round: 0, gameStarted: false }
    acceptRequest(socket, data);
  });

  function acceptRequest(socket, data) {
    let gameId = socket.gameId;
    let Game = game[gameId];
    let Players = players[gameId];
    Players.push(socket);
    socket.isPlayer = 1;
    socket.seat = data.seat;
    io.to(gameId).emit('new player', {
      seat: data.seat,
      html: "<p>Name: " + data.user + " " + Players.indexOf(socket) + "</p>"
    });
    console.log("Players " + Players.length);
    if (Players.length > 1 && !Game.gameStarted) {
      startGame(socket, data);
    }
  }

  function startGame(socket, data) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    Game.deck.shuffle();
    drawPlayerCards(socket, data);
    drawFlopCards(socket, data);
    Players[Game.turn].emit('run game', { turn: Game.turn });
  }

  function dealerCheck(round, socket, data) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    switch (round) {
      case 0:
        if (!Game.turnCardDelt && data.turn === Players.length - 1) {
          drawTurnCard(socket, data);
          Game.turnCardDelt = 1;
        }
        break;
      case 1:
        if (!Game.riverCardDelt && data.turn === Players.length - 1) {
          drawRiverCard(socket, data);
          Game.riverCardDelt = 1;
        }
        break;
      case 2:
        showAllCards(socket, data)
        startGame(socket, data);
        return 1;
    }
  }

  function drawFlopCards(socket, data) {
    let Game = game[socket.gameId];
    io.to(socket.gameId).emit('draw flop cards', {
      first: Game.deck.draw(),
      second: Game.deck.draw(),
      third: Game.deck.draw()
    });
  }

  function drawPlayerCards(socket, data) {
    let Game = game[socket.gameId];
    players[socket.gameId].forEach((player) => {
      player.emit('player cards', {
        seat: player['seat'],
        first: Game.deck.draw(),
        second: Game.deck.draw()
      });
    });
  }

  function drawTurnCard(socket, data) {
    io.to(socket.gameId).emit('draw turn card', {
      turnCard: game[socket.gameId].deck.draw()
    });
  }

  function drawRiverCard(socket, data) {
    io.to(socket.gameId).emit('draw river card', {
      riverCard: game[socket.gameId].deck.draw()
    });
  }

  function showAllCards(socket, data) {
    io.to(socket.gameId).emit('draw ')
  }

};


module.exports = gameEvents;
