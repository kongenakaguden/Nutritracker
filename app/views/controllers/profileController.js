// server/routes/users/profileController.js
const { databaseConfig } = require('../../../config/config');
const sql = require('mssql');

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
        const pool = await sql.connect(databaseConfig);
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

// Controller function for updating user profile
async function updateProfile(req, res) {
    try {
        // Extract user details from request body
        const { userId } = req.user; // Assuming userId is included in the request after authentication
        const { username, email, weight, age, gender } = req.body;

        // Connect to the database
        const pool = await sql.connect(databaseConfig);

        // Update user profile in the database
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('username', sql.NVarChar(255), username)
            .input('email', sql.NVarChar(255), email)
            .input('weight', sql.Decimal(10, 2), weight)
            .input('age', sql.Int, age)
            .input('gender', sql.NVarChar(50), gender)
            .query(`
                UPDATE Nutri.Users
                SET username = @username,
                    email = @email,
                    weight = @weight,
                    age = @age,
                    gender = @gender
                WHERE UserId = @userId
            `);

        // Check if any rows were affected
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'User not found or no changes were made' });
        }

        // Send success response
        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getProfile, updateProfile };
