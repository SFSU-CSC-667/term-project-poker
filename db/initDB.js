const pgp = require('pg-promise')();

pgp.pg.defaults.ssl = true;

let connection = {
  host: 'ec2-54-235-78-240.compute-1.amazonaws.com',
  port: 5432,
  database: 'd96qs31grpmtm6',
  user: 'ggmuhtujnkmfwl',
  password: '8_VEz6_jG4N3Z8AyF-wdzv1VGb',
};

const db = pgp(connection);

db.query(pgp.QueryFile('../db/Schema.sql', { minify: true }))
.then(response => {
  console.log("Database Initialization. ");
})
.catch(response => {
  console.log("Error. ", response);
});

module.exports = db;
