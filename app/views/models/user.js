// Importerer nødvendige pakker: `mssql` til SQL Server, `bcrypt` til hashing af adgangskoder, og databaseforbindelse fra `config`.
const sql = require('mssql');
const bcrypt = require('bcrypt');
const { poolPromise } = require('../../../config/config');

// Definerer User-klassen med metoder til brugerhåndtering
class User {
    // Tjekker, om en bruger allerede findes i databasen baseret på deres email
    async checkUserExists(email) {
        // Få en forbindelse fra databasepoolen
        const pool = await poolPromise;
        // Opret en forespørgsel med email som input
        const result = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query('SELECT 1 FROM Nutri.Users WHERE email = @email');
        // Returner true, hvis der er mindst ét resultat (brugeren findes)
        return result.recordset.length > 0;
    }

    // Opretter en ny bruger og gemmer den i databasen
    async createUser(userData) {
        // Udpak brugeroplysninger fra inputobjektet
        const { username, email, password, weight, age, gender } = userData;
        // Få en forbindelse fra databasepoolen
        const pool = await poolPromise;
        // Tjek, om brugeren allerede findes
        if (await this.checkUserExists(email)) {
            const error = new Error('User already exists');
        error.status = 400; // Set the status property of the error
        throw error;
        }
        // Hash brugerens adgangskode
        const hashedPassword = await bcrypt.hash(password, 10);
        // Beregn brugerens Basal Metabolic Rate (BMR)
        const bmr = this.calculateBMR(weight, age, gender);
        // Indsæt den nye bruger i databasen med de relevante oplysninger
        await pool.request()
            .input('username', sql.NVarChar(255), username)
            .input('email', sql.NVarChar(255), email)
            .input('password', sql.NVarChar(255), hashedPassword)
            .input('weight', sql.Decimal(18, 2), weight)
            .input('age', sql.Int, age)
            .input('gender', sql.NVarChar(50), gender)
            .input('bmr', sql.Decimal(18, 2), bmr)
            .query('INSERT INTO Nutri.Users (username, email, password, weight, age, gender, BMR) VALUES (@username, @email, @password, @weight, @age, @gender, @bmr)');
    }

    // Beregner Basal Metabolic Rate (BMR) baseret på vægt, alder og køn
    calculateBMR(weight, age, gender) {
        if (!gender) {
            throw new Error('Gender is required to calculate BMR');
        }
    
        const normalizedGender = gender.toLowerCase();
    
        // Beregner BMR for mænd
        if (normalizedGender === 'male') {
            return 88.362 + (13.397 * weight) + (4.799 * 180) - (5.677 * age);
        }
        // Beregner BMR for kvinder
        else if (normalizedGender === 'female') {
            return 447.593 + (9.247 * weight) + (3.098 * 160) - (4.330 * age);
        }
        // Returnerer null, hvis kønnet ikke er kendt
        return null;
    }

    // Henter brugerprofiloplysninger baseret på bruger-ID
    async fetchProfile(userId) {
        // Få en forbindelse fra databasepoolen
        const pool = await poolPromise;
        // Udfør en forespørgsel for at hente alle oplysninger om brugeren
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM Nutri.Users WHERE UserId = @userId');
        // Returnerer kun den første (og forventede unikke) brugerprofil
        return result.recordset[0];
    }

    // Opdaterer en brugers profil baseret på bruger-ID og nye profiloplysninger
    async updateProfile(userId, profileData) {
        // Udpak de nye profiloplysninger fra inputobjektet
        const { username, email, weight, age, gender } = profileData;
        // Få en forbindelse fra databasepoolen
        const pool = await poolPromise;
        // Udfør en forespørgsel for at opdatere brugerens profiloplysninger i databasen
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .input('email', sql.NVarChar(255), email)
            .input('weight', sql.Decimal(10, 2), weight)
            .input('age', sql.Int, age)
            .input('gender', sql.NVarChar(50), gender)
            .input('userId', sql.Int, userId)
            .query(`
            UPDATE Nutri.Users
            SET username = @username,
                email = @email,
                weight = @weight,
                age = @age,
                gender = @gender,
                BMR = CASE
                    WHEN @gender = 'male' THEN
                        88.362 + (13.397 * @weight) - (5.677 * @age)
                    WHEN @gender = 'female' THEN
                        447.593 + (9.247 * @weight) - (4.330 * @age)
                    ELSE BMR  -- For andre værdier af køn
                END
            WHERE UserId = @userId
            `);
        // Returnerer antallet af rækker, der blev påvirket af opdateringen
        return result.rowsAffected[0];
    }

