const sql = require('mssql');
const { poolPromise } = require('../../../config/config');  // Make sure the path is correct

class Activity {
    async trackActivity(userId, activity, duration, caloriesBurned) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .input('activity', sql.NVarChar, activity)
                .input('duration', sql.Int, duration)
                .input('caloriesBurned', sql.Decimal(10, 2), caloriesBurned)
                .query('INSERT INTO Nutri.activity_records (userId, activity, duration, caloriesBurned) VALUES (@userId, @activity, @duration, @caloriesBurned)');

            return result.recordset;  // This usually doesn't return useful data for an INSERT, might want to adjust based on actual needs
        } catch (err) {
            console.error('Failed to track activity in model:', err);
            throw err;  // Rethrow the error so the controller can handle it
        }
    }
}
//kndsaljfbadsiu
module.exports = Activity;
