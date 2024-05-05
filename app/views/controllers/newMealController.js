// newMealController.js
const sql = require('mssql');
const { poolPromise } = require('../../../config/config');
// Function to save meal data to the database
const saveMeal = async (req, res) => {
    // Get the meal data from the request body
    const mealData = req.body;

    console.log('Session data:', req.session);

    // Get the user id from the session
    const userId = req.session.user.UserId;

    // Add the userId to the mealData
    mealData.userId = userId;

    try {
        // Connect to the database
        const pool = await poolPromise;

        // Insert meal data into the Meals table
        const result = await pool.request()
        .input('userId', sql.Int, mealData.userId)
        .input('name', sql.NVarChar(255), JSON.stringify(mealData.name))
        .input('ingredients', sql.NVarChar(sql.MAX), JSON.stringify(mealData.ingredients))
        .query('INSERT INTO Nutri.Meals (UserId, name, ingredients) VALUES (@userId, @name, @ingredients)');

        console.log('Meal saved to database');
        res.status(200).json({ message: 'Meal saved to database' });
    } catch (error) {
        console.error('Error saving meal to database:', error);
        res.status(500).json({ message: 'Error saving meal to database' });
    }
};

module.exports = {
    saveMeal
};