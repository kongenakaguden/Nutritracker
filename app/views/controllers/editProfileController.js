// server/controllers/editProfileController.js

const { databaseConfig } = require('../../../config/config');
const sql = require('mssql');

// Controller function for rendering the edit profile page
async function renderEditProfile(req, res) {
    try {
        // Fetch user profile data
        const userProfile = await fetchProfile(req.user.UserId);

        // Render the edit profile page with the fetched profile data
        res.render('editProfile', { loggedIn: req.isAuthenticated(), profile: userProfile });
    } catch (error) {
        console.error('Error rendering edit profile page:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Controller function for updating user profile
async function updateProfile(req, res) {
    try {
        // Extract user ID from request object
        const userId = req.user.UserId;

        // Extract updated profile data from request body
        const { username, email, weight, age, gender } = req.body;

        // Connect to the database
        const pool = await sql.connect(databaseConfig);

        // Execute SQL UPDATE statement to update user profile
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .input('email', sql.NVarChar(255), email)
            .input('weight', sql.Decimal(10, 2), weight)
            .input('age', sql.Int, age)
            .input('gender', sql.NVarChar(50), gender)
            .input('userId', sql.Int, userId)
            .query(`
                UPDATE Nutri.Users
                SET username = @username,
                    email = @email,
                    weight = @weight,
                    age = @age,
                    gender = @gender
                WHERE UserId = @userId
            `);

        // Check if any rows were affected by the update
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

// Function to fetch user profile
async function fetchProfile(userId) {
    const pool = await sql.connect(databaseConfig);

    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
            SELECT *
            FROM Nutri.Users
            WHERE UserId = @userId
        `);

    return result.recordset[0];
}

module.exports = { renderEditProfile, updateProfile };
