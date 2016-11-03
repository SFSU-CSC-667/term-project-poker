const accountEvents = (io, socket, users, db) => {
  const bcrypt = require('bcryptjs');
  socket.on('check account', data => {
    if (users[socket.id])
      socket.emit('signed in', users[socket.id]);
    else {
      console.log('false');
    }
  })

  socket.on('account registration', data => {
    bcrypt.hash(data.password, 10, (error, hash) => {
      createAccount(data, hash);
    });
  });

  socket.on('account signin', data => {
    loginAccount(data);
  })

  function createAccount(data, hash) {
    db.query("INSERT INTO Users (FirstName, LastName, Email, Password) "
         + `VALUES ('${ data.first }', '${ data.last }', '${ data.email }', `
         + `'${ hash }')`)
    .then(response => {
      console.log("Account created. " + data.email)
      socket.emit("account creation response", { success: 1 });
    })
    .catch(response => {
      console.log("Account entry failure. " + data.email)
      socket.emit("account creation response", {
        success: 0, detail: response.detail
      });
    });
  }

  function loginAccount(data) {
    db.one(`SELECT * FROM Users WHERE Email='${ data.email }'`)
    .then(response => {
      bcrypt.compare(data.password, response.password, (error, success) => {
        if (success) {
          socket.emit("account signin response", { user: data.email, success: 1, form: data.form });
          users[socket.id] = { firstName: response.firstname, email: data.email };
          console.log("Users: " + Object.keys(users).length);
        } else {
          socket.emit("account signin response", { success: 0 });
        }
      });
    })
    .catch(response => {
      console.log(response);
      socket.emit("account signin response", { success: 0 });
    })
  }
}

module.exports = accountEvents;
