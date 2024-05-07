const sql = require('mssql');
const { poolPromise } = require('../../../config/config');

class IntakeRecord {
    async trackIngredient(userId, ingredient, weight, nutrients, datetime, location, totalCalories) {
        try {
            const pool = await poolPromise;
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('ingredient', sql.NVarChar, ingredient)
                .input('weight', sql.Float, weight)
                .input('nutrients', sql.NVarChar, nutrients)
                .input('datetime', sql.NVarChar, datetime)
                .input('location', sql.NVarChar, location)
                .input('totalCalories', sql.Int, totalCalories)
                .query(`
                    INSERT INTO Nutri.intake_records (userId, ingredient, weight, nutrients, datetime, location, TotalCalories)
                    VALUES (@userId, @ingredient, @weight, @nutrients, @datetime, @location, @totalCalories)
                `);
            return true;
        } catch (err) {
            console.error('Error tracking ingredient:', err);
            throw err;
        }
    }

    async getIntakeRecords(userId) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .query(`
                    SELECT ir.*, m.name AS mealName
                    FROM Nutri.intake_records ir
                    JOIN Nutri.meals m ON ir.mealId = m.id
                    WHERE ir.userId = @userId;
                `);
            return result.recordset;
        } catch (err) {
            console.error('Failed to fetch intake records:', err);
            throw err;
        }
    }
}

module.exports = IntakeRecord;
