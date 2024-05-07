const sql = require('mssql');

// Correct config object setup
const config = {
  server: 'jatakserver.database.windows.net',  // Ensure the server name is correct
  user: 'Viggo@jatakserver',  // User format generally 'username@servername'
  password: 'Studiegruppe123.',
  database: 'NutriTracker',
  port: 1433,
  options: {
    encrypt: true,  // Necessary for Azure SQL Database
    enableArithAbort: true
  }
};

// Correctly pass the config object to the ConnectionPool constructor
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed!', err);
        process.exit(1);
    });

module.exports = {
    sql, 
    poolPromise
};
