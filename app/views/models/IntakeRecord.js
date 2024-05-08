// Importerer mssql-pakken til SQL Server og en databaseforbindelse fra config-filen
const sql = require('mssql');
const { poolPromise } = require('../../../config/config');

// Definerer en klasse kaldet IntakeRecord, der indeholder metoder til håndtering af ernæringsdata
class IntakeRecord {
    // Asynkron metode til at spore en ingrediens i brugerens indtagelsesdata
    async trackIngredient(userId, ingredient, weight, nutrients, datetime, location, totalCalories) {
        try {
            // Få en forbindelse fra databasepoolen
            const pool = await poolPromise;

            // Opretter en databaseforespørgsel og tildeler inputparametre
            await pool.request()
                .input('userId', sql.Int, userId) // Tildeler bruger-ID
                .input('ingredient', sql.NVarChar, ingredient) // Navnet på ingrediensen
                .input('weight', sql.Float, weight) // Vægt af ingrediensen
                .input('nutrients', sql.NVarChar, nutrients) // Ernæringsoplysninger
                .input('datetime', sql.NVarChar, datetime) // Dato og tid for indtagelsen
                .input('location', sql.NVarChar, location) // Stedet, hvor ingrediensen blev indtaget
                .input('totalCalories', sql.Int, totalCalories) // Det samlede antal kalorier

                // Udfør SQL-forespørgslen til at indsætte indtagelsesdataene i Nutri.intake_records
                .query(`
                    INSERT INTO Nutri.intake_records (userId, ingredient, weight, nutrients, datetime, location, TotalCalories)
                    VALUES (@userId, @ingredient, @weight, @nutrients, @datetime, @location, @totalCalories)
                `);

            // Returnerer true ved succesfuld udførelse
            return true;
        } catch (err) {
            // Logger fejlen og kaster den igen for at håndtere den eksternt
            console.error('Error tracking ingredient:', err);
            throw err;
        }
    }

    // Asynkron metode til at hente indtagelsesdata for en bestemt bruger
    async getIntakeRecords(userId) {
        try {
            // Få en forbindelse fra databasepoolen
            const pool = await poolPromise;

            // Opretter en databaseforespørgsel og tildeler inputparametre
            const result = await pool.request()
                .input('userId', sql.Int, userId) // Tildeler bruger-ID

                // Udfør SQL-forespørgslen til at hente indtagelsesdataene fra Nutri.intake_records
                .query(`
                    SELECT ir.*, m.name AS mealName
                    FROM Nutri.intake_records ir
                    JOIN Nutri.meals m ON ir.mealId = m.id
                    WHERE ir.userId = @userId;
                `);

            // Returnerer de hentede resultater som et array
            return result.recordset;
        } catch (err) {
            // Logger fejlen og kaster den igen for at håndtere den eksternt
            console.error('Failed to fetch intake records:', err);
            throw err;
        }
    }
}

// Eksporterer IntakeRecord-klassen, så den kan bruges i andre filer eller moduler
module.exports = IntakeRecord;