const scoreboardEvents = (io, socket, db) => {
    const ScoreboardDB = require('../db/models/ScoreboardDB');
    const sdb = new ScoreboardDB(db);

    socket.on('update scoreboard', updateScore => {
        responseScoreUpdate();
    });

    function responseScoreUpdate() {
        sdb.getScores()
            .then(response => {
                socket.emit('score update', response);
            })
            .catch(response = (error) => {
                console.log('ERROR: ', error.message || error);
            });
    }
};

module.exports = scoreboardEvents;