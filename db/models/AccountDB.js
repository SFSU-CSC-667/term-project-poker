class AccountDB {
  constructor(db) {
    this.db = db;
  }

  createAccount(data, encrpytedPassword) {
    let query = "INSERT INTO Users (FirstName, LastName, Email, Password, Chips, Wins) " +
                `VALUES ('${ data.first }', '${ data.last }', '${ data.email }', ` +
                `'${ encrpytedPassword }', '5000', '0')`;
    return this.db.query(query);
  }

  deleteAccount(data) {
    return this.db.none(`DELETE FROM Users WHERE Email='${ data.email }'`);
  }

  editAccountPassword(data, encrpytedPassword) {
    return this.db.none(`UPDATE Users SET Password = '${ encrpytedPassword }' WHERE Email='${ data.email }'`);
  }

  accountInformation(data, selection) {
    let select = selection || '*';
    return this.db.one(`SELECT ${ select } FROM Users WHERE Email='${ data.email }'`);
  }

  editFirstName(data) {
    return this.db.none(`UPDATE Users SET firstname = ${ data.newFirstname } WHERE email = '${ data.email }'`);
  }

  editLastName(data) {
    return this.db.none(`UPDATE Users SET lastname = ${ data.newLastname } WHERE email = '${ data.email }'`);
  }

}

module.exports = AccountDB;
