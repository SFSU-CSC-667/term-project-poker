const gameEvents = (io, socket, game, players, db) => {
  const Deck = require('../poker/Deck');
  const PokerHands = require('../poker/PokerHands');
  const GameDB = require('../db/models/GameDB');
  const gameDB = new GameDB(db);

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
    if (players[socket.gameId].indexOf(socket) > -1) {
      return;
    }
    if (!game[socket.gameId]) {
      game[socket.gameId] = {
        deck: new Deck(), ready: 0,
        seatsOccupied: [], currentPot: 0,
        currentCallMinimum: 100, turn: 0, round: 0,
        gameStarted: false, blindIncrement: -1,
        pokerHands: new PokerHands()
      };
    }
    acceptRequest(socket, data);
  });

  socket.on('buyin request', () => {
    gameDB.gameInfo({ gameId: socket.gameId })
    .then(gameData => {
      gameDB.playerInfo({ userName: socket.userName })
      .then(playerData => {
        socket.emit('joining game', {
          buyInMin: gameData['minchips'],
          buyInMax: playerData['chips']
        });
      })
      .catch( result => {
        socket.emit('joining game', {
          buyInMin: gameData['minchips'],
          buyInMax: gameData['minchips']
        });
      });
    })
    .catch(error => {
      console.log("An error occured while getting game info. ", error.message);
    });
  });

  socket.on('player ready', data => {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    Game.ready++;
    socket.broadcast.to(socket.gameId).emit('player is ready', { seat: socket.seat });
    if (Players.length > 1 && Game.ready === Players.length && !Game.gameStarted) {
      Game.ready = 0;
      startGame(socket);
    }
  });

  socket.on('validate player win', data => {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    let count = 0;
    let winner;
    Players.forEach(player => {
      if (!player.fold || player.isPlaying) {
        count++;
        winner = player;
      }
    });
    if (count === 1) {
      Game.winner = winner.seat;
      playerWins(socket, 1);
      wipeTable(socket);
      Players.forEach(player => {
        player.emit('unready player', { seat: player.seat });
      });
    }
  });

  socket.on('game list request', () => {
    gameDB.allGamesInfo()
    .then(response => {
      socket.emit('game list response', { games: response });
    });
  });

  socket.on('update server seatsOccupied', data => {
    if (game[socket.gameId]) {
      let Game = game[socket.gameId];
      Game.seatsOccupied = data.seatsOccupied;
    }
  });

  socket.on('skip turn', data => {
    let Game = game[socket.gameId];
    if (Game) {
      if (Game.seatsOccupied[Game.turn] === data.seat) {
        nextTurn(socket);
      }
    }
  });

  socket.on('action button', data => {
    switch(data.action) {
      case 'check':
        nextTurn(socket);
        break;
      case 'call':
        playerCall(socket);
        break;
      case 'raise':
        playerRaise(socket, data.raise);
        break;
      case 'fold':
        playerFold(socket);
        break;
      case 'all in':
        playerAllIn(socket);
        break;
    }
  });

  function nextTurn(socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    if (checkIfAllFold(socket)) {
      playerWins(socket);
      wipeTable(socket);
      return;
    }
    if (Players[Game.turn + 1] && Players[Game.turn + 1].fold) {
      Game.turn++;
      nextTurn(socket);
    } else if (Players[Game.turn + 1]) {
      Game.turn++;
      io.to(socket.gameId).emit('turn flag', { seat: Game.seatsOccupied[Game.turn] });
      Players[Game.turn].emit('player turn', { turn: Game.turn, callMinimum: Game.currentCallMinimum });
    } else {
      if (dealerCheck(Game.round, socket)) { return; }
      Game.turn = 0;
      if (Players[Game.turn].fold) { nextTurn(socket); return; }
      io.to(socket.gameId).emit('turn flag', { seat: Game.seatsOccupied[Game.turn] });
      Players[Game.turn].emit('player turn', { turn: Game.turn, callMinimum: Game.currentCallMinimum });
    }
  }

  function playerCall(socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    updatePlayerBid(socket, Game.currentCallMinimum - socket.bid);
    nextTurn(socket);
  }

  function playerFold(socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    socket.fold = 1;
    io.to(socket.gameId).emit('a player folds', { seat: socket.seat });
    if (!checkIfAllFold(socket)) {
      nextTurn(socket);
      return;
    }
    playerWins(socket);
    setTimeout(() => {
      startGame(socket);
    }, 7000);
  }

  function playerRaise(socket, raise) {
    let Game = game[socket.gameId];
    let callAmount = (Game.currentCallMinimum - socket.bid);
    updatePlayerBid(socket, callAmount + raise);
    Game.currentCallMinimum += raise;
    reorderTurns(socket, Game.turn);
    nextTurn(socket);
  }

  function playerAllIn(socket) {
    let Game = game[socket.gameId];
    let callAmount = (Game.currentCallMinimum - socket.bid);
    let allIn = socket.pot - callAmount;
    Game.currentCallMinimum += allIn;
    updatePlayerBid(socket, callAmount + allIn);
    reorderTurns(socket, Game.turn);
    nextTurn(socket);
  }

  function playerWins(socket, isLastPlayer) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    let index = getSeatIndex(socket, Game.winner);
    let winner = Players[index];
    setAllPlayersStatus(socket, 'isPlaying', 0);
    if (winner.bid < Game.currentCallMinimum && !isLastPlayer) {
      determineSidePots(socket, winner);
      return;
    }
    winner.pot += Game.winnerPot;
    showAllCards(socket);
    Game.winnerPot = 0;
    Players.forEach(player => {
      if (winner.userName && player.userName) {
        if (player.userName === winner.userName) {
          let netGain = player.bid + player.pot - player.startAmount;
          gameDB.updateUserScore({
              amount: netGain,
              userName: player.userName
          });
        }
      }
      player.startAmount = player.pot; // New Start Amount.
    });
    io.to(socket.gameId).emit('update player statistics', {
      seat: Game.winner,
      playerBid: 0,
      playerPot: winner.pot,
    });
    Game.winner = undefined;
  }

  function determineSidePots(socket, winner) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    let playerCards = [];
    let winners = [];
    winners.push(winner);
    Players.forEach(player => {
      if (player.fold || player === winner) { return; }
      let seatId = player.seat;
      let cards = player.cards;
      let playerDetails = [seatId, cards];
      playerCards.push(playerDetails);
    });
    let mainPot = winner.bid * (playerCards.length + 1);
    winner.pot += mainPot;
    Game.winnerPot -= mainPot;
    if (playerCards.length > 2) {
      let winnerSeats = Game.pokerHands.processHands(Game.cards, playerCards);
      let lowestBid = Game.currentCallMinimum;
      let lowestBidder;
      let sidePot1;
      winnerSeats.forEach(seat => {
        let player = Players[getSeatIndex(socket, seat)];
        if (lowestBid > player.bid) {
          lowestBid = player.bid;
          lowestBidder = player;
        }
        winners.push(player);
      });
      if (lowestBidder < Game.currentCallMinimum) {
        sidePot1 = lowestBidder.bid * winnerSeats.length;
        if (sidePot1 > Game.winnerPot) { sidePot1 = Game.winnerPot; }
        winnerSeats.forEach(seat => {
          Players[getSeatIndex(socket, seat)].pot += sidePot1 / winnerSeats.length;
        });
        Game.winningPot -= sidePot1;
        playerCards.splice([lowestBidder.seat, lowestBidder.cards], 1);
        if (Game.winningPot) {
          if (playerCards.length > 2) {
            winnerSeats = Game.pokerHands.processHands(Game.cards, playerCards);
            let sidePot2;
            lowestBid = Game.currentCallMinimum;
            winnerSeats.forEach(seat => {
              let player = Players[getSeatIndex(socket, seat)];
              if (lowestBid > player.bid) {
                lowestBid = player.bid;
                lowestBidder = player;
              }
              if (winners.indexOf(player) > -1) {
                winners.push(player);
              }
            });
            if (lowestBidder < Game.currentCallMinimum) {
              sidePot2 = lowestBidder.bid * winnerSeats.length;
              if (sidePot2 > Game.winnerPot) { sidePot2 = Game.winnerPot; }
              winnerSeats.forEach(seat => {
                Players[getSeatIndex(socket, seat)].pot += sidePot2 / winnerSeats.length;
              });
              Game.winningPot -= sidePot2;
              playerCards.splice([lowestBidder.seat, lowestBidder.cards], 1);
              if (Game.winningPot) {
                if (playerCards.length > 2) {
                  winnerSeats = Game.pokerHands.processHands(Game.cards, playerCards);
                  let sidePot3;
                  lowestBid = Game.currentCallMinimum;
                  winnerSeats.forEach(seat => {
                    let player = Players[getSeatIndex(socket, seat)];
                    if (lowestBid > player.bid) {
                      lowestBid = player.bid;
                      lowestBidder = player;
                    }
                    if (winners.indexOf(player) > -1) {
                      winners.push(player);
                    }
                  });
                  if (lowestBidder < Game.currentCallMinimum) {
                    sidePot3 = lowestBidder.bid * winnerSeats.length;
                    if (sidePot3 > Game.winnerPot) { sidePot3 = Game.winnerPot; }
                    winnerSeats.forEach(seat => {
                      Players[getSeatIndex(socket, seat)].pot += sidePot3 / winnerSeats.length;
                    });
                    Game.winningPot -= sidePot3;
                    playerCards.splice([lowestBidder.seat, lowestBidder.cards], 1);
                  } else {
                    winnerSeats.forEach(seat => {
                      Players[getSeatIndex(socket, seat)].pot += (Game.winnerPot / winnerSeats.length);
                    });
                  }
                  if (Game.winnerPot) {
                    let player = Players[getSeatIndex(socket, playerCards[0][0])];
                    player.pot += Game.winnerPot;
                    if (winners.indexOf(player) > -1) {
                      winners.push(player);
                    }
                  }
                } else {
                  let player = Players[getSeatIndex(socket, playerCards[0][0])];
                  player.pot += Game.winnerPot;
                  if (winners.indexOf(player) > -1) {
                    winners.push(player);
                  }
                }
              }
            } else {
              winnerSeats.forEach(seat => {
                Players[getSeatIndex(socket, seat)].pot += (Game.winnerPot / winnerSeats.length);
              });
            }
          } else {
            let player = Players[getSeatIndex(socket, playerCards[0][0])];
            player.pot += Game.winnerPot;
            if (winners.indexOf(player.seat) > -1) {
              winners.push(player);
            }
          }
        }
      } else {
        winnerSeats.forEach(seat => {
          Players[getSeatIndex(socket, seat)].pot += (Game.winnerPot / winnerSeats.length);
        });
      }
    } else {
      let player = Players[getSeatIndex(socket, playerCards[0][0])];
      player.pot += Game.winnerPot;
      winners.push(player);
    }
    if (winner.userName) {
      gameDB.updateUserWinCounts({ userName: winner.userName });
    }
    Game.winnerPot = 0;
    winners.forEach(winner => {
      Players.forEach(player => {
        if (winner.userName && player.userName) {
          if (player.userName === winner.userName) {
            let netGain = player.bid + player.pot - player.startAmount;
            gameDB.updateUserChips({
                amount: netGain,
                userName: player.userName
            });
          }
        }
        player.startAmount = player.pot; // New Start Amount.
      });
      io.to(socket.gameId).emit('update player statistics', {
        seat: winner.seat,
        playerBid: 0,
        playerPot: winner.pot,
      });
    });
  }

  function getSeatIndex(socket, seat) {
    let Game = game[socket.gameId];
    return Game.seatsOccupied.indexOf(seat);
  }

  function reorderTurns(socket, currentTurn) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    let newOccupiedOrder = [];
    let newPlayerOrder = [];
    let restarted = 0;
    for (let i = 0; i < Game.seatsOccupied.length; i++) {
      if (Game.seatsOccupied[currentTurn + i] && !restarted) {
        newOccupiedOrder.push(Game.seatsOccupied[currentTurn + i]);
        newPlayerOrder.push(Players[currentTurn + i]);
      } else {
        currentTurn = 0;
        newOccupiedOrder.push(Game.seatsOccupied[currentTurn + restarted]);
        newPlayerOrder.push(Players[currentTurn + restarted]);
        restarted++;
      }
    }
    Game.turn = 0;
    game[socket.gameId].seatsOccupied = newOccupiedOrder;
    players[socket.gameId] = newPlayerOrder;
    io.to(socket.gameId).emit('updated seatsOccupied', {
      seatsOccupied: newOccupiedOrder
    });
  }

  function checkIfAllFold(socket) {
    let gameId = socket.gameId;
    let Game = game[gameId];
    let Players = players[gameId];
    let possibleWinner;
    let count = 0;
    Players.forEach(player => {
      if (!player.fold && player.isPlaying) {
        possibleWinner = player.seat;
        count++;
      }
    });
    if (count === 1) {
      socket.fold = 0;
      Game.winner = possibleWinner;
      return true;
    }
    return false;
  }

  function getUpdate(socket, data) {
    gameDB.gameInfo({ gameId: socket.gameId })
    .then(response => {
      if (!game[socket.gameId] || !players[socket.gameId]) {
        socket.emit('game update', { gameName: response.gamename });
        return;
      }
      let Game = game[socket.gameId];
      let Players = players[socket.gameId];
      let displayNames = {};
      Game.seatsOccupied.forEach((seat, index) => {
        displayNames[seat] = Players[index].displayName;
      });
      socket.emit('game update', {
        gameName: response.gamename,
        displayNames: displayNames,
        cards: Game.cards,
        seatsOccupied: Game.seatsOccupied,
        gameStarted: Game.gameStarted
      });
    });
  }

  function acceptRequest(socket, data) {
    let gameId = socket.gameId;
    let Game = game[gameId];
    let Players = players[gameId];
    if (Game.seatsOccupied.indexOf(data.seat) > -1) {
      socket.emit('seat already occupied');
      return;
    }
    if (!socket.displayName) {
      io.guestCount++;
      socket.displayName = 'Guest ' + io.guestCount;
    }
    if (Game.gameStarted) { socket.fold = 1; }
    makeSeatOccupied(socket, data.seat);
    socket.isPlayer = 1;
    socket.seat = data.seat;
    socket.bid = 0;
    socket.startAmount = data.startAmount;
    socket.pot = data.startAmount;
    io.to(gameId).emit('new player', {
      seat: data.seat,
      bid: socket.bid,
      pot: socket.pot,
      seatsOccupied: Game.seatsOccupied,
      html: "<p class='display-name'>" + socket.displayName + "</p>",
    });
    socket.emit('player joined', {
      seat: data.seat,
      gameStarted: Game.gameStarted
    });
    if (!socket.userName) {
      gameDB.playerInfo({ userName: socket.userName })
      .then(playerInfo => {
          gameDB.addPlayer({
              gameId: socket.gameId,
              playerId: playerInfo["userid"],
              startAmount: data.startAmount,
              seat: data.seat
          });
      }).catch(error => {});
    }
    socket.emit('enable ready button', {
      seat: socket.seat
    });
    console.log("Players: " + Players.length);
  }

  function makeSeatOccupied(socket, seat) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    Game.seatsOccupied.push(seat);
    Players.push(socket);
  }

  function sortSeats(socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    let tempPlayers = [];
    Game.seatsOccupied.sort();
    for (let i = 0; i < Game.seatsOccupied.length; i++) {
      Players.forEach(player => {
        if (player.seat === Game.seatsOccupied[i]) {
          tempPlayers.push(player);
        }
      });
    }
    players[socket.gameId] = tempPlayers;
    io.to(socket.gameId).emit('updated seatsOccupied', { seatsOccupied: Game.seatsOccupied });
  }

  function startGame(socket) {
    if (!game[socket.gameId] || !players[socket.gameId]) { return; }
    sortSeats(socket);
    incrementBlinds(socket);
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    io.to(socket.gameId).emit('remove all cards');
    Players.forEach(player => {
      player.isPlaying = 1;
      player.fold = 0;
      player.bid = 0;
      io.to(socket.gameId).emit('update player statistics', {
        seat: player.seat,
        playerBid: player.bid,
        playerPot: player.pot,
      });
    });
    Game.gameStarted = 1;
    Game.turn = 0;
    Game.round = 0;
    Game.winnerPot = 0;
    Game.deck.shuffle();
    if (!smallBigBlinds(socket)) { return; }
    reorderTurns(socket, Game.turn);
    drawPlayerCards(socket);
    nextTurn(socket);
  }

  function dealerCheck(round, socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    switch (round) {
      case 0:
        drawFlopCards(socket);
        Game.round++;
        break;
      case 1:
        drawTurnCard(socket);
        Game.round++;
        break;
      case 2:
        drawRiverCard(socket);
        Game.round++;
        break;
      case 3:
        determineWinner(socket);
        setTimeout(() => {
          if (players[socket.gameId].length < 2) { wipeTable(socket); return 1; }
          startGame(socket);
        }, 7000);
        return 1;
    }
  }

  function wipeTable(socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    if (!Game || !Players) { return; }
    io.to(socket.gameId).emit('remove all cards');
    io.to(socket.gameId).emit('reset timer');
    socket.emit('unready player');
    Game.ready = 0;
    Players.forEach(player => {
      player.fold = 0;
      player.bid = 0;
      io.to(socket.gameId).emit('update player statistics', {
        seat: player.seat,
        playerBid: player.bid,
        playerPot: player.pot,
      });
    });
    Game.gameStarted = 0;
  }

  function determineWinner(socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    let playerCards = [];
    let winners = [];
    Players.forEach(player => {
      if (player.fold) { return; }
      let seatId = player.seat;
      let cards = player.cards;
      let playerDetails = [seatId, cards];
      playerCards.push(playerDetails);
    });
    winners = Game.pokerHands.processHands(Game.cards, playerCards);
    if (winners.length === 1) {
      Game.winner = winners[0];
      playerWins(socket);
      return;
    }
    multipleWinners(socket, winners);
  }

  function multipleWinners(socket, winners) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    Game.winners = winners;
    setAllPlayersStatus(socket, 'isPlaying', 0);
    winners.forEach(winner => {
      let winningSocket = Players[getSeatIndex(socket, winner)];
      winningSocket.pot += winningSocket.bid;
      Game.winnerPot -= winningSocket.bid;
    });
    let splitPot = Game.winnerPot / winners.length;
    showAllCards(socket);
    Game.winnerPot = 0;
    winners.forEach(winner => {
      let winningSocket = Players[getSeatIndex(socket, winner)];
      winningSocket.pot += splitPot;
      Players.forEach(player => {
        if (winningSocket.userName && player.userName) {
          if (player.userName === winningSocket.userName) {
            let netGain = player.bid + player.pot - player.startAmount;
            gameDB.updateUserScore({
                amount: netGain,
                userName: player.userName
            });
          }
        }
        player.startAmount = player.pot; // New Start Amount.
      });
      io.to(socket.gameId).emit('update player statistics', {
        seat: winner,
        playerBid: 0,
        playerPot: winningSocket.pot,
      });
    });
    Game.winners = undefined;
  }

  function incrementBlinds(socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    if (Players[Game.blindIncrement + 1]) {
      Game.blindIncrement++;
      reorderTurns(Players[Game.blindIncrement], Game.blindIncrement);
    } else {
      Game.blindIncrement = 0;
      reorderTurns(Players[Game.blindIncrement], Game.blindIncrement);
    }
  }

  function smallBigBlinds(socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    if (!validateBlinds(socket, 50)) { startGame(socket); return 0; }
    updatePlayerBid(Players[Game.turn], 50);
    if (Players[Game.turn + 1]) {
      Game.turn++;
      if (!validateBlinds(socket, 100)) {
        updatePlayerBid(Players[Game.turn - 1], -50);
        startGame(socket);
        return 0;
      }
      updatePlayerBid(Players[Game.turn], 100);
    } else {
      Game.turn = 0;
      if (!validateBlinds(socket, 100)) {
        updatePlayerBid(Players[Players.length - 1], -50);
        startGame(socket);
        return 0;
      }
      updatePlayerBid(Players[Game.turn], 100);
    }
    Game.currentCallMinimum = 100;
    return 1;
  }

  function validateBlinds(socket, amount) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    let seat = Game.seatsOccupied[Game.turn];
    if ((Players[Game.turn].pot - amount) < 0) {
      Players.splice(Players.indexOf(Players[Game.turn]), 1);
      Game.seatsOccupied.splice(Game.seatsOccupied.indexOf(Game.seatsOccupied[Game.turn]), 1);
      io.to(socket.gameId).emit('unoccupy seat', { seat: seat, seatsOccupied: Game.seatsOccupied });
      return 0;
    }
    return 1;
  }

  function updatePlayerBid(socket, additionalAmount) {
    let Game = game[socket.gameId];
    socket.pot -= additionalAmount;
    socket.bid += additionalAmount;
    Game.winnerPot += additionalAmount;
    io.to(socket.gameId).emit('update player statistics', {
      seat: socket.seat,
      playerPot: socket.pot,
      playerBid: socket.bid
    });
    if (socket.userName) {
      gameDB.updateUserChips({
          amount: additionalAmount,
          userName: socket.userName
      });
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
    players[socket.gameId].forEach(player => {
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

  function setAllPlayersStatus(socket, type, status) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    Players.forEach(player => {
      player[type] = status;
    });
  }

  function showAllCards(socket) {
    let Game = game[socket.gameId];
    let Players = players[socket.gameId];
    let playerCards = {};
    Players.forEach(player => {
      playerCards[player.seat] = { cards: player.cards };
    });
    io.to(socket.gameId).emit('show all cards', {
      winner: Game.winner,
      winners: Game.winners,
      playerCards: playerCards,
      winningHand: Game.pokerHands.getWinningHand()
    });
  }

};


module.exports = gameEvents;
