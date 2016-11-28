(() => {
  socket.on('message response', data => {
    var me = $('#user').val();
    // var color = (from == me) ? 'green' : '#009afd';
    // var from = (from == me) ? socket.userName : from;
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

function submitfunction() {

  var from = $('#user').val();
  var message = $('#message').val();
  if (message !== '') {
    socket.emit('send message', { message });
  }
  $('#message').val('').focus();

  return false;

}
