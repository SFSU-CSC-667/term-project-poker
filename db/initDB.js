const pgp = require('pg-promise')();

let connection = {
  host: 'localhost',
  port: 5432,
  database: 'poker-game',
  user: 'user',
  password: 'root'
};

const db = pgp(connection);

db.query(pgp.QueryFile('../db/Schema.sql', { minify: true })).then(response => {
  if (!response.length)
    console.log("Database initialized.");
});

module.exports = db;
