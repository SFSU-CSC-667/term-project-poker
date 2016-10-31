$(document).ready(function() {
  let seatsOccupied = [];

  $(".join").on('click', function(e) {
    e.preventDefault();
    socket.emit('join request', { user: 'guest', seat: $(this).parent().prop('id') });
  });

  socket.on('new player', data => {
    $("#" + data.seat).html(data.html);
    seatsOccupied.push(data.seat);
  })

  socket.on('game start', data => {
    gameLoop(data.turn);
  })

  socket.on('next turn', data => {
    if (seatsOccupied[data.turn]) {
      gameLoop(data.turn);
    }
  });

  function gameLoop(turn) {
    $("#" + seatsOccupied[turn]).append("<button class='next-btn btn'>Next</button>");
    $(".next-btn").on('click', e => {
      e.preventDefault();
      $("#" + seatsOccupied[turn]).children('button').remove();
      socket.emit('next button');
    });
  }

});
