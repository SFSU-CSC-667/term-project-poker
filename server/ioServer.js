let game = {},
  players = {},
  users = {},
  connections = {};

const ioConnect = (io, socket, db) => {
  socket.join('lobby');
  socket.status = 'Online';
  connections[socket.id] = { socket: socket };
  console.log("Connected: " + Object.keys(connections).length);
  console.log("Users: " + Object.keys(users).length);
  require('./accountEvents.js')(io, socket, users, db);
  require('./gameEvents.js')(io, socket, game, players, db);
  require('./chatEvents.js')(io, socket);
  require('./disconnectEvents.js')(io, socket, connections, users, game, players);
  require('./scoreboardEvents.js')(io, socket, db);
};

module.exports = ioConnect;
