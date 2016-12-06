const gamelistEvents = (io, socket, db) => {

  socket.on('create game request', data => {
    db.one('INSERT INTO Games (GameName, MaxPlayers, MinBid, MinChips) VALUES' +
    `(${ data.gameName }, 4, 50, 500) RETURNING GameId`)
    .then(response => {
      socket.emit('create game response', {
        success: 1,
        gameId: response.gameid,
        gameName: data.gameName
      });
     })
     .catch(response => {
       console.log(response);
       socket.emit('create game response', { success: 0 });
     });
  });

  socket.on('update gamelist', updateScore => {
    responseGameListUpdate();
  });

  function responseGameListUpdate() {
    db.any('SELECT GameId, GameName, MaxPlayers, MinBid, MinChips FROM Games ORDER BY GameId ASC')
    .then(response => {
      socket.emit('gamelist update', response);
    })
    .catch(response = (error) => {
      console.log('ERROR: ', error.message || error)
    });
  }
}

module.exports = gamelistEvents;
