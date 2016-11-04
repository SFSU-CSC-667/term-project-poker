let game = {};

const gameEvents = (io, socket, players) => {
  const Deck = require('../poker-game/deck.js');
  socket.on('game viewer', function() {
    socket.leave('lobby');
    socket.join('game room');
  });

  socket.on('next button', (data) => {
    let Game = game[data.gameId];
    if (players[Game.turn + 1]) {
      Game.turn++;
      players[data.gameId][Game.turn].emit('run game', { turn: Game.turn });
    } else {
      checkRound(Game.round, data);
      console.log("Round over")
      Game.round++;
      Game.turn = 0;
      players[data.gameId][Game.turn].emit('run game', { turn: Game.turn });
    }
  });

  socket.on('join request', (data) => {
    if (!players[data.gameId])
      players[data.gameId] = [];
    if (players[data.gameId].indexOf(socket) > -1)
      return;
    if (!game[data.gameId])
      game[data.gameId] = { deck: new Deck(), turn: 0, round: 0, gameStarted: false }
    acceptRequest(socket, data);
  });

  function acceptRequest(socket, data) {
    players[data.gameId].push(socket);
    socket['seat'] = data.seat;
    io.to('game room').emit('new player', {
      seat: data.seat,
      html: "<p>Name: " + data.user + " " + players[data.gameId].indexOf(socket) + "</p>"
    });
    console.log("Players " + players[data.gameId].length);
    if (players[data.gameId].length > 1 && !game[data.gameId].gameStarted) {
      startGame(data);
    }
  }

  function startGame(data) {
    game[data.gameId].deck.shuffle();
    drawUserCards(data);
    drawFlopCards(data);
    players[data.gameId][game[data.gameId].turn].emit('run game', { turn: game[data.gameId].turn });
  }

  function checkRound(round, data) {
    let Game = game[data.gameId];
    switch (round) {
      case 0:
        if (!Game.turnCardDelt && data.turn === players[data.gameId].length - 1) {
          drawTurnCard(data);
          turnCardsDelt = 1;
        }
        break;
      case 1:
        if (!Game.riverCardDelt && data.turn === players[data.gameId].length - 1) {
          drawRiverCard(data);
          riverCardDelt = 1;
        }
        break;
      case 2:
        startGame(data);
        return 1;
    }
  }
  function drawFlopCards(data) {
    io.to('game room').emit('draw flop cards', {
      first: game[data.gameId].deck.draw(),
      second: game[data.gameId].deck.draw(),
      third: game[data.gameId].deck.draw()
    });
  }

  function drawUserCards(data) {
    players[data.gameId].forEach((player) => {
      player.emit('player cards', {
        seat: player['seat'],
        first: game[data.gameId].deck.draw(),
        second: game[data.gameId].deck.draw()
      });
    });
  }

  function drawTurnCard(data) {
    io.to('game room').emit('draw turn card', {
      turnCard: game[data.gameId].deck.draw()
    });
  }

  function drawRiverCard(data) {
    io.to('game room').emit('draw river card', {
      riverCard: game[data.gameId].deck.draw()
    });
  }

};


module.exports = gameEvents;
