const pgp = require('pg-promise')();

pgp.pg.defaults.ssl = true;

const connection = process.env.DATABASE_URL;

const db = pgp(connection);

db.query(pgp.QueryFile('../db/Schema.sql', { minify: true }))
.then(response => {
  console.log("Database Initialization. ");
})
.catch(response => {
  console.log("Check the DB connection in db/initDB.js");
});

module.exports = db;
