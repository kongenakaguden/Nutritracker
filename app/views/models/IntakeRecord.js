// Importerer mssql-pakken til SQL Server og en databaseforbindelse fra config-filen
const sql = require('mssql');
const { poolPromise } = require('../../../config/config');

// Definerer en klasse kaldet IntakeRecord, der indeholder metoder til håndtering af ernæringsdata
class IntakeRecord {
    // Asynkron metode til at spore en ingrediens i brugerens indtagelsesdata
    async trackIngredient(userId, ingredient, weight, datetime, location, totalCalories) {
        try {
            // Få en forbindelse fra databasepoolen
            const pool = await poolPromise;

            // Opretter en databaseforespørgsel og tildeler inputparametre
            await pool.request()
                .input('userId', sql.Int, userId) // Tildeler bruger-ID
                .input('ingredient', sql.NVarChar, ingredient) // Navnet på ingrediensen
                .input('weight', sql.Float, weight) // Vægt af ingrediensen
                .input('datetime', sql.NVarChar, datetime) // Dato og tid for indtagelsen
                .input('location', sql.NVarChar, location) // Stedet, hvor ingrediensen blev indtaget
                .input('totalCalories', sql.Int, totalCalories) // Det samlede antal kalorier

                // Udfør SQL-forespørgslen til at indsætte indtagelsesdataene i Nutri.intake_records
                .query(`
                    INSERT INTO Nutri.intake_records (userId, ingredient, weight, datetime, location, TotalCalories)
                    VALUES (@userId, @ingredient, @weight, @datetime, @location, @totalCalories)
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

    // Metode til at slette en indtagelsespost
    async deleteRecord(recordId) {
        try {
            const pool = await poolPromise;
            await pool.request()
                .input('recordId', sql.Int, recordId)
                .query('DELETE FROM Nutri.intake_records WHERE id = @recordId');
            return true;
        } catch (err) {
            console.error('Error deleting record:', err);
            throw err;
        }
    }

    // Metode til at opdatere en indtagelsespost
    async updateRecord(recordId, updateData) {
        try {
            const pool = await poolPromise;
            const query = `
                UPDATE Nutri.intake_records
                SET weight = @weight, datetime = @datetime, TotalCalories = m.caloriesPer100g * @weight / 100
                FROM Nutri.intake_records ir
                INNER JOIN Nutri.Meals m ON ir.mealId = m.id
                WHERE ir.id = @recordId
            `;
            await pool.request()
                .input('recordId', sql.Int, recordId)
                .input('weight', sql.Float, updateData.weight)
                .input('datetime', sql.DateTime, updateData.datetime)
                .query(query);
            return true;
        } catch (err) {
            console.error('Error updating record:', err);
            throw err;
        }
    }
    async getRecordById(recordId) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('recordId', sql.Int, recordId)
                .query('SELECT * FROM Nutri.intake_records WHERE id = @recordId');

            if (result.recordset.length > 0) {
                return result.recordset[0];  // Return the record if found
            } else {
                return null;  // Return null if no record is found
            }
        } catch (err) {
            console.error('Error fetching record by ID:', err);
            throw err;  // Re-throw the error to handle it in the calling context
        }
    }

}

// Eksporterer IntakeRecord-klassen, så den kan bruges i andre filer eller moduler
module.exports = IntakeRecord;