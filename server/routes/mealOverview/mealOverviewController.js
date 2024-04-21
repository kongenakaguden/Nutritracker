const sql = require('mssql');
const { databaseConfig } = require('../../db');

// Function to fetch meals for overview
const fetchMeals = async (req, res) => {
    try {
        // Connect to the database
        const pool = await sql.connect(databaseConfig);

        // Query to fetch meals from the database
        const result = await pool.request().query(`
        SELECT
    id,
    name,
    ingredients,
    (
        SELECT
            ROUND(SUM(CAST(JSON_VALUE(ingredient.nutrients, '$.value') AS FLOAT) * ingredient.amount / 100), 2) AS kulhydrater
        FROM
            OPENJSON(Meals.ingredients)
        WITH
            (
                foodName NVARCHAR(255) '$.foodName',
                amount FLOAT '$.amount',
                nutrients NVARCHAR(MAX) '$.nutrients' -- Removed AS JSON
            ) AS ingredient
    ) AS kulhydrater,
    (
        SELECT
            ROUND(SUM(CAST(JSON_VALUE(ingredient.nutrients, '$.value') AS FLOAT) * ingredient.amount / 100), 2) AS protein
        FROM
            OPENJSON(Meals.ingredients)
        WITH
            (
                foodName NVARCHAR(255) '$.foodName',
                amount FLOAT '$.amount',
                nutrients NVARCHAR(MAX) '$.nutrients' -- Removed AS JSON
            ) AS ingredient
    ) AS protein,
    (
        SELECT
            ROUND(SUM(CAST(JSON_VALUE(ingredient.nutrients, '$.value') AS FLOAT) * ingredient.amount / 100), 2) AS fedt
        FROM
            OPENJSON(Meals.ingredients)
        WITH
            (
                foodName NVARCHAR(255) '$.foodName',
                amount FLOAT '$.amount',
                nutrients NVARCHAR(MAX) '$.nutrients' -- Removed AS JSON
            ) AS ingredient
    ) AS fedt,
    (
        SELECT
            ROUND(SUM(CAST(JSON_VALUE(ingredient.nutrients, '$.value') AS FLOAT) * ingredient.amount / 100), 2) AS kalorier
        FROM
            OPENJSON(Meals.ingredients)
        WITH
            (
                foodName NVARCHAR(255) '$.foodName',
                amount FLOAT '$.amount',
                nutrients NVARCHAR(MAX) '$.nutrients' -- Removed AS JSON
            ) AS ingredient
    ) AS kalorier,
    (
        SELECT
            ROUND(SUM(CAST(JSON_VALUE(ingredient.nutrients, '$.value') AS FLOAT) * ingredient.amount / 100), 2) AS vand
        FROM
            OPENJSON(Meals.ingredients)
        WITH
            (
                foodName NVARCHAR(255) '$.foodName',
                amount FLOAT '$.amount',
                nutrients NVARCHAR(MAX) '$.nutrients' -- Removed AS JSON
            ) AS ingredient
    ) AS vand
FROM
    Meals
        `);
        
        const meals = result.recordset.map(meal => {
            const nutrientValues = meal.nutrient_values;
            return {
                id: meal.id,
                name: meal.name,
                ingredients: JSON.parse(meal.ingredients),
                nutrient_values: nutrientValues ? {
                    kulhydrater: nutrientValues.kulhydrater || 0,
                    protein: nutrientValues.protein || 0,
                    fedt: nutrientValues.fedt || 0,
                    kalorier: nutrientValues.kalorier || 0,
                    vand: nutrientValues.vand || 0
                } : {
                    kulhydrater: 0,
                    protein: 0,
                    fedt: 0,
                    kalorier: 0,
                    vand: 0
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
