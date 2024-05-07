//user.js

const sql = require('mssql');
const bcrypt = require('bcrypt');
const { poolPromise } = require('../../../config/config');

class User {
    async checkUserExists(email) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query('SELECT 1 FROM Nutri.Users WHERE email = @email');
        return result.recordset.length > 0;
    }

    async createUser(userData) {
        const { username, email, password, weight, age, gender } = userData;
        const pool = await poolPromise;

        if (await this.checkUserExists(email)) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const bmr = this.calculateBMR(weight, age, gender);

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

    calculateBMR(weight, age, gender) {
        const normalizedGender = gender.toLowerCase();
        if (normalizedGender === 'male') {
            return 88.362 + (13.397 * weight) + (4.799 * 180) - (5.677 * age);
        } else if (normalizedGender === 'female') {
            return 447.593 + (9.247 * weight) + (3.098 * 160) - (4.330 * age);
        }
        return null;
    }

    async fetchProfile(userId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM Nutri.Users WHERE UserId = @userId');
        return result.recordset[0]; // Assuming UserId is unique and only one record should be returned
    }

    async updateProfile(userId, profileData) {
        const { username, email, weight, age, gender } = profileData;
        const pool = await poolPromise;
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
                    gender = @gender
                WHERE UserId = @userId
            `);
        return result.rowsAffected[0]; // This will return the number of affected rows
    }

    async verifyUserCredentials(username, password) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .query('SELECT * FROM Nutri.Users WHERE username = @username');

        if (result.recordset.length === 0) {
            return null; // No user found
        }

        const user = result.recordset[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        return passwordMatch ? user : null;
    }

    async deleteUser(userId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('DELETE FROM Nutri.Users WHERE userId = @userId');
        return result.rowsAffected[0]; // This will return the number of rows affected
    }

    async getHourlyNutrition(userId) {
        const pool = await poolPromise;
        const query = `
            SELECT 
                DATEPART(HOUR, ir.datetime) as Hour,
                SUM(ir.TotalCalories) as Energy,
                SUM(ir.waterVolume) as Water,
                SUM(ar.caloriesBurned) + (u.BMR / 24) as CaloriesBurned
            FROM Nutri.intake_records ir
            INNER JOIN Nutri.Users u ON u.UserId = ir.userId
            LEFT JOIN Nutri.activity_records ar ON ar.userId = ir.userId AND DATEPART(HOUR, ar.recordedAt) = DATEPART(HOUR, ir.datetime)
            WHERE ir.userId = @userId AND ir.datetime >= DATEADD(HOUR, -24, GETDATE())
            GROUP BY DATEPART(HOUR, ir.datetime), u.BMR;
        `;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(query);
        return result.recordset;
    }
    
    
    

    async getDailyNutrition(userId) {
        const pool = await poolPromise;
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
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(query);
        return result.recordset;
    }
    
    
    



}

module.exports = User;
