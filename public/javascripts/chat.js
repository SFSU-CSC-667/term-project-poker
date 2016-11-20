(() => {
  socket.on('chatMessage', function(from, msg) {
    var me = $('#user').val();
    var color = (from == me) ? 'green' : '#009afd';
    var from = (from == me) ? socket.userName : from;
    $('#message-list').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
  });

  $(document).ready(function(){
    $('#user').val(socket.userName);
    socket.emit('chatMessage', 'System', '<b>' + socket.userName + '</b> has joined the chat');
  });

})();

function submitfunction(){

  var from = $('#user').val();
  var message = $('#message').val();
  if(message != '') {
    socket.emit('chatMessage', from, message);
  }
  $('#message').val('').focus();

  return false;

}
