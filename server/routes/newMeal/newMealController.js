// newMealController.js
const sql = require('mssql');
const { databaseConfig } = require('../../db');

// Function to save meal data to the database
const saveMeal = async (req, res) => {
    const mealData = req.body;

    try {
        // Connect to the database
        const pool = await sql.connect(databaseConfig);

        // Insert meal data into the Meals table
        const result = await pool.request()
        .input('name', sql.NVarChar(255), JSON.stringify(mealData.name))
        .input('ingredients', sql.NVarChar(sql.MAX), JSON.stringify(mealData.ingredients))
        .query('INSERT INTO Meals (name, ingredients) VALUES (@name, @ingredients)');

        console.log('Meal saved to din mordatabase');
        res.status(200).json({ message: 'Meal saved to database' });
    } catch (error) {
        console.error('Error saving meal to database:', error);
        res.status(500).json({ message: 'Error saving meal to database' });
    }
};

module.exports = {
    saveMeal
};
