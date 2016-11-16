const chatEvents = (io, socket) => {
  socket.on('chatMessage', function(from, msg){
    io.emit('chatMessage', from, msg);
  });
}

module.exports = chatEvents;