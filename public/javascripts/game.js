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
    $("#" + data.seat).html(data.html);
    seatsOccupied.push(data.seat);
  });

  socket.on('run game', data => {
    gameLoop(data.turn);
  });

  socket.on('get cards', data => {
    $("#" + data.seat).append(cardImages(data.first, data.second));
    seatsOccupied.forEach((seat) => {
      if (seat === data.seat)
        return;
      $("#" + seat).append(cardImages('face-down', 'face-down'));
    })
  });

  function cardImages(...cardNames) {
    let cards = '';
    cardNames.forEach((card) => {
      cards += `<img class='card-image ${ card }' />`
    })
    return cards;
  }

  function gameLoop(turn) {
    $("#" + seatsOccupied[turn]).append("<button class='next-btn btn'>Next</button>");
    $(".next-btn").on('click', event => {
      event.preventDefault();
      $("#" + seatsOccupied[turn]).children('button').remove();
      socket.emit('next button', { gameId: 1 });
    });
  }
})();
