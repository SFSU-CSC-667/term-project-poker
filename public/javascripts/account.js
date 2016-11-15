const socket = io.connect();

(() => {
  $(".register-btn").on('click', event => {
    event.preventDefault();
    $("#register-modal").modal('show');
  });

  $('#register-form').on('submit', event => {
    event.preventDefault();
    if ($("#password").val() === $('#password-confirm').val()) {
      requestAccount();
    } else {
      $(".passwords").data('tooltip', false).tooltip({
        title: 'Passwords must match!'
      }).tooltip('show');
    };
  });

  $('#signin-form').on('submit', event => {
    event.preventDefault();
    $('.signin-btn').replaceWith(loading());
    socket.emit('account signin', {
      email: $('#account-email').val(),
      password: $('#account-password').val(),
      form: 1
    });
    $("#signin-modal").modal('hide');
  });

  $('body').on('click', '.signin-btn, #signin-modal-btn', event => {
    event.preventDefault();
    $("#signin-modal").modal('show');
  });

  $('body').on('click', '#signout-btn', event => {
    event.preventDefault();
    $("#account-modal").modal('hide');
    sessionStorage.clear();
    location.reload();
  })

  $('body').on('click', '.account-btn', function(event) {
    event.preventDefault();
    socket.emit('request account information', { email: $(this)[0].innerHTML });
  });

  if (sessionStorage.getItem('email') && sessionStorage.getItem('password')) {
    $('.signin-btn').replaceWith(loading());
    let user = sessionStorage.getItem('email');
    let password = sessionStorage.getItem('password');
    socket.emit('account signin', {
      email: user,
      password: password
    });
  }

  socket.on('account information response', data => {
    console.log(data);
    $('.account-email').html(data.email);
    $('#account-firstname').html(data.first);
    $('#account-lastname').html(data.last);
    $('#account-chips').html(data.chips);
    $('#account-modal').modal('show');
  })

  socket.on('account creation response', data => {
    if (data.success) {
      alert("Account creation is successful.");
      $("#register-modal").modal('hide');
    } else {
      alert(data.detail);
    }
  });

  socket.on('account signin response', data => {
    if (data.success) {
      if (data.form) { storeSession() }
      $('#signin-form').trigger('reset');
      $('#loading').replaceWith(`<button class='account-btn btn btn-primary'>${ data.user }</button>`);
    } else {
      $('#loading').replaceWith('<button class="signin-btn btn btn-primary">Sign In</button>');
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

  function storeSession() {
    sessionStorage.setItem('email', $('#account-email').val());
    sessionStorage.setItem('password', $('#account-password').val());
  }

  function loading() {
    return (
      '<div id="loading">' +
        '<div id="dot-1" class="loading"></div>' +
        '<div id="dot-2" class="loading"></div>' +
        '<div id="dot-3" class="loading"></div>' +
        '<div id="dot-4" class="loading"></div>' +
      '</div>'
    );
  }
})();
