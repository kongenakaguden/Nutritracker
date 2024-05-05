// server/routes/users/profileController.js
const { poolPromise } = require('../../../config/config');const sql = require('mssql');

// Controller function for fetching user profile
async function getProfile(req, res) {
    try {
        console.log('Fetching user profile...');
        console.log('User object:', req.user);

        // Ensure req.user exists
        if (!req.user) {
            console.log('User data not found in session');
            return res.status(401).json({ message: 'User data not found in session' });
        }

        // Extract user ID from the request object
        const { UserId } = req.user;
        console.log('User ID:', UserId);

        // Connect to the database
        const pool = await poolPromise;
console.log('Connected to the database');

// Execute SQL query to fetch user profile
const result = await pool.request()
    .input('userId', sql.Int, UserId) // Use UserId instead of userId
    .query(`
        SELECT *
        FROM Nutri.Users
        WHERE UserId = @userId
    `);

        // Check if user profile exists
        if (!result.recordset.length) {
            console.log('User profile not found');
            return res.status(404).json({ message: 'User profile not found' });
        }

        // User profile found, send response
        const userProfile = result.recordset[0];
        console.log('User profile:', userProfile);
        res.status(200).json({ profile: userProfile });
    } catch (error) {
        // Log error and send internal server error response
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getProfile };

