const scoreboardEvents = (io, socket, db) => {
    const ScoreboardDB = require('../db/models/ScoreboardDB');
    const scoreboardDB = new ScoreboardDB(db);

    socket.on('update scoreboard', updateScore => {
        responseScoreUpdate();
    });

    function responseScoreUpdate() {
        scoreboardDB.getScores()
            .then(response => {
                socket.emit('score update', response);
            })
            .catch(response = (error) => {
                console.log('ERROR: ', error.message || error);
            });
    }
};

module.exports = scoreboardEvents;
