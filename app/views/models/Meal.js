const sql = require('mssql');
const { poolPromise } = require('../../../config/config');

class Meal {
    async create(userId, mealData) {
        try {
            const pool = await poolPromise;
            const { name, ingredients } = mealData;
    
            // Calculate total calories of the meal
            let totalCalories = 0;
            ingredients.forEach(ingredient => {
                totalCalories += ingredient.nutrients.kalorier; // Accessing the 'kalorier' property from 'nutrients'
            });
    
            // Calculate calories per 100g of the meal
            const weightInGrams = ingredients.reduce((totalWeight, ingredient) => totalWeight + ingredient.amount, 0);
            const caloriesPer100g = (totalCalories / weightInGrams) * 100;
    
            // Insert meal data into the database
            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .input('name', sql.NVarChar(255), JSON.stringify(name))
                .input('ingredients', sql.NVarChar(sql.MAX), JSON.stringify(ingredients))
                .input('caloriesPer100g', sql.Float, caloriesPer100g)
                .query('INSERT INTO Nutri.Meals (UserId, name, ingredients, caloriesPer100g) VALUES (@userId, @name, @ingredients, @caloriesPer100g)');
    
            console.log('Meal saved to database');
            return { message: 'Meal saved to database', result };
        } catch (error) {
            console.error('Error saving meal to database:', error);
            throw error; // Rethrow to handle it in the controller
        }
    }
    
    
    

    async fetchAll(userId) {
        try {
            const pool = await poolPromise;
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
    
            return result.recordset.map(meal => ({
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
            }));
        } catch (error) {
            console.error('Error in Meal.fetchAll:', error);
            throw error;
        }
    }

    async getUserMeals(userId) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .query('SELECT * FROM Nutri.Meals WHERE UserId = @userId');
            return result.recordset;
        } catch (err) {
            console.error('Error fetching user meals:', err);
            throw err;
        }
    }

    async trackMeal(mealId, userId, weight, datetime, waterVolume, waterDatetime, location) {
        try {
            console.log('Received parameters:', { mealId, userId, weight, datetime, location, waterVolume, waterDatetime });
    
            const pool = await poolPromise;
    
            // Fetch the caloriesPer100g from Nutri.Meals based on the mealId
            const mealCaloriesQuery = `
                SELECT caloriesPer100g
                FROM Nutri.Meals
                WHERE id = @mealId
            `;
            const mealCaloriesResult = await pool.request()
                .input('mealId', sql.Int, mealId)
                .query(mealCaloriesQuery);
    
            // Check if mealCaloriesResult has a valid result
            if (mealCaloriesResult.recordset.length === 0) {
                throw new Error('Meal not found');
            }
    
            const caloriesPer100g = mealCaloriesResult.recordset[0].caloriesPer100g;
    
            // Calculate total calories based on the weight provided by the user
            const totalCalories = (caloriesPer100g * weight) / 100; // Calories per gram * weight (in grams)
    
            // Insert intake record into the database
            const query = `
                INSERT INTO Nutri.intake_records (mealId, Weight, datetime, UserId, waterVolume, waterDatetime, location, totalCalories)
                VALUES (@mealId, @weight, @datetime, @userId, @waterVolume, @waterDatetime, @location, @totalCalories)
            `;
            await pool.request()
                .input('mealId', sql.Int, mealId)
                .input('userId', sql.Int, userId)
                .input('weight', sql.Int, weight)
                .input('datetime', sql.DateTime, new Date(datetime))
                .input('waterVolume', sql.Decimal(10, 2), waterVolume)
                .input('waterDatetime', sql.DateTime, new Date(waterDatetime))
                .input('location', sql.NVarChar, location)
                .input('totalCalories', sql.Decimal(10, 2), totalCalories) // Use sql.Decimal for totalCalories
                .query(query);
    
            console.log('Meal tracked successfully');
            return true;
        } catch (err) {
            console.error('Error tracking meal:', err);
            throw err;
        }
    }
    
    
    
    
}

module.exports = Meal;
