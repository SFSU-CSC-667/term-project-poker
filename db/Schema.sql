CREATE TABLE Users (
  UserId SERIAL PRIMARY KEY,
  FirstName VARCHAR (255),
  LastName VARCHAR (255),
  Email VARCHAR (255) UNIQUE,
  Password VARCHAR (255),
  Chips INTEGER,
  Avatar INTEGER
);

CREATE TABLE Games (
  GameId SERIAL PRIMARY KEY,
  MaxPlayers INTEGER,
  MinChips INTEGER,
  SeatsTaken INTEGER,
  Turn INTEGER
);

CREATE TABLE Players (
  GameId INTEGER REFERENCES GameList(GameId),
  UserId INTEGER REFERENCES Users(UserId),
  Bid INTEGER,
  BuyIn INTEGER,
  NetGain INTEGER,
  IsPlaying BOOLEAN,
  SeatNumber INTEGER
);

CREATE TABLE Deck (
  CardId SERIAL PRIMARY KEY,
  Card VARCHAR(255),
  Image VARCHAR(255)
);

CREATE TABLE PlayersCards (
  GameId INTEGER REFERENCES GameList(GameId),
  UserId INTEGER REFERENCES Users(UserId),
  FlopCard1 INTEGER REFERENCES Deck(CardId),
  FlopCard2 INTEGER REFERENCES Deck(CardId),
  FlopCard3 INTEGER REFERENCES Deck(CardId),
  TurnCard INTEGER REFERENCES Deck(CardId),
  RiverCard INTEGER REFERENCES Deck(CardId),
);
