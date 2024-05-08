// Importerer mssql-pakken og en databaseforbindelse fra konfigurationen
const sql = require('mssql');
const { poolPromise } = require('../../../config/config');

// Definerer klassen Meal, som indeholder metoder til at oprette, hente og spore måltider
class Meal {
    // Asynkron metode til at oprette et måltid for en bruger
    async create(userId, mealData) {
        try {
            // Få en forbindelse fra databasepuljen
            const pool = await poolPromise;
            
            // Udpakker navnet og ingredienserne fra det angivne måltidsdataobjekt
            const { name, ingredients } = mealData;
    
            // Beregner det samlede antal kalorier for måltidet
            let totalCalories = 0;
            ingredients.forEach(ingredient => {
                totalCalories += ingredient.nutrients.kalorier; // Tilføjer kalorierne fra hver ingrediens
            });
    
            // Beregner antal kalorier per 100 g af måltidet
            const weightInGrams = ingredients.reduce((totalWeight, ingredient) => totalWeight + ingredient.amount, 0);
            const caloriesPer100g = (totalCalories / weightInGrams) * 100;
    
            // Indsætter måltidsdata i databasen
            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .input('name', sql.NVarChar(255), JSON.stringify(name))
                .input('ingredients', sql.NVarChar(sql.MAX), JSON.stringify(ingredients))
                .input('caloriesPer100g', sql.Float, caloriesPer100g)
                .query('INSERT INTO Nutri.Meals (UserId, name, ingredients, caloriesPer100g) VALUES (@userId, @name, @ingredients, @caloriesPer100g)');
    
            console.log('Meal saved to database');
            return { message: 'Meal saved to database', result };
        } catch (error) {
            // Logger fejlen, hvis noget går galt, og kaster fejlen igen for at håndtere den eksternt
            console.error('Error saving meal to database:', error);
            throw error; // Kaster fejlen igen
        }
    }

    // Asynkron metode til at hente alle måltider for en bestemt bruger
    async fetchAll(userId) {
        try {
            // Få en forbindelse fra databasepuljen
            const pool = await poolPromise;
            
            // Hent alle måltider for den givne bruger og beregn næringsindholdet for hver
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
    
            // Returnerer måltidsdataene i et forståeligt format
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
            // Logger fejlen og kaster den igen for at håndtere den eksternt
            console.error('Error in Meal.fetchAll:', error);
            throw error;
        }
    }

    // Asynkron metode til at hente alle måltider for en bruger uden næringsberegning
    async getUserMeals(userId) {
        try {
            // Få en forbindelse fra databasepuljen
            const pool = await poolPromise;
            
            // Udfør en simpel forespørgsel for at hente måltider fra Nutri.Meals
            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .query('SELECT * FROM Nutri.Meals WHERE UserId = @userId');
            
            // Returnerer alle måltider i rå form
            return result.recordset;
        } catch (err) {
            // Logger fejlen og kaster den igen for at håndtere den eksternt
            console.error('Error fetching user meals:', err);
            throw err;
        }
    }

    // Asynkron metode til at spore et specifikt måltid for en bruger
    async trackMeal(mealId, userId, weight, datetime, waterVolume, waterDatetime, location) {
        try {
            console.log('Received parameters:', { mealId, userId, weight, datetime, location, waterVolume, waterDatetime });
    
            // Få en forbindelse fra databasepuljen
            const pool = await poolPromise;
    
            // Hent kalorier per 100 g for måltidet baseret på dets id
            const mealCaloriesQuery = `
                SELECT caloriesPer100g
                FROM Nutri.Meals
                WHERE id = @mealId
            `;
            const mealCaloriesResult = await pool.request()
                .input('mealId', sql.Int, mealId)
                .query(mealCaloriesQuery);
    
            // Kontrollér, om der er resultater for det ønskede måltid
            if (mealCaloriesResult.recordset.length === 0) {
                throw new Error('Meal not found');
            }
    
            // Beregn kalorier per 100 g fra de hentede data
            const caloriesPer100g = mealCaloriesResult.recordset[0].caloriesPer100g;
    
            // Beregn det samlede antal kalorier for måltidet baseret på brugerens vægt
            const totalCalories = (caloriesPer100g * weight) / 100;
    
            // Indsæt indtagsdata i Nutri.intake_records
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
                .input('totalCalories', sql.Decimal(10, 2), totalCalories) // Bruger sql.Decimal til at angive kalorier
                .query(query);
    
            console.log('Meal tracked successfully');
            return true;
        } catch (err) {
            // Logger fejlen og kaster den igen for at håndtere den eksternt
            console.error('Error tracking meal:', err);
            throw err;
        }
    }
}

// Eksporterer Meal-klassen, så den kan bruges i andre moduler
module.exports = Meal;
