//mealsOverviewController.js

const sql = require('mssql');
const { poolPromise } = require('../../../config/config');
// Function to fetch meals for overview
// Function to fetch meals for overview
const fetchMeals = async (req, res) => {
    try {
        // Connect to the database
        const pool = await poolPromise;

        // Get the user id from the session
        const userId = req.session.user.UserId;

        // Query to fetch meals from the database
        const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
        SELECT
    m.id,
    m.name,
    m.ingredients,
    ROUND(SUM(JSON_VALUE(i.value, '$.nutrients.kulhydrater') * CAST(JSON_VALUE(i.value, '$.amount') AS FLOAT) / totalAmount), 2) AS kulhydrater,
    ROUND(SUM(JSON_VALUE(i.value, '$.nutrients.protein') * CAST(JSON_VALUE(i.value, '$.amount') AS FLOAT) / totalAmount), 2) AS protein,
    ROUND(SUM(JSON_VALUE(i.value, '$.nutrients.fedt') * CAST(JSON_VALUE(i.value, '$.amount') AS FLOAT) / totalAmount), 2) AS fedt,
    ROUND(SUM(JSON_VALUE(i.value, '$.nutrients.kalorier') * CAST(JSON_VALUE(i.value, '$.amount') AS FLOAT) / totalAmount), 2) AS kalorier,
    ROUND(SUM(JSON_VALUE(i.value, '$.nutrients.vand') / CAST(JSON_VALUE(i.value, '$.amount') AS FLOAT) * 100), 2) AS vand
FROM
    Nutri.Meals AS m
CROSS APPLY
    OPENJSON(m.ingredients) AS i
CROSS APPLY
    (SELECT SUM(CAST(JSON_VALUE(i.value, '$.amount') AS FLOAT)) AS totalAmount FROM OPENJSON(m.ingredients) AS i) AS t
WHERE
    m.UserId = @userId
GROUP BY
    m.id, m.name, m.ingredients;
        `);
        
        const meals = result.recordset.map(meal => {
            return {
                id: meal.id,
                name: meal.name,
                ingredients: JSON.parse(meal.ingredients),
                nutrient_values: {
                    kulhydrater: meal.kulhydrater || 0,
                    protein: meal.protein || 0,
                    fedt: meal.fedt || 0,
                    kalorier: meal.kalorier || 0,
                    vand: meal.vand || 0
                }
            };
        });
        

        res.status(200).json(meals); // Send the meals with nutrient values as JSON response
    } catch (error) {
        console.error('Error fetching meals for overview:', error);
        res.status(500).json({ message: 'Error fetching meals for overview' });
    }
};

module.exports = {
    fetchMeals
};
