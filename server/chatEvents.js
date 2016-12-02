const chatEvents = (io, socket) => {

  socket.on('join chat', () => {
    if (!socket.displayName) {
      io.guestCount++;
      socket.displayName = 'Guest ' + io.guestCount;
    }
    socket.emit('user details', { displayName: socket.displayName });
  });

  socket.on('send message', data => {
    io.emit('message response', {
      displayName: socket.displayName,
      message: data.message
    });
  });

  socket.on('join message', data => {
    io.emit('join response', { message: data.message });
  })
}

module.exports = chatEvents;
