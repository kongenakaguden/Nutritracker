// db.js
const mssql = require('mssql');
const config = require('./config');

async function connectToDatabase() {
  try {
    await mssql.connect(config);
    console.log('Connected to MSSQL database');
  } catch (error) {
    console.error('Error connecting to MSSQL database:', error);
  }
}

module.exports = { connectToDatabase };
