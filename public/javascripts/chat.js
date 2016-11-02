(() => {
  $("#chat-send").on('click', event => {
    event.preventDefault();
    socket.emit('send message', $('#chat-msg').val());
  });

  socket.on('chat update', data => {
    $('#chat-data').append('<p>' + data.message + '<p>');
  });
})();
