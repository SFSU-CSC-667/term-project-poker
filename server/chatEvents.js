const chatEvents = (io, socket) => {
  socket.on('send message', function(data) {
    io.emit('chat update', { message: data });
  });
}

module.exports = chatEvents;
