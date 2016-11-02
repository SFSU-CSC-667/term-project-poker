const accountEvents = (io, socket, db) => {
  socket.on('account registration', data => {
    db.query("INSERT INTO Users (FirstName, LastName, Email, Password) "
            + `VALUES ('${ data.first }', '${ data.last }', '${ data.email }', `
            + `'${ data.password }')`)
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
  });
}

module.exports = accountEvents;
