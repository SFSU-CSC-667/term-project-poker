(() => {
  $('#create-game').on('submit', event => {
    event.preventDefault();
    socket.emit('create game request', { gameName: `\'${ $('#game-name').val() }\'` });
  });

  $('body').on('click', '#view-game-btn', function(event) {
    event.preventDefault();
    sessionStorage.setItem('gameId', $(this).data('id'));
    window.location.replace('/gameroom');
  });

  socket.emit('game list request');

  socket.on('game list response', data => {
    if (data) {
      $('.game-list').append(createGameList(data.games));
    }
  });

  socket.on('create game response', data => {
    if (!data.success) {
      alert('Try again later');
    }
    sessionStorage.setItem('gameId', data.gameId);
    window.location.replace('/gameroom');
  });

  function createGameList(games) {
    let gameList = '';
    games.forEach(game => {
      gameList += `<p>Gameroom: ${ game.gamename } <button id='view-game-btn' ` +
      `data-id='${ game.gameid }' class="btn btn-sm btn-success">View Game</button></p>`;
    });
    return gameList;
  }
})();
