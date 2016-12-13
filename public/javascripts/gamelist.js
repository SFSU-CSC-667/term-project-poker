(() => {

  $('body').on('click', '.view-game-btn', function(event) {
    sessionStorage.setItem('gameId', $(this).data('gameId'));
    window.location.replace('/gameroom');
  });

  socket.emit('update gamelist');

  $('#refresh-gamelist').on('click', event => {
    event.preventDefault();
    socket.emit('update gamelist');
  });

  socket.on('gamelist update', data => {
    $('.gamelist').empty();
    $('.gamelist').append('<tr><th>No.</th><th>Name</th><th>Maximum Player</th><th>Stake</th><th>Buy In</th></tr>');
    for (var key in data) {
      $('.gamelist').append('<tr><td>' + data[key]["gameid"] + '</td>' +
        '<td style="width: 60%;">' + data[key]["gamename"] + '</td>' +
        '<td style="width: 20%;">' + data[key]["maxplayers"] + '</td>' +
        '<td>' + data[key]["minbid"] + '</td>' +
        '<td style="width: 20%;">' + data[key]["minchips"] + '</td>' +
        '<td><button class="btn btn-primary view-game-btn" data-game-id = "' + data[key]["gameid"] + '">View</button></td></tr>');
    }
  });

})();
