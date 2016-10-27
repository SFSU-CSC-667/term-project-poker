CREATE TABLE Users (
  UserId SERIAL PRIMARY KEY,
  FirstName VARCHAR (255),
  LastName VARCHAR (255),
  Email VARCHAR (255) UNIQUE,
  Password VARCHAR (255),
  Chips INTEGER,
  Avatar INTEGER
);

CREATE TABLE GameList
(
  GameId SERIAL PRIMARY KEY,
  MaxPlayers INTEGER,
  MinChips INTEGER,
  SeatsAvailable INTEGER
);

CREATE TABLE GameTables
(
  GameId INTEGER REFERENCES GameList(GameId),
  UserId INTEGER REFERENCES Users(UserId),
  Bid INTEGER,
  Chips INTEGER,
  Cards VARCHAR(255),
  Status INTEGER
);
