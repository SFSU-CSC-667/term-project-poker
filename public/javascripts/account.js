const socket = io.connect();

$(document).ready(() => {
  $(".register-btn").on('click', event => {
    event.preventDefault();
    $("#register-modal").modal('show');
  });

  $(".signin-btn").on('click', event => {
    event.preventDefault();
    $("#signin-modal").modal('show');
  });

  $('#register-form').submit(event => {
   event.preventDefault();
   if ($("#password").val() === $('#password-confirm').val()) {
     requestAccount();
     $("#register-modal").modal('hide');
   } else {
     $(".passwords").data('tooltip', false).tooltip({
       title: 'Passwords must match!'
     }).tooltip('show');
   };
 });

 $('#signin-form').submit(event => {
  event.preventDefault();
  socket.emit('account signin', {
    email: $('#account-email').val(),
    password: $('#account-password').val()
  });
  $('#signin-form').trigger('reset');
  $("#signin-modal").modal('hide');
 });

 socket.on('account creation response', data => {
   if (data.success) {
     alert("Account creation is successful.");
   } else {
     alert(data.detail);
   }
 });

 socket.on('account signin response', data => {
   if (data.success) {
     socket.user = data.user;
     alert("Signin is successful.");
     $('#register-form').trigger('reset');
     $('.signin-btn').html(socket.user);
   } else {
     alert("Invalid credentials");
   }
 });

 function requestAccount() {
   socket.emit('account registration', {
     email: $('#email').val(),
     first: $('#first-name').val(),
     last: $('#last-name').val(),
     password: $('#password').val()
   });
 }

});
