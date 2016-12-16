class GameDB {
    constructor(db) {
        this.db = db;
    }

    setPlayerStatus(data, status) {
      return this.db.none(`UPDATE Players SET IsPlaying=${ status } WHERE GameId=${ data.gameId } AND UserId=${ data.playerId };`);
    }

    playerInfo(data) {
        return this.db.one(`SELECT * FROM Users WHERE Email='${ data.userName }';`);
    };

    gameInfo(data) {
        return this.db.one(`SELECT * FROM Games WHERE GameId=${ data.gameId };`);
    };

    allGamesInfo() {
        return this.db.any('SELECT * FROM Games');
    }

    addPlayer(data) {
        this.db.none(`INSERT INTO Players VALUES (${ data.gameId }, ${ data.playerId }, 0, ${ data.startAmount }, 0, TRUE , ${ data.seat }) ` +
            `WHERE NOT EXISTS (SELECT GameId, UserId FROM Players P WHERE P.GameId=${ data.gameId } AND P.UserId=${ data.playerId });`)
            .then(() => {
                this.db.none(`INSERT INTO PlayersActions VALUES (${ data.gameId }, ${ data.playerId }, FALSE, FALSE, FALSE, FALSE, FALSE) ` +
                    `WHERE NOT EXISTS (SELECT GameId, UserId FROM PlayersActions PA WHERE PA.GameId=${ data.gameId } AND PA.UserId=${ data.playerId });`)
                    .then(() => {
                        this.db.none(`INSERT INTO PlayersCards VALUES (${ data.gameId }, ${ data.playerId }, NULL, NULL, NULL, NULL, NULL) ` +
                            `WHERE NOT EXISTS (SELECT GameId, UserId FROM PlayersCards PC WHERE PC.GameId=${ data.gameId } AND PC.UserId=${ data.playerId });`);
                    });
            });
    };

    setAllIn(data) {
        this.db.none(`UPDATE PlayersActions SET IsAllIn=TRUE WHERE GameId=${ data.gameId } AND UserId= ${ data.playerId};`);
    }

    setCall(data) {
        this.db.none(`UPDATE PlayersActions SET IsCall=TRUE WHERE GameId=${ data.gameId } AND UserId= ${ data.playerId};`);
    }

    setCheck(data) {
        this.db.none(`UPDATE PlayersActions SET IsCheck=TRUE WHERE GameId=${ data.gameId } AND UserId= ${ data.playerId};`);
    }

    setFold(data) {
        this.db.none(`UPDATE PlayersActions SET IsFold=TRUE WHERE GameId=${ data.gameId } AND UserId= ${ data.playerId};`);
    }

    setRaise(data) {
        this.db.none(`UPDATE PlayersActions SET IsRaise=TRUE WHERE GameId=${ data.gameId } AND UserId= ${ data.playerId};`)
            .then(() => {
                this.setCall(data);
                this.db.none(`UPDATE PlayersActions SET IsCall=FALSE, IsRaise=FALSE WHERE GameId<>${ data.gameId } AND UserId<>${ data.playerId};`);
            });
    }

    resetGame(data) {
        this.db.none(`UPDATE PlayersActions SET IsAllIn=FALSE, IsCall=FALSE, IsCheck=FALSE, IsFold=FALSE, Raise=FALSE WHERE GameId=${ data.gameId };`);
    }

    updateUserChips(data) {
        this.db.none(`UPDATE Users SET chips = chips - ${ data.amount } WHERE email='${ data.userName }';`);
    };

    updateUserWinCounts(data) {
        this.db.none(`UPDATE Users SET win = win + 1 WHERE email = '${ data.userName }';`);
    };

    updateUserScore(data) {
        this.db.none(`UPDATE Users SET chips = chips + ${ data.amount }, wins = wins + 1 WHERE email = '${ data.userName }';`);
    };

    setNotPlaying(data) {
        this.db.none(`UPDATE Players SET IsPlaying=FALSE WHERE GameId=${ data.gameId } AND UserId=${ data.playerId };`);
    };

    removePlayer(data) {
        this.db.none(`DELETE FROM Players WHERE GameId=${ data.gameId } AND UserId=${ data.playerId };`)
            .then(() => {
                this.db.none(`DELETE FROM PlayersActions WHERE GameId=${ data.gameId } AND UserId=${ data.playerId };`)
                    .then(() => {
                        this.db.none(`DELETE FROM PlayersCards WHERE GameId=${ data.gameId } AND UserId=${ data.playerId }`)
                            .catch(error => {
                                console.log("Error removing player cards. ", error.message);
                            });
                    })
                    .catch(error => {
                        console.log("Error removing player actions. ", error.message);
                    });
            })
            .catch(error => {
                console.log("Error removing player. ", error.message);
            });
    };
}
;

module.exports = GameDB;
