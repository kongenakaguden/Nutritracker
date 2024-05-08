// Importere nødvendige moduler
const sql = require('mssql');
const { poolPromise } = require('../../../config/config');  // Sørg for, at stien er korrekt

// Definere Activity-klassen
class Activity {
    // Definere en metode til at spore en aktivitet
    async trackActivity(userId, activity, duration, caloriesBurned) {
        try {
            // Vent på at få forbindelse fra databaseforbindelsespuljen
            const pool = await poolPromise;

            // Opret en ny forespørgsel med angivne inputparametre
            const result = await pool.request()
                .input('userId', sql.Int, userId)                  // Bind 'userId' som en integer
                .input('activity', sql.NVarChar, activity)         // Bind 'activity' som en tekststreng
                .input('duration', sql.Int, duration)              // Bind 'duration' som en integer
                .input('caloriesBurned', sql.Decimal(10, 2), caloriesBurned)  // Bind 'caloriesBurned' som et decimalnummer
                // Kør SQL-forespørgslen for at indsætte en ny post i 'activity_records' tabellen
                .query('INSERT INTO Nutri.activity_records (userId, activity, duration, caloriesBurned) VALUES (@userId, @activity, @duration, @caloriesBurned)');

            // Returnere resultatsættet fra forespørgslen
            // Normalt returneres ingen nyttige data fra en INSERT-operation, så dette kan justeres efter behov
            return result.recordset;
        } catch (err) {
            // Log fejlen til konsollen, hvis forespørgslen mislykkes
            console.error('Failed to track activity in model:', err);

            // Genkaste fejlen, så den kan håndteres af controlleren eller en anden komponent
            throw err;
        }
    }
}

// Eksportere Activity-klassen, så den kan bruges i andre moduler
module.exports = Activity;
