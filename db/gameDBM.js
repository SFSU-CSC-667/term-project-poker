class gameDBM {

    constructor(db) {
        this.db = db;
    }

    getPlayerInfo(data) {
        return this.db.one(`SELECT * FROM Users WHERE Email=${ data.UserName };`);
    };

    getGameInfo(data) {
        return this.db.one(`SELECT * FROM Games WHERE GameId=${ data.gameId };`);
    };

    getGamesInfo() {
        return this.db.query('SELECT * FROM Games');
    }

    addPlayer(data) {
        return this.db.none(`INSERT INTO Players VALUES (${ data.gameId }, ${ data.playerId }, 0, ${ data.startAmount }, 0, TRUE , ${ data.seat }) ` +
            `WHERE NOT EXISTS (SELECT GameId, UserId FROM Players P WHERE P.GameId=${ data.gameId } AND P.UserId=${ data.playerId });`);
    };

    updateUserChips(data) {
        this.db.none(`UPDATE Users SET chips = chips - ${ data.amount } WHERE email='${ data.userName }';`);
    };

    updateUserWinCounts(data) {
        this.db.none(`UPDATE Users SET win = win + 1 WHERE email = '${ data.userName }';`);
    }

    updateUserScore(data) {
        this.db.none(`UPDATE Users SET chips = chips + ${ data.amount }, wins = wins + 1 WHERE email = '${ data.userName }'`);
    };
};

module.exports = gameDBM;