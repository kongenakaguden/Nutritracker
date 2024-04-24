// db.js
const mssql = require('mssql');
const config = require('./config');

const pool = new mssql.ConnectionPool(config);

async function connectToDatabase() {
  console.log("Forbinder to MSSQL database.....")
  try {
    await mssql.connect(config);
    console.log('Forbundet to MSSQL database');
  } catch (error) {
    console.error('Error connecting to MSSQL database:', error);
  }
}

module.exports = { pool, connectToDatabase };
