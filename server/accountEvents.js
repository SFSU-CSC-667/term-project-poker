const accountEvents = (io, socket, users, db) => {
  const bcrypt = require('bcryptjs');

  socket.on('account registration', data => {
    createAccount(data);
  });

  socket.on('account signin', data => {
    loginAccount(data);
  });

  socket.on('request account information', data => {
    accountInfo(data.email);
  });

  socket.on('request account deletion', data => {
    deleteAccount(data);
  });

  socket.on('request change password', data => {
    editAccountPassword(data);
  });

  socket.on('request firstname change', data => {
    db.none(`UPDATE Users SET firstname = ${ data.newFirstname } WHERE email = '${ data.email }'`)
    .then(response => {
      socket.emit('firstname change response', { success: 1, newFirstname: data.newFirstname });
    })
    .catch(response => {
      socket.emit('firstname change response', { success: 0 });
    });
  });

  socket.on('request lastname change', data => {
    db.none(`UPDATE Users SET lastname = ${ data.newLastname } WHERE email = '${ data.email }'`)
    .then(response => {
      socket.emit('lastname change response', { success: 1, newLastname: data.newLastname });
    })
    .catch(response => {
      socket.emit('lastname change response', { success: 0 });
    });
  });

  function accountInfo(email) {
    db.one(`SELECT * FROM Users WHERE Email='${ email }'`)
    .then(response => {
      socket.emit('account information response', {
        success: 1,
        email: response.email,
        first: response.firstname,
        last: response.lastname,
        chips: response.chips,
        wins: response.wins
      });
    })
    .catch(response => {
      socket.emit('account information response', { success: 0 });
      console.log("Account info failure. " + email);
    });
  }

  function createAccount(data) {
    bcrypt.hash(data.password, 10, (error, hash) => {
      db.query("INSERT INTO Users (FirstName, LastName, Email, Password, Chips, Wins) " +
               `VALUES ('${ data.first }', '${ data.last }', '${ data.email }', ` +
               `'${ hash }', '5000', '0')`)
      .then(response => {
        console.log("Account created. " + data.email);
        socket.emit("account creation response", { success: 1 });
      })
      .catch(response => {
        console.log("Account entry failure. " + data.email);
        socket.emit("account creation response", {
          success: 0, detail: response.detail
        });
      });
    });
  }

  function editAccountPassword(data) {
    db.one(`SELECT * FROM Users WHERE Email='${ data.email }'`)
    .then(response => {
      bcrypt.compare(data.currentPassword, response.password, (error, success) => {
        if (success) {
          bcrypt.hash(data.newPassword, 10, (error, hash) => {
            db.none(`UPDATE Users SET Password = '${ hash }' WHERE Email='${ data.email }'`);
            socket.emit("change password response", { success: 1 });
          });
        } else {
          socket.emit("change password response", { success: 0 });
        }
      });
    })
    .catch(response => {
      console.log(response);
      socket.emit("change password response", { success: 0 });
    });
  }

  function deleteAccount(data) {
    db.one(`SELECT * FROM Users WHERE Email='${ data.email }'`)
    .then(response => {
      bcrypt.compare(data.password, response.password, (error, success) => {
        if (success) {
          db.none(`DELETE FROM Users WHERE Email='${ data.email }'`);
          socket.emit("account deletion response", {
            success: 1, email: data.email
          });
        } else {
          socket.emit("account deletion response", { success: 0 });
        }
      });
    })
    .catch(response => {
      console.log(response);
      socket.emit("account deletion response", { success: 0 });
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
          socket.userName = data.email;
          socket.displayName = response.firstname + ' ' + response.lastname[0];
        } else {
          socket.emit("account signin response", { success: 0 });
        }
      });
    })
    .catch(response => {
      console.log(response);
      socket.emit("account signin response", { success: 0 });
    });
  }
};

module.exports = accountEvents;
