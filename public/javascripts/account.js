const socket = io.connect();
$(document).ready(function() {
  $(".register-btn").on('click', e => {
    e.preventDefault();
    $("#register-modal").modal('show');
  })

  $(".signin-btn").on('click', e => {
    e.preventDefault();
    $("#signin-modal").modal('show');
  })

  $("#chat-send").on('click', e => {
    e.preventDefault();
    socket.emit('send message', $('#chat-msg').val());
  })

  socket.on('chat update', data => {
    $('#chat-data').append('<p>' + data.message + '<p>');
  })

})
