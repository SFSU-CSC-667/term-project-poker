$(document).ready(function() {
  let seatsOccupied = [];
  let turn = 0;
  $(".join").on('click', function(e) {
    e.preventDefault();
    socket.emit('join request', { user: 'guest', seat: $(this).parent().prop('id') });
  });

  socket.on('new player', data => {
    $("#" + data.seat).html(data.html);
    seatsOccupied.push(data.seat);
  })

  socket.on('game start', data => {
    gameLoop(turn);
  })

  socket.on('next turn', data => {
    if (seatsOccupied[turn + 1]) {
      $("#" + seatsOccupied[turn]).children('button').remove();
      gameLoop(turn + 1);
    } else {
      $("#" + seatsOccupied[turn]).children('button').remove();
      turn = 0;
      gameLoop(turn);
    }
  });

  function gameLoop(turn) {
    $("#" + seatsOccupied[turn]).append("<button class='next-btn btn'>Next</button>");
    $(".next-btn").on('click', e => {
      e.preventDefault();
      socket.emit('next button');
    });
  }

});
