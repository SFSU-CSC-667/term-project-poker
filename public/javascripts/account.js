const socket = io.connect();

$(document).ready(() => {
  $(".register-btn").on('click', event => {
    event.preventDefault();
    $("#register-modal").modal('show');
  })

  $(".signin-btn").on('click', event => {
    event.preventDefault();
    $("#signin-modal").modal('show');
  })

  $("#chat-send").on('click', event => {
    event.preventDefault();
    socket.emit('send message', $('#chat-msg').val());
  })

  socket.on('chat update', data => {
    $('#chat-data').append('<p>' + data.message + '<p>');
  })

})
