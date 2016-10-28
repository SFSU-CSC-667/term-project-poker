$(document).ready(function() {
  var socket = io.connect();

  $(".register-btn").on('click', function() {
    $("#register-modal").modal('show');
  })

  $(".signin-btn").on('click', function() {
    $("#signin-modal").modal('show');
  })

  $("#chat-send").on('click', function(e) {
    e.preventDefault();
    socket.emit('send message', $('#chat-msg').val());
  })

  socket.on('chat update', function(data) {
    $('#chat-data').append('<p>' + data.message + '<p>');
  })

})
