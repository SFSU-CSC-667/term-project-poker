(() => {
  let seatsOccupied = [];

  $(".join").on('click', function() {
    let seat = $(this).parent().prop('id');
    socket.emit('join request', {
      seat: seat
    });
    $(`#${ seat }`).children('.ready-btn').removeClass('hidden');
  });

  $('body').on('click', ".action-btn", function(event) {
    event.preventDefault();
    let seat = $(this).parent().attr('id');
    $(`#${ seat }`).children().prop('disabled', true);
    socket.emit('action button', { action: $(this).data('action'), seat: seat });
  });

  $('body').on('click', ".ready-btn", function(event) {
    event.preventDefault();
    let seat = $(this).parent().attr('id');
    $(`#${ seat }`).children('.ready-btn').attr('disabled', true);
    socket.emit('player ready');
  });

  socket.on('player offline', data => {
    seatsOccupied.splice(seatsOccupied.indexOf(data.seat), 1);
    $(`#${ data.seat }-actions`).html('<button id="status" class="btn btn-danger" disabled="disabled">Offline</button>');
  });

  socket.emit('game viewer', { gameId: sessionStorage.getItem('gameId') });

  socket.on('new player', data => {
    $(`#${ data.seat }`).html(data.html);
    $(`#${ data.seat }-actions`).html(createActionButtons());
    seatsOccupied = data.seatsOccupied;
  });

  socket.on('player turn', data => {
    $(`#${ seatsOccupied[data.turn] }-actions`).children('.ready-btn').remove();
    $(`#${ seatsOccupied[data.turn] }-actions`).children().removeClass('hidden');
    $(`#${ seatsOccupied[data.turn] }-actions`).children().prop('disabled', false);
  });

  socket.on('enable ready button', data => {
    $(`#${ data.seat }-actions`).children('.ready-btn').removeClass('hidden');
  });

  socket.on('reset game', data => {
    seatsOccupied = [];
    window.location.reload();
  });

  socket.on('player cards', data => {
    $(`#${ data.seat }-cards`).replaceWith(cardImages(data.first, data.second));
    seatsOccupied.forEach(seat => {
      if (seat !== data.seat) {
        $(`#${ seat }-cards`).replaceWith(cardImages('face-down', 'face-down'));
        $(`#${ seat }-actions`).html('<button id="status" class="btn btn-success" disabled="disabled">Playing</button>');
      }
    });
  });

  socket.on('show all cards', data => {
    console.log('show all');
    for (let seat in data.playerCards) {
      let player = data.playerCards[seat];
      console.log(`#${ seat }-cards ` );
      if (!seat.includes('seat'))
        continue;
      $(`#${ seat }-cards`).replaceWith(cardImages(player.cards[0], player.cards[1]));
    }
  });

  socket.on('game update', data => {
    seatsOccupied = data.seatsOccupied;
    console.log(seatsOccupied);
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
        $(`#${ seat }-actions`).html('<button id="status" class="btn btn-success" disabled="disabled">Playing</button>');
      });
    }
  });

  socket.on('a player folds', data => {
    $(`#${ data.seat }-actions`).children('#status').html('Fold');
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

  function cardImages(...cardNames) {
    let cards = '';
    cardNames = cardNames.toString();
    cardNames = cardNames.split(/,|\s+/g);
    cardNames.forEach(card => {
      cards += `<img class='card-image ${ card }' />`;
    });
    return cards;
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

})();
