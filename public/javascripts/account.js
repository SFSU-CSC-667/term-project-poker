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
    }
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
  });

  $('body').on('click', '.account-btn', function(event) {
    event.preventDefault();
    socket.emit('request account information', { email: $(this)[0].innerHTML });
  });

  $('body').on('click', '#firstname-edit', event => {
    event.preventDefault();
    let firstname = $('#account-firstname').html();
    $('#account-firstname').replaceWith(`<input id='account-firstname' value=${ firstname } />`);
    $('#firstname-edit').replaceWith("<button id='change-firstname' class='right btn btn-primary'> Change </button>");
  });

  $('body').on('click', '#lastname-edit', event => {
    event.preventDefault();
    let lastname = $('#account-lastname').html();
    $('#account-lastname').replaceWith(`<input id='account-lastname' value=${ lastname } />`);
    $('#lastname-edit').replaceWith("<button id='change-lastname' class='right btn btn-primary'> Change </button>");
  });

  $('body').on('click', '#change-firstname', event => {
    socket.emit('request firstname change', {
      email: $(".account-email").html(),
      newFirstname: `\'${ $("#account-firstname").val() }\'`
    });
  });

  $('body').on('click', '#change-lastname', event => {
    socket.emit('request lastname change', {
      email: $(".account-email").html(),
      newLastname: `\'${ $("#account-lastname").val() }\'`
    });
  });

  socket.on('firstname change response', data => {
    if (!data.success) { alert('Error changing name, try again later.'); }
    $('#account-firstname').replaceWith(`<span id="account-firstname">${ data.newFirstname.slice(1, -1) }</span>`);
    $('#change-firstname').replaceWith("<button id='firstname-edit' class='right btn btn-info'> Edit </button>");
  });

  socket.on('lastname change response', data => {
    if (!data.success) { alert('Error changing name, try again later.'); }
    $('#account-lastname').replaceWith(`<span id="account-lastname">${ data.newLastname.slice(1, -1) }</span>`);
    $('#change-lastname').replaceWith("<button id='lastname-edit' class='right btn btn-info'> Edit </button>");
  });

  socket.on('account information response', data => {
    $('.account-email').html(data.email);
    $('#account-firstname').html(data.first);
    $('#account-lastname').html(data.last);
    $('#account-chips').html(data.chips);
    $('#account-modal').modal('show');
  });

  socket.on('account creation response', data => {
    if (data.success) {
      storeSession($('#email').val(), $('#password').val());
      signIn();
      $("#register-form").trigger('reset');
      $("#register-modal").modal('hide');
    } else {
      alert(data.detail);
    }
  });

  socket.on('account signin response', data => {
    if (data.success) {
      if (data.form) { storeSession($('#account-email').val(), $('#account-password').val()); }
      $('#signin-form').trigger('reset');
      $('#loading').replaceWith(`<button class='account-btn btn btn-primary'>${ data.user }</button>`);
    } else {
      $('#loading').replaceWith('<button class="signin-btn btn btn-primary">Sign In</button>');
      alert("Invalid credentials");
    }
  });

  signIn();

  function signIn() {
    if (sessionStorage.getItem('email') && sessionStorage.getItem('password')) {
      $('.signin-btn').replaceWith(loading());
      let user = sessionStorage.getItem('email');
      let password = sessionStorage.getItem('password');
      socket.emit('account signin', {
        email: user,
        password: password
      });
    }
  }

  function requestAccount() {
    socket.emit('account registration', {
      email: $('#email').val(),
      first: $('#first-name').val(),
      last: $('#last-name').val(),
      password: $('#password').val()
    });
  }

  function storeSession(email, password) {
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('password', password);
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
