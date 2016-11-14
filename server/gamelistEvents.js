const gamelistEvents = (io, socket, db) => {
    socket.on('update gamelist', updateScore => {
        console.log('update gamelist');
        responseGameListUpdate();
    });

    function responseGameListUpdate() {
        db.any('SELECT GameId, GameName, MaxPlayers, MinBid, MinChips FROM Games ORDER BY GameId ASC')
            .then(response => {
                console.log('gamelist: ', response);
                socket.emit('gamelist update', response);
            })
            .catch(response = (error) => {
                console.log('ERROR: ', error.message || error)
            });
    }
}

module.exports = gamelistEvents;