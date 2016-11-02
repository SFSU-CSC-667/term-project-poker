let players = [],
users = {},
connections = {};

const ioConnect = (io, socket, db) => {
  socket.join('lobby');
  connections[socket.id] = { socket: socket };
  console.log("Connected: " + Object.keys(connections).length);
  console.log("Users: " + Object.keys(users).length);
  require('./accountEvents.js')(io, socket, users, db);
  require('./gameEvents.js')(io, socket, players);
  require('./chatEvents.js')(io, socket);
  require('./disconnectEvents.js')(socket, connections, users, players);
};

module.exports = ioConnect;
