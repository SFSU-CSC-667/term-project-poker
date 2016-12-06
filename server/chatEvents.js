const chatEvents = (io, socket) => {

  socket.on('join chat', () => {
    if (!socket.displayName) {
      io.guestCount++;
      socket.displayName = 'Guest ' + io.guestCount;
    }
    if (socket.gameId) {
      socket.to(socket.gameId).emit('user details', { displayName: socket.displayName });
    } else {
      socket.to('lobby').emit('user details', { displayName: socket.displayName });
    }
  });

  socket.on('send message', data => {
    if (socket.gameId) {
      io.to(socket.gameId).emit('message response', {
        displayName: socket.displayName,
        message: data.message
      });
    } else {
      io.to('lobby').emit('message response', {
        displayName: socket.displayName,
        message: data.message
      });
    }

  });

  socket.on('join message', data => {
    if (socket.gameId) {
      io.to(socket.gameId).emit('join response', { message: data.message });
    } else {
      io.to('lobby').emit('join response', { message: data.message });
    }
  })
}

module.exports = chatEvents;
