const accountEvents = (io, socket, users, db) => {
  const bcrypt = require('bcryptjs');
  const AccountDB = require('../db/models/AccountDB');
  const accountDB = new AccountDB(db);

  socket.on('account registration', data => {
    createAccount(data);
  });

  socket.on('account signin', data => {
    loginAccount(data);
  });

  socket.on('request account information', data => {
    accountInfo(data);
  });

  socket.on('request account deletion', data => {
    deleteAccount(data);
  });

  socket.on('request change password', data => {
    editAccountPassword(data);
  });

  socket.on('request firstname change', data => {
    accountDB.editFirstName(data)
    .then(response => {
      socket.emit('firstname change response', { success: 1, newFirstname: data.newFirstname });
    })
    .catch(response => {
      socket.emit('firstname change response', { success: 0 });
    });
  });

  socket.on('request lastname change', data => {
    accountDB.editLastName(data)
    .then(response => {
      socket.emit('lastname change response', { success: 1, newLastname: data.newLastname });
    })
    .catch(response => {
      socket.emit('lastname change response', { success: 0 });
    });
  });

  function accountInfo(data) {
    accountDB.accountInformation(data)
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
      accountDB.createAccount(data, hash)
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
    accountDB.accountInformation(data)
    .then(response => {
      bcrypt.compare(data.currentPassword, response.password, (error, success) => {
        if (success) {
          bcrypt.hash(data.newPassword, 10, (error, hash) => {
            accountDB.editAccountPassword(data, hash);
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
    accountDB.accountInformation(data)
    .then(response => {
      bcrypt.compare(data.password, response.password, (error, success) => {
        if (success) {
          accountDB.deleteAccount(data);
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
    accountDB.accountInformation(data, 'firstname, lastname, password')
    .then(response => {
      bcrypt.compare(data.password, response.password, (error, success) => {
        if (success) {
          socket.emit("account signin response", { user: data.email, success: 1, form: data.form });
          users[socket.id] = { firstName: response.firstname, email: data.email };
          console.log("Users: " + Object.keys(users).length);
          socket.userId = response.userid;
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
