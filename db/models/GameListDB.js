class GameListDB {
  constructor(db) {
    this.db = db;
  }

  createGame(data) {
    let query = 'INSERT INTO Games (GameName, Creator, MaxPlayers, MinBid, MinChips) VALUES' +
                `(${ data.gameName }, '${ data.userName }', 4, 50, 500) RETURNING GameId`;
    return this.db.one(query);
  }

  gameList() {
    let query = 'SELECT GameId, GameName, MaxPlayers, MinBid, MinChips FROM Games ORDER BY GameId ASC';
    return this.db.query(query);
  }

}

module.exports = GameListDB;
