(() => {

  $('body').on('submit', '#chat-form', event => {
    event.preventDefault();
    let message = $('#message').val();
    if (message !== '') {
      socket.emit('send message', { message });
    }
    $('#message').val('').focus();
  })

  socket.on('message response', data => {
    $('#message-list').append('<li>' + data.displayName + '</b>: ' + data.message + '</li>');
  });

  socket.emit('join chat');

  socket.on('user details', data => {
    let message = 'System: ' + '<b>' + data.displayName + '</b> has joined the chat';
    $('#user').val(data.displayName);
    socket.emit('join message', { message });
  });

  socket.on('join response', data => {
    $('#message-list').append('<li>' + data.message + '</li>');
  });

})();
