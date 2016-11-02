let players = [],
users = [],
connections = [];

const ioConnect = (io, socket, db) => {
    socket.join('lobby');
    connections.push(socket);
    console.log("Connected: " + connections.length);

    require('../server/gameEvents.js')(io, socket, players);
    require('../server/chatEvents.js')(io, socket);
    require('../server/disconnectEvents.js')(socket, connections, players);
};

module.exports = ioConnect;
