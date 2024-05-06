//server/routes/users/createController

const sql = require('mssql');
const bcrypt = require('bcrypt');
const { poolPromise } = require('../../../config/config');

function calculateBMR(weight, age, gender) {
    // Normalize the gender value to ensure case-insensitive comparison
    const normalizedGender = gender.toLowerCase();

    console.log('Calculating BMR for gender:', normalizedGender);  // Log the normalized gender value

    if (normalizedGender === 'male') {
        return 88.362 + (13.397 * weight) + (4.799 * 180) - (5.677 * age);  // Example with assumed height
    } else if (normalizedGender === 'female') {
        return 447.593 + (9.247 * weight) + (3.098 * 160) - (4.330 * age);  // Example with assumed height
    }
    return null;  // This will explicitly handle unexpected gender values
}

async function createUser(req, res) {
    try {
        const { username, email, password, weight, age, gender } = req.body;

        console.log('Received user data:', req.body);  // Log the full received user data

        const pool = await poolPromise;

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

        // Calculate BMR
        let bmr = calculateBMR(weight, age, gender);

        console.log('Calculated BMR:', bmr);  // Log the calculated BMR

        // Insert user information into the database
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .input('email', sql.NVarChar(255), email)
            .input('password', sql.NVarChar(255), hashedPassword)
            .input('weight', sql.Decimal(18, 2), weight)
            .input('age', sql.Int, age)
            .input('gender', sql.NVarChar(50), gender)
            .input('bmr', sql.Decimal(18, 2), bmr)
            .query('INSERT INTO Nutri.Users (username, email, password, weight, age, gender, BMR) VALUES (@username, @email, @password, @weight, @age, @gender, @bmr)');

        console.log('User created successfully:', { username, email, weight, age, gender, bmr });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    createUser,
};