class ScoreboardDB {
    constructor(db) {
        this.db = db;
    }

    getScores() {
        return this.db.any('SELECT UserId, FirstName, LastName, Chips, Wins FROM Users ORDER BY Chips DESC');
    }

}

module.exports = ScoreboardDB;