    // Verificerer en brugers legitimationsoplysninger ved at sammenligne adgangskoden
    async verifyUserCredentials(username, password) {
        // Få en forbindelse fra databasepoolen
        const pool = await poolPromise;
        // Udfør en forespørgsel for at hente brugeren baseret på brugernavn
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .query('SELECT * FROM Nutri.Users WHERE username = @username');
        // Returnerer null, hvis der ikke blev fundet nogen bruger
        if (result.recordset.length === 0) {
            return null;
        }
        // Sammenligner brugerens adgangskode med den hashede adgangskode i databasen
        const user = result.recordset[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        // Returnerer brugeren, hvis adgangskoden passer, ellers null
        return passwordMatch ? user : null;
    }

    // Sletter en bruger baseret på bruger-ID
    async deleteUser(userId) {
        // Få en forbindelse fra databasepoolen
        const pool = await poolPromise;
        // Udfør en forespørgsel for at slette brugeren baseret på bruger-ID
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('DELETE FROM Nutri.Users WHERE userId = @userId');
        // Returnerer antallet af rækker, der blev påvirket af sletningen
        return result.rowsAffected[0];
    }

    // Henter brugerens ernæringsdata time for time fra de seneste 24 timer
    async getHourlyNutrition(userId) {
        // Få en forbindelse fra databasepoolen
        const pool = await poolPromise;
        // Definerer en SQL-forespørgsel for at hente ernæringsdata time for time
        const query = `
        SELECT 
            DATEPART(HOUR, ir.datetime) AS Hour,
            SUM(ir.TotalCalories) AS Energy,
            SUM(ir.waterVolume) AS Water,
            ISNULL(SUM(ar.caloriesBurned), 0) + (u.BMR / 24) AS CaloriesBurned
        FROM Nutri.intake_records ir
        INNER JOIN Nutri.Users u ON u.UserId = ir.userId
        LEFT JOIN Nutri.activity_records ar ON ar.userId = ir.userId
            AND DATEPART(HOUR, ar.recordedAt) = DATEPART(HOUR, ir.datetime)
        WHERE ir.userId = @userId
            AND ir.datetime >= DATEADD(HOUR, -24, GETDATE())
        GROUP BY DATEPART(HOUR,  ir.datetime), u.BMR;
    `;

        // Udfør forespørgslen med bruger-ID som input
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(query);
        // Returnerer alle resultaterne fra forespørgslen
        return result.recordset;
    }

    // Henter brugerens ernæringsdata dagligt fra de seneste 30 dage
    async getDailyNutrition(userId) {
        // Få en forbindelse fra databasepoolen
        const pool = await poolPromise;
        // Definerer en SQL-forespørgsel for at hente ernæringsdata dagligt
        const query = `
            SELECT 
                CONVERT(date, ir.datetime) as Date,
                SUM(ir.TotalCalories) as TotalEnergy,
                SUM(ir.waterVolume) as TotalWater,
                SUM(ar.caloriesBurned) + u.BMR as TotalCaloriesBurned
            FROM Nutri.intake_records ir
            INNER JOIN Nutri.Users u ON u.UserId = ir.userId
            LEFT JOIN Nutri.activity_records ar ON ar.userId = ir.userId AND CONVERT(date, ar.recordedAt) = CONVERT(date, ir.datetime)
            WHERE ir.userId = @userId AND ir.datetime >= DATEADD(DAY, -30, GETDATE())
            GROUP BY CONVERT(date, ir.datetime), u.BMR;
        `;
        // Udfør forespørgslen med bruger-ID som input
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(query);
        // Returnerer alle resultaterne fra forespørgslen
        return result.recordset;
    }
}

// Eksporterer User-klassen, så den kan bruges andre steder i projektet
module.exports = User;
