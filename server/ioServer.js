let players = [],
users = [],
connections = [];

const ioConnect = (io, socket, db) => {
    socket.join('lobby');
    connections.push(socket);
    console.log("Connected: " + connections.length);
    require('./accountEvents.js')(io, socket, users, db);
    require('./gameEvents.js')(io, socket, players);
    require('./chatEvents.js')(io, socket);
    require('./disconnectEvents.js')(socket, connections, players);
};

module.exports = ioConnect;
