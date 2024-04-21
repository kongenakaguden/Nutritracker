//ingredientController.js

// Import any necessary dependencies
const { pool } = require('../../db.js');

// Function to fetch ingredients from the database
const fetchIngredients = async (req, res) => {
    try {
        console.log('Fetching ingredients...');
        const client = await pool.connect();
        console.log('Connected to database');
        const result = await client.query('SELECT * FROM (SELECT *, ROW_NUMBER() OVER(PARTITION BY foodID ORDER BY sortKey) as rn FROM Nutri.Ingredients) as sub WHERE rn = 1 AND sortKey = 1030');
        console.log('Query executed successfully');
        const ingredients = result.rows;
        client.release();
        console.log('Ingredients fetched:', ingredients);
        res.json(ingredients);
    } catch (err) {
        console.error('Error fetching ingredients:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    fetchIngredients,
};
