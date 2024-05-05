const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../../../config/config');const sql = require('mssql');

async function login(req, res) {
    const { username, password } = req.body;

    try {
        // Connect to the database
        const pool = await poolPromise;

        // Retrieve user from database
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .query('SELECT * FROM Nutri.Users WHERE username = @username');

        const user = result.recordset[0];

        // Log user data
        console.log('User data:', user);

        // Check if user exists
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Log the password retrieved from the database
        console.log('Password retrieved from database:', user.password);

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Set loggedIn session variable
        req.session.loggedIn = true;

        req.session.user = user;

        console.log('User logged in successfully');

        // Redirect or send response
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { login };
