const sql = require('mssql');
require('dotenv').config();

// Correct config object setup
const config = {
  server: process.env.DB_SERVER, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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
