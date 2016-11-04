(() => {
  let seatsOccupied = [];

  $(".join").on('click', function() {
    socket.emit('join request', {
      gameId: 1,
      user: 'guest',
      seat: $(this).parent().prop('id') });
  });

  socket.emit('game viewer');

  socket.on('new player', data => {
    $(`#${ data.seat }`).html(data.html);
    seatsOccupied.push(data.seat);
  });

  socket.on('run game', data => {
    gameLoop(data.turn);
  });

  socket.on('player cards', data => {
    $(`#${ data.seat }-cards`).html(cardImages(data.first, data.second));
    seatsOccupied.forEach((seat) => {
      if (seat !== data.seat)
        $(`#${ seat }-cards`).html(cardImages('face-down', 'face-down'));
    });
  });

  socket.on('draw flop cards', data => {
    $("#dealer-cards").html(cardImages('face-down', data.first, data.second, data.third));
  });

  socket.on('draw turn card', data => {
    $("#dealer-cards").append(cardImages(data.turnCard));
  })

  socket.on('draw river card', data => {
    $("#dealer-cards").append(cardImages(data.riverCard));
  });

  function cardImages(...cardNames) {
    let cards = '';
    cardNames.forEach((card) => {
      cards += `<img class='card-image ${ card }' />`
    })
    return cards;
  }

  function gameLoop(turn) {
    $(`#${ seatsOccupied[turn] }-cards`).append("<button class='next-btn btn btn-success'>Next</button>");
    $(".next-btn").on('click', event => {
      event.preventDefault();
      $(`#${ seatsOccupied[turn] }-cards`).children('button').remove();
      socket.emit('next button', { gameId: 1, turn: turn });
    });
  }
})();
