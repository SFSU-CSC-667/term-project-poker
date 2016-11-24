(() => {
  let seatsOccupied = [];
  let playerTookAction;
  let callMinimum;
  let timer;
  let timeInterval;

  $(".join").on('click', function() {
    let seat = $(this).parent().prop('id');
    socket.emit('join request', {
      seat: seat
    });
    $(`#${ seat }`).children('.ready-btn').removeClass('hidden');
  });

  $('body').on('click', ".action-btn", function(event) {
    event.preventDefault();
    playerTookAction = 1;
    let seatAction = $(this).parent().attr('id');
    let seat = seatAction.split('-')[0];
    $(`#${ seatAction }`).children().prop('disabled', true);
    $(`#${ seat }-raise`).children().prop('disabled', true);
    socket.emit('action button', { action: $(this).data('action'), raise: parseInt($('#raise-amount').html()) });
  });

  $('body').on('click', ".ready-btn", function(event) {
    event.preventDefault();
    let seat = $(this).parent().attr('id');
    $(`#${ seat }`).children('.ready-btn').attr('disabled', true);
    socket.emit('player ready');
  });

  $('body').on('change', '#slider', function(event) {
    event.preventDefault();
    $('#raise-amount').html(this.value);
  });

  socket.emit('game viewer', { gameId: sessionStorage.getItem('gameId') });

  socket.on('player is ready', data => {
    $(`#${ data.seat }-actions`).html('<button data-status="status" class="btn btn-success" disabled="disabled">I\'m Ready</button>');
  });

  socket.on('turn flag', data => {
    seatsOccupied.forEach(seat => {
      if (seat === data.seat) {
        $(`#${ seat }-actions`).children('button[data-status="status"]').html('My Turn');
      } else {
        $(`#${ seat }-actions`).children('button[data-status="status"]').html("I'm Waiting");
      }
    });
  });

  socket.on('new player', data => {
    $(`#${ data.seat }-bid`).html('playerBid: ' + data.bid);
    $(`#${ data.seat }-pot`).html('playerPot: ' + data.pot);
    $(`#${ data.seat }`).html(data.html);
    $(`#${ data.seat }-actions`).html(createActionButtons());
    seatsOccupied = data.seatsOccupied;
  });

  socket.on('player turn', data => {
    let seat = seatsOccupied[data.turn];
    let playerBid = parseInt($(`#${ seat }-bid`).html().match(/\d+/g).join([]));
    let playerPot = parseInt($(`#${ seat }-pot`).html().match(/\d+/g).join([]));
    clearInterval(timeInterval);
    startTimer(socket, seat);
    callMinimum = data.callMinimum;
    $(`#${ seat }-actions`).children('.ready-btn').remove();
    $(`#${ seat }-actions`).children().removeClass('hidden');
    $(`#${ seat }-actions`).children().prop('disabled', false);
    $(`#${ seat }-raise`).html(createRaiseSlider(playerBid, playerPot));
    disableImpossible(seat, playerBid, playerPot);
  });

  socket.on('enable ready button', data => {
    $(`#${ data.seat }-actions`).children('.ready-btn').removeClass('hidden');
  });

  socket.on('reset game', data => {
    seatsOccupied = [];
    window.location.reload();
  });

  socket.on('game update', data => {
    seatsOccupied = data.seatsOccupied;
    if (data.gameStarted) {
      $("#dealer-cards").append(cardImages(data.cards));
      seatsOccupied.forEach(seat => {
        $(`#${ seat }`).html("<p>Name: Guest </p>");
        $(`#${ seat }-cards`).html(cardImages('face-down', 'face-down'));
      });
    } else {
      seatsOccupied.forEach(seat => {
        $(`#${ seat }-actions`).children('.ready-btn').remove();
        $(`#${ seat }`).html('<p>Name: Guest </p>');
        $(`#${ seat }-actions`).html('<button data-status="status" class="btn btn-success" disabled="disabled">Playing</button>');
      });
    }
  });

  socket.on('updated seatsOccupied', data => {
    seatsOccupied = data.seatsOccupied;
  });

  socket.on('a player folds', data => {
    $(`#${ data.seat }-actions`).children('button[data-status="status"]').html('Fold');
  });

  socket.on('update player statistics', data => {
    $(`#${ data.seat }-bid`).html('playerBid: ' + data.playerBid);
    $(`#${ data.seat }-pot`).html('playerPot: ' + data.playerPot);
  });

  socket.on('remove all cards', () => {
    $("#dealer-cards").html(cardImages('face-down'));
    seatsOccupied.forEach(seat => {
      $(`#${ seat }-cards`).html('');
    });
  });

  socket.on('show all cards', data => {
    for (let seat in data.playerCards) {
      let player = data.playerCards[seat];
      if (!seat.includes('seat'))
        continue;
      $(`#${ seat }-cards`).html(cardImages(player.cards[0], player.cards[1]));
    }
  });

  socket.on('player cards', data => {
    $(`#${ data.seat }-cards`).html(cardImages(data.first, data.second));
    seatsOccupied.forEach(seat => {
      if (seat !== data.seat) {
        $(`#${ seat }-cards`).html(cardImages('face-down', 'face-down'));
      }
    });
  });

  socket.on('draw flop cards', data => {
    $("#dealer-cards").html(cardImages('face-down', data.first, data.second, data.third));
  });

  socket.on('draw turn card', data => {
    $("#dealer-cards").append(cardImages(data.turnCard));
  });

  socket.on('draw river card', data => {
    $("#dealer-cards").append(cardImages(data.riverCard));
  });

  socket.on('player offline', data => {
    socket.emit('skip turn', { seat: data.seat });
    seatsOccupied.splice(seatsOccupied.indexOf(data.seat), 1);
    $(`#${ data.seat }-actions`).html('<button data-status="status" class="btn btn-danger" disabled="disabled">Offline</button>');
    setTimeout(() => { freeUpSeat(data.seat); }, 5000);
  });

  socket.on('insufficient blind kick', data => {
    seatsOccupied = data.seatsOccupied;
    freeUpSeat(data.seat);
  });

  function cardImages(...cardNames) {
    let cards = '';
    cardNames = cardNames.toString();
    cardNames = cardNames.split(/,|\s+/g);
    cardNames.forEach(card => {
      cards += `<img class='card-image ${ card }' />`;
    });
    return cards;
  }

  function disableImpossible(seat, playerBid, playerPot) {
    if (playerBid !== callMinimum) {
      $(`#${ seat }-actions`).children('[data-action="check"]').prop('disabled', true);
    }
    if (playerBid >= callMinimum) {
      $(`#${ seat }-actions`).children('[data-action="call"]').prop('disabled', true);
    }
    if ((playerBid + playerPot) < callMinimum) {
      $(`#${ seat }-actions`).children('[data-action="call"]').prop('disabled', true);
      $(`#${ seat }-actions`).children('[data-action="check"]').prop('disabled', true);
      $(`#${ seat }-actions`).children('[data-action="raise"]').prop('disabled', true);
    }
    // Temp disable until we get manual raising.
    if ((playerBid + playerPot) < (callMinimum + 200)) {
      $(`#${ seat }-actions`).children('[data-action="raise"]').prop('disabled', true);
    }
    if (playerPot === 0) {
      $(`#${ seat }-actions`).children('[data-action="raise"]').prop('disabled', true);
      $(`#${ seat }-actions`).children('[data-action="all in"]').prop('disabled', true);
    }
  }

  function startTimer(player, seat) {
    timer = 30;
    playerTookAction = 0;
    $('#timer').html('Timer: ' + timer);
    timeInterval = setInterval(() => {
      timer--;
      $('#timer').html('Timer: ' + timer);
      if (!timer || playerTookAction) {
        if (!timer) {
          $(`#${ seat }-actions`).children().prop('disabled', true);
          $(`#${ seat }-raise`).children().prop('disabled', true);
          player.emit('action button', { action: 'fold' });
        }
        $('#timer').html('');
        clearInterval(timeInterval);
      }
    }, 1000);
  }

  function freeUpSeat(seat) {
    console.log(seat);
    $(`#${ seat }`).html(`<button class="join btn btn-lg btn-primary">Join</button>`);
    $(`#${ seat }-bid`).html('');
    $(`#${ seat }-pot`).html('');
    $(`#${ seat }-cards`).html('');
    $(`#${ seat }-actions`).html('');
    $(`#${ seat }-raise`).html('');
  }

  function createActionButtons() {
    return (
      "<button class='hidden ready-btn btn btn-success'>Ready</button>" +
      "<button class='hidden action-btn btn btn-success' data-action='check' disabled='disabled'>Check</button>" +
      "<button class='hidden action-btn btn btn-success' data-action='call' disabled='disabled'>Call</button>"   +
      "<button class='hidden action-btn btn btn-success' data-action='raise' disabled='disabled'>Raise</button>" +
      "<button class='hidden action-btn btn btn-success' data-action='fold' disabled='disabled'>Fold</button>"   +
      "<button class='hidden action-btn btn btn-success' data-action='all in' disabled='disabled'>All In</button>"
    );
  }

  function createRaiseSlider(playerBid, playerPot) {
    let maxRaise = playerPot + playerBid - callMinimum;
    return (
      `<input id="slider" type="range" min="50" max=${ maxRaise } step="50" value="50"/>` +
      '<p>Raise Amount: <span id="raise-amount">50</span></p>'
    );
  }

})();
