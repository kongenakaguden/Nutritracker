const sql = require('mssql');
const bcrypt = require('bcrypt');
const { databaseConfig } = require('../../config');

async function createUser(req, res) {
    try {
        const { username, email, password, weight, age, gender } = req.body;

        console.log('Received user data:', req.body);

        // Connect to the database
        const pool = await sql.connect(databaseConfig);

        // Check if user already exists
        const existingUser = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query('SELECT * FROM Nutri.Users WHERE email = @email');

        if (existingUser.recordset.length > 0) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user information into the database
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .input('email', sql.NVarChar(255), email)
            .input('password', sql.NVarChar(255), hashedPassword)
            .input('weight', sql.Decimal(18, 2), weight)
            .input('age', sql.Int, age)
            .input('gender', sql.NVarChar(50), gender)
            .query('INSERT INTO Nutri.Users (username, email, password, weight, age, gender) VALUES (@username, @email, @password, @weight, @age, @gender)');
        
        console.log('User created successfully:', { username, email, weight, age, gender });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createUser,
};
