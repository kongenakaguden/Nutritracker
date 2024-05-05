const sql = require('mssql');
const { poolPromise } = require('../../../config/config'); // Assuming you have a db.js managing your SQL pool

exports.trackActivity = async (req, res) => {
    const { activity, duration, caloriesBurned } = req.body;
    const userId = req.session.user.UserId;  // Assuming the user session is already set up

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('activity', sql.NVarChar, activity)
            .input('duration', sql.Int, duration)
            .input('caloriesBurned', sql.Decimal(10, 2), caloriesBurned)
            .query('INSERT INTO Nutri.activity_records (userId, activity, duration, caloriesBurned) VALUES (@userId, @activity, @duration, @caloriesBurned)');

        res.status(200).json({ message: 'Activity tracked successfully', data: result.recordset });
    } catch (err) {
        console.error('Failed to track activity:', err);
        res.status(500).send({ message: 'Failed to track activity', error: err });
    }
};
