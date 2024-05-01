// views/controllers/deleteController.js

const { databaseConfig } = require('../../../config/config');
const sql = require('mssql');

const deleteProfile = async (req, res) => {
  // Get the user id from the session
  const userId = req.session.userId;

  try {
    // Connect to the database
    let pool = await sql.connect(databaseConfig);

    // Create a new SQL request
    let request = new sql.Request(pool);

    // Delete the user from the database
    request.input('id', sql.Int, userId);
    let result = await request.query('DELETE FROM Nutri.Users WHERE UserId = @id');

    // Destroy the session after deleting the profile
    req.session.destroy(() => {
      res.status(200).send('Profile deleted');
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting profile');
  }
};

module.exports = { deleteProfile };