const sql = require('mssql');
const { poolPromise } = require('../../../config/config');



exports.getUserMeals = async (req, res) => {
    const userId = req.session.user.UserId;
  
    try {
        const pool = await poolPromise;
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM Nutri.Meals WHERE UserId = @userId');
      
      console.log('Fetched user meals successfully');
      res.status(200).send({ message: 'Fetched user meals successfully', meals: result.recordset });
    } catch (err) {
      console.error('Error fetching user meals:', err);
      res.status(500).send({ message: 'Error fetching user meals', error: err });
    }
  };

  exports.trackMeal = async (req, res) => {
    const { mealId, weight, datetime } = req.body;
    const userId = req.session.user.UserId;  // Get userId from session
  
    // Check that datetime is defined and is a string
    if (typeof datetime !== 'string') {
      console.error('Invalid or missing datetime');
      return res.status(400).send({ message: 'Invalid or missing datetime' });
    }
  
    // Format datetime string
    const formattedDateTime = datetime.replace("T", " ");
  
    try {
        const pool = await poolPromise;
      const mealResult = await pool.request()
        .input('id', sql.Int, mealId)  // Changed 'mealId' to 'id'
        .query('SELECT * FROM Nutri.Meals WHERE id = @id');  // Changed 'mealId' to 'id'
  
      if (!mealResult.recordset || !mealResult.recordset.length) {
        return res.status(404).send({ message: 'Meal not found' });
      }
  
      const meal = mealResult.recordset[0];
      const ingredients = JSON.parse(meal.ingredients);
      let totalCalories = 0;
  
      for (let ingredient of ingredients) {
        totalCalories += ingredient.nutrients.kalorier * weight;
      }
  
      const trackResult = await pool.request()
        .input('mealId', sql.Int, mealId)
        .input('weight', sql.Int, weight)
        .input('datetime', sql.NVarChar, formattedDateTime)  // Use formattedDateTime
        .input('userId', sql.Int, userId)
        .input('totalCalories', sql.Int, totalCalories)
        .query(`
          INSERT INTO Nutri.intake_records (mealId, Weight, datetime, UserId, TotalCalories)
          VALUES (@mealId, @weight, @datetime, @userId, @totalCalories)
        `);
  
      console.log('Tracked meal successfully');
      res.status(200).send({ message: 'Tracked meal successfully', meal: trackResult.recordset });
    } catch (err) {
      console.error('Error tracking meal:', err);
      res.status(500).send({ message: 'Error tracking meal', error: err });
    }
  };

  exports.trackIngredient = async (req, res) => {
    const userId = req.session.user && req.session.user.UserId;  // Safely access UserId from session
    if (!userId) {
        return res.status(401).send({ message: 'User not authenticated' });
    }

    const { ingredient, weight, nutrients, datetime, location, totalCalories } = req.body;
  
    try {
        const pool = await poolPromise;
        const result = await pool.request()
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

        console.log('Ingredient tracked successfully');
        res.status(200).send({ message: 'Ingredient tracked successfully', data: result.recordset });
    } catch (err) {
        console.error('Error tracking ingredient:', err);
        res.status(500).send({ message: 'Error tracking ingredient', error: err });
    }
};


async function calculateNutrients(ingredient, weight) {
    // Placeholder: Assume you call another service or use a library to calculate nutrients
    return {
        protein: 0.1 * weight, // Example calculation
        carbs: 0.2 * weight,
        fats: 0.05 * weight
    };
}

function calculateCalories(nutrients) {
    // Placeholder: Simple calorie calculation
    return nutrients.protein * 4 + nutrients.carbs * 4 + nutrients.fats * 9;
};


exports.getIntakeRecords = async (req, res) => {
    const userId = req.session.user.UserId;

    try {
        const pool = await poolPromise; // Correct usage of pooled connection
        const query = `
            SELECT ir.*, m.name AS mealName
            FROM Nutri.intake_records ir
            JOIN Nutri.meals m ON ir.mealId = m.id
            WHERE ir.userId = @userId;
        `;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(query);
        
        console.log('Fetched intake records successfully');
        console.log('Intake records:', result.recordset);
        res.status(200).send({
            message: 'Fetched intake records successfully',
            intakeRecords: result.recordset
        });
    } catch (err) {
        console.error('Failed to fetch intake records:', err);
        res.status(500).send({
            message: 'Failed to fetch intake records',
            error: err
        });
    }
    // No finally block needed to close the pool
};