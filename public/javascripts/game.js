$(document).ready(function() {
  players = [];

  $(".join").on('click', function(e) {
    e.preventDefault();
    socket.emit('join request', { user: 'guest', seat: $(this).parent().prop('id') });
  });

  socket.on('new player', data => {
    if (players.indexOf(socket))
      return;
    players.push(socket);
    $("#" + data.seat).html("<p>Name: " + data.user + " " + data.connection + "</p>");
    socket.on('game disconnect', function() {
      console.log("got here");
      players.splice(players.indexOf(socket), 1);
    })
  })
});
