const gameEvents = (io, socket, game, players, db) => {
  const Deck = require('../poker/deck.js');

  socket.on('create game request', data => {
    db.one('INSERT INTO Games (GameName, MaxPlayers, MinBid, MinChips) VALUES' +
    `('${ data.gameName }', 4, 50, 500) RETURNING GameId`)
    .then(response => {
      socket.emit('create game response', {
        success: 1,
        gameId: response.gameid,
        gameName: data.gameName
      });
     })
     .catch(response => {
       console.log(response);
       socket.emit('create game response', { success: 0 });
     });
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
    getUpdate(socket, data);
  });

  socket.on('join request', data => {
    if (!players[socket.gameId])
      players[socket.gameId] = [];
    if (players[socket.gameId].indexOf(socket) > -1)
      return;
    if (!game[socket.gameId]) {
      game[socket.gameId] = {
        deck: new Deck(), ready: 0,
        seatsOccupied: [], currentPot: 0,
        turn: 0, round: 0,
        gameStarted: false
      };
    }
    acceptRequest(socket, data);
  });

  socket.on('player ready', data => {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    Game.ready++;
    if (Players.length > 1 && Game.ready === Players.length && !Game.gameStarted) {
      Game.ready = 0;
      startGame(socket);
    }
  });

  socket.on('game list request', () => {
    db.query('SELECT * FROM games')
    .then(response => {
      socket.emit('game list response', { games: response });
    });
  });

  socket.on('action button', data => {
    switch(data.action) {
      case 'check':
        nextTurn();
        break;
      case 'call':
        playerCall();
        break;
      case 'raise':
        playerRaise();
        break;
      case 'fold':
        playerFold();
        break;
      case 'all in':
        playerAllIn();
        break;
    }
  });

  function nextTurn() {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    if (Players[Game.turn + 1]) {
      Game.turn++;
      Players[Game.turn].emit('player turn', { turn: Game.turn });
    } else {
      if (dealerCheck(Game.round, socket)) { return; }
      console.log("Round over");
      Game.turn = 0;
      Players[Game.turn].emit('player turn', { turn: Game.turn });
    }
  }

  function playerCall() {

    nextTurn();
  }

  function playerRaise() {

    nextTurn();
  }

  function playerFold() {

    nextTurn();
  }

  function playerAllIn() {

    nextTurn();
  }

  function getUpdate(socket, data) {
    if (!game[socket.gameId] || !players[socket.gameId]) {
      return;
    }
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    socket.emit('game update', {
      cards: Game.cards,
      seatsOccupied: Game.seatsOccupied,
      gameStarted: Game.gameStarted
    });
  }

  function acceptRequest(socket, data) {
    let gameId = socket.gameId;
    let Game = game[gameId];
    let Players = players[gameId];
    if (!socket.userName) { socket.userName = 'Guest'; }
    if (!Game.gameStarted) { Players.push(socket); }
    Game.seatsOccupied.push(data.seat);
    socket.isPlayer = 1;
    socket.seat = data.seat;
    io.to(gameId).emit('new player', {
      seat: data.seat,
      seatsOccupied: Game.seatsOccupied,
      html: "<p>Name: " + socket.userName + "</p>"
    });
    socket.emit('enable ready button', {
      seat: socket.seat
    });
    console.log("Players " + Players.length);
  }

  function startGame(socket) {
    console.log("new game");
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    Game.gameStarted = 1;
    Game.turn = 0;
    Game.round = 0;
    Game.deck.shuffle();
    drawPlayerCards(socket);
    drawFlopCards(socket);
    Players[Game.turn].emit('player turn', { turn: Game.turn });
  }

  function dealerCheck(round, socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    switch (round) {
      case 0:
        if (Game.turn === Players.length - 1) {
          drawTurnCard(socket);
          Game.round++;
        }
        break;
      case 1:
        if (Game.turn === Players.length - 1) {
          drawRiverCard(socket);
          Game.round++;
        }
        break;
      case 2:
        showAllCards(socket);
        setTimeout(() => { startGame(socket); }, 2000);
        return 1;
    }
  }

  function drawFlopCards(socket, data) {
    let Game = game[socket.gameId];
    Game.cards = [Game.deck.draw(), Game.deck.draw(), Game.deck.draw()];
    io.to(socket.gameId).emit('draw flop cards', {
      first: Game.cards[0],
      second: Game.cards[1],
      third: Game.cards[2]
    });
  }

  function drawPlayerCards(socket, data) {
    let Game = game[socket.gameId];
    players[socket.gameId].forEach((player) => {
      player.cards = [Game.deck.draw(), Game.deck.draw()];
      player.emit('player cards', {
        status: player.status,
        seat: player.seat,
        first: player.cards[0],
        second: player.cards[1]
      });
    });
  }

  function drawTurnCard(socket, data) {
    let Game = game[socket.gameId];
    Game.cards.push(Game.deck.draw());
    io.to(socket.gameId).emit('draw turn card', {
      turnCard: Game.cards[3]
    });
  }

  function drawRiverCard(socket, data) {
    let Game = game[socket.gameId];
    Game.cards.push(Game.deck.draw());
    io.to(socket.gameId).emit('draw river card', {
      riverCard: Game.cards[4]
    });
  }

  function showAllCards(socket) {
    let Players = players[socket.gameId];
    let playerCards = {};
    Players.forEach(player => {
      playerCards[player.seat] = { cards: player.cards };
    });
    io.to(socket.gameId).emit('show all cards', { playerCards: playerCards });
  }

};


module.exports = gameEvents;
