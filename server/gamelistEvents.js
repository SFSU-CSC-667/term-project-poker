const gamelistEvents = (io, socket, db) => {
  const GameListDB = require('../db/models/GameListDB');
  const gameListDB = new GameListDB(db);

  socket.on('create game request', data => {
    if (socket.userName) {
      gameListDB.createGame(data)
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
     } else {
       socket.emit('create game response', { success: 0, guest: 1 });
     }
  });

  socket.on('update gamelist', updateScore => {
    responseGameListUpdate();
  });

  function responseGameListUpdate() {
    gameListDB.gameList()
    .then(response => {
      socket.emit('gamelist update', response);
    })
    .catch(response = (error) => {
      console.log('ERROR: ', error.message || error)
    });
  }
}

module.exports = gamelistEvents;
