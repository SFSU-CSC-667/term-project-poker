const scoreboardEvents = (io, socket, db) => {
    socket.on('update scoreboard', updateScore => {
        responseScoreUpdate();
    });

    function responseScoreUpdate() {
        db.any('SELECT UserId, FirstName, LastName, Chips, Wins FROM Users WHERE UserId > 1 ORDER BY Chips DESC')
            .then(response => {
                socket.emit('score update', response);
            })
            .catch(response = (error) => {
                console.log('ERROR: ', error.message || error);
            });
    }
};

module.exports = scoreboardEvents;