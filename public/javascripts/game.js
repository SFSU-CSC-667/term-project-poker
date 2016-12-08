(() => {
  let seatsOccupied = [];
  let playerTookAction;
  let callMinimum;
  let timer;
  let timeInterval;
  let seat;
  let maxRaise;
  let buyInMin;
  let buyInMax;

  $('#buyin-slider').on('change mousemove mouseup', () => {
      $('#buyin-label').html('Amount: ' + $('#buyin-slider').val());
  });

  $("#buyin-submit").on('click', function() {
    if (!validateBuyIn()) { return; }
    socket.emit('join request', {
      startAmount: $('#buyin-slider').val(),
      seat: seat
    });
    $(`#${ seat }`).children('.ready-btn').removeClass('hidden');
  });

  $('body').on('click', ".join", function() {
    seat = $(this).parent().prop('id');
    socket.emit('buyin request');
  });

  $('body').on('click', ".action-btn", function(event) {
    event.preventDefault();
    playerTookAction = 1;
    let seatAction = $(this).parent().attr('id');
    let seat = seatAction.split('-')[0];
    let raise = parseInt($('#raise-amount').html());
    if ($(this).data('action') === 'raise') {
      if (!validateRaise(raise)) { return; }
    }
    $(`#${ seatAction }`).children().prop('disabled', true);
    $(`#${ seat }-raise`).children().prop('disabled', true);
    socket.emit('action button', { action: $(this).data('action'), raise: raise });
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

  $(document).on('keydown', 'body', event => {
    switch (event.which) {
      case 49:
        if (!verifyButtonEnabled('check')) { return; }
        $('.action-btn[data-action="check"]').addClass('scale-up');
        $('.action-btn[data-action="check"]').trigger('click');
        setTimeout(() => {
          $('.action-btn[data-action="check"]').removeClass('scale-up');
        }, 250);
        break;
      case 50:
        if (!verifyButtonEnabled('call')) { return; }
        $('.action-btn[data-action="call"]').addClass('scale-up');
        $('.action-btn[data-action="call"]').trigger('click');
        setTimeout(() => {
          $('.action-btn[data-action="call"]').removeClass('scale-up');
        }, 250);
        break;
      case 51:
        if (!verifyButtonEnabled('raise')) { return; }
        $('.action-btn[data-action="raise"]').addClass('scale-up');
        $('.action-btn[data-action="raise"]').trigger('click');
        setTimeout(() => {
          $('.action-btn[data-action="raise"]').removeClass('scale-up');
        }, 250);
        break;
      case 52:
        if (!verifyButtonEnabled('all in')) { return; }
        $('.action-btn[data-action="all in"]').addClass('scale-up');
        $('.action-btn[data-action="all in"]').trigger('click');
        setTimeout(() => {
          $('.action-btn[data-action="all in"]').removeClass('scale-up');
        }, 250);
        break;
      case 53:
        if (!verifyButtonEnabled('fold')) { return; }
        $('.action-btn[data-action="fold"]').addClass('scale-up');
        $('.action-btn[data-action="fold"]').trigger('click');
        setTimeout(() => {
          $('.action-btn[data-action="fold"]').removeClass('scale-up');
        }, 250);
        break;
    }

  });

  socket.on('joining game', data => {
    buyInMin = data.buyInMin;
    buyInMax = data.buyInMax;
    $('#buyin-slider').attr({
      min: buyInMin,
      max: buyInMax,
      value: buyInMin
    });
    if (buyInMin !== buyInMax) {
      $("#buyin-modal").modal('show');
    } else {
      $("#buyin-submit").trigger("click");
    }
    $('#buyin-label').html('Amount: ' + buyInMin);
  });

  socket.on('seat already occupied', data => {
    alert('This seat is already occupied!');
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
    $(`#${ data.seat }-bid`).html('Bid: ' + data.bid);
    $(`#${ data.seat }-pot`).html('Pot: ' + data.pot);
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
    $(`#slider`).focus();
    disableImpossible(seat, playerBid, playerPot);
  });

  socket.on('enable ready button', data => {
    $(`#${ data.seat }-actions`).children('.ready-btn').removeClass('hidden');
  });

  socket.on('reset timer', data => {
    $(`#timer`).addClass('hidden');
    $('#timer').html('');
    clearInterval(timeInterval);
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
        $(`#${ seat }`).html(`<p class='display-name'>Name: ${ data.displayNames[seat] } </p>`);
        $(`#${ seat }-cards`).html(cardImages('face-down', 'face-down'));
      });
    } else {
      seatsOccupied.forEach(seat => {
        $(`#${ seat }-actions`).children('.ready-btn').remove();
        $(`#${ seat }`).html(`<p class='display-name'>Name: ${ data.displayNames[seat] } </p>`);
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
    $(`#${ data.seat }-bid`).html('Bid: ' + data.playerBid);
    $(`#${ data.seat }-pot`).html('Pot: ' + data.playerPot);
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
    if (data.winner) {
      console.log('winner');
      $('#winning-cards').html(cardImages(data.winningHand));
      $(`.${ data.playerCards[data.winner].cards[0] }`).addClass('highlight-card');
      $(`.${ data.playerCards[data.winner].cards[1] }`).addClass('highlight-card');
      $('#previous-cards').removeClass('hidden');
    }
    if (data.winners) {
      $('#winning-cards').html(cardImages(data.winningHand));
      data.winners.forEach(winner => {
        $(`.${ data.playerCards[winner].cards[0] }`).addClass('highlight-card');
        $(`.${ data.playerCards[winner].cards[1] }`).addClass('highlight-card');
        $('#previous-cards').removeClass('hidden');
      });
    }
  });

  socket.on('player cards', data => {
    $(`#${ data.seat }-cards`).html(cardImages(data.first));
    setTimeout(() => { $(`#${ data.seat }-cards`).append(cardImages(data.second)); }, 200);
    seatsOccupied.forEach(seat => {
      if (seat !== data.seat) {
        $(`#${ seat }-cards`).html(cardImages('face-down', 'face-down'));
      }
    });
  });

  socket.on('draw flop cards', data => {
    $("#dealer-cards").html(cardImages(data.first, data.second, data.third));
  });

  socket.on('draw turn card', data => {
    $("#dealer-cards").append(cardImages(data.turnCard));
  });

  socket.on('draw river card', data => {
    $("#dealer-cards").append(cardImages(data.riverCard));
  });

  socket.on('player offline', data => {
    $(`#${ data.seat }-actions`).html('<button data-status="status" class="btn btn-danger" disabled="disabled">Offline</button>');
  });

  socket.on('unoccupy seat', data => {
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
    if (playerBid > callMinimum) {
      $(`#${ seat }-actions`).children('[data-action="call"]').prop('disabled', true);
      $(`#${ seat }-actions`).children('[data-action="raise"]').prop('disabled', true);
    }
    if ((playerBid + playerPot) < (callMinimum + 50)) {
      $(`#${ seat }-actions`).children('[data-action="raise"]').prop('disabled', true);
    }
    if (playerPot === 0) {
      $(`#${ seat }-actions`).children('[data-action="raise"]').prop('disabled', true);
      $(`#${ seat }-actions`).children('[data-action="all in"]').prop('disabled', true);
      $(`#${ seat }-actions`).children('[data-action="check"]').prop('disabled', false);
    }
  }

  function startTimer(player, seat) {
    timer = 30;
    playerTookAction = 0;
    $('#timer').html('Timer: ' + timer);
    $(`#timer`).removeClass('hidden');
    timeInterval = setInterval(() => {
      timer--;
      $('#timer').html('Timer: ' + timer);
      if (!timer || playerTookAction) {
        if (!timer) {
          if (verifyButtonEnabled('check')) {
            player.emit('action button', { action: 'check' });
          } else {
            player.emit('action button', { action: 'fold' });
          }
          $(`#${ seat }-actions`).children().prop('disabled', true);
          $(`#${ seat }-raise`).children().prop('disabled', true);
        }
        $(`#timer`).addClass('hidden');
        $('#timer').html('');
        clearInterval(timeInterval);
      }
    }, 1000);
  }

  function freeUpSeat(seat) {
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
      "<button class='hidden action-btn btn btn-primary' data-action='raise' disabled='disabled'>Raise</button>" +
      "<button class='hidden action-btn btn btn-success' data-action='all in' disabled='disabled'>All In</button>" +
      "<button class='hidden action-btn btn btn-danger' data-action='fold' disabled='disabled'>Fold</button>"
    );
  }

  function createRaiseSlider(playerBid, playerPot) {
    maxRaise = playerPot + playerBid - callMinimum;
    return (
      '<p id="raise-text">Raise Amount: <span id="raise-amount">50</span></p>' +
      `<input id="slider" type="range" min="50" max=${ maxRaise } step="50" value="50"/>`
    );
  }

  function verifyButtonEnabled(action) {
    let button = $(`.action-btn[data-action='${ action }']`);
    return button.prop('disabled') ? false : true;
  }

  function validateBuyIn() {
    if ($('#buyin-slider').val() > buyInMax || $('#buyin-slider').val() < buyInMin) {
      alert(`Minimum Buy In : ${ buyInMin }\nMaximum Buy In : ${ buyInMax }`);
      return false;
    }
    return true;
  }

  function validateRaise(raise) {
    if (raise < 50 || raise > maxRaise) {
      alert(`Minimum Raise : 50\nMaximum Raise : ${ maxRaise }`);
      return false;
    }
    return true;
  }

})();
