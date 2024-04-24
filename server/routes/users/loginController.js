const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { databaseConfig } = require('../../config');
const sql = require('mssql');

async function login(req, res) {
    const { username, password } = req.body;

    try {
        // Connect to the database
        const pool = await sql.connect(databaseConfig);

        // Retrieve user from database
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .query('SELECT * FROM Nutri.Users WHERE username = @username');

        const user = result.recordset[0];

        // Log user data and password received from the request
        console.log('User data:', user);
        console.log('Password received from request:', password);

        // Check if user exists and if the password is correct
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Log the password retrieved from the database
        console.log('Password retrieved from database:', user.password);

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, 'your_secret_key');

        // Send token as response
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { login };
