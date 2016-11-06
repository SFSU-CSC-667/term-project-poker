(() => {
  $('#create-game').on('submit', event => {
    event.preventDefault();
    socket.emit('create game request', { gameName: $('#game-name').val() });
  });

  socket.on('create game response', data => {
    if (!data.success) {
      alert('Try again later');
    }
    sessionStorage.setItem('gameId', data.gameId);
    window.location.replace('/gameroom');
  });
})();
