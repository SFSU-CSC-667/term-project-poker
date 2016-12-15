class gameDBM {

    constructor(db) {
        this.db = db;
    }

    getPlayerInfo(data) {
        let GameQuery = `SELECT * FROM Users WHERE Email=${ UserName };`;
        return this.db.one(GameQuery, data);
    };

    getGameInfo(data) {
        let GameQuery = `SELECT * FROM Games WHERE GameId=${ gameId };`;
        return this.db.one(GameQuery, data);
    };

    getGamesInfo() {
        return this.db.query('SELECT * FROM Games');
    }

    addPlayer(data) {
        let GameQuery = `INSERT INTO Players VALUES (${ gameId }, ${ playerId }, 0, ${ startAmount }, 0, TRUE , ${ seat }) ` +
            `WHERE NOT EXISTS (SELECT GameId, UserId FROM Players P WHERE P.GameId=${ gameId } AND P.UserId=${ playerId });`;
        return this.db.none(GameQuery, data);
    };

    updateUserChips(data) {
        this.db.none(`UPDATE Users SET chips = chips - ${ amount } WHERE email='${ userName }';`, data);
    };

    updateUserWinCounts(data) {
        this.db.none(`UPDATE Users SET win = win + 1 WHERE email = '${ userName }';`, data);
    }

    updateUserScore(data) {
        this.db.none(`UPDATE Users SET chips = chips + ${ amount }, wins = wins + 1 WHERE email = '${ userName }'`, data);
    };
}
;

module.exports = gameDBM;