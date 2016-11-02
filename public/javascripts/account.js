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

  $('#register-form').submit(function(e) {
   e.preventDefault();
   if ($("#password").val() === $('#password-confirm').val()) {
     requestAccount();
     $("#register-modal").modal('hide');
   } else {
     $(".passwords").data('tooltip', false).tooltip({
       title: 'Passwords must match!'
     }).tooltip('show');
   };
 });

 socket.on('account creation response', data => {
   if (data.success) {
     alert("Account creation is successful.");
   } else {
     alert(data.detail);
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
