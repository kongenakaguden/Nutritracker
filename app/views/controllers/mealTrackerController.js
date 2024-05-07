const Meal = require('../../views/models/Meal'); // Adjust the path as necessary
const IntakeRecord = require('../../views/models/IntakeRecord'); // Adjust the path as necessary


exports.getUserMeals = async (req, res) => {
  const userId = req.session.user.userId;  // ensure consistency in userId capitalization
  const meal = new Meal();

  try {
      const meals = await meal.getUserMeals(userId);
      console.log('Fetched user meals successfully');
      res.status(200).json({ message: 'Fetched user meals successfully', meals });
  } catch (err) {
      console.error('Error fetching user meals:', err);
      res.status(500).json({ message: 'Error fetching user meals', error: err });
  }
};

exports.trackMeal = async (req, res) => {
  const { mealId, weight, datetime, waterVolume, waterDatetime, location, totalCalories } = req.body; // Include waterVolume and waterDatetime
  const userId = req.session.user.userId; // Again, ensure consistency in userId capitalization
  console.log('Received datetime:', datetime); // Log the datetime value

  const meal = new Meal();

  try {
      // Track the meal
      const result = await meal.trackMeal(mealId, userId, weight, datetime, waterVolume, waterDatetime, location, totalCalories); // Pass waterVolume and waterDatetime to trackMeal function
      console.log('Tracked meal successfully');
      res.status(200).send({ message: 'Tracked meal successfully' });
  } catch (err) {
      console.error('Error tracking meal:', err);
      res.status(500).send({ message: 'Error tracking meal', error: err });
  }
};


exports.getIntakeRecords = async (req, res) => {
  const userId = req.session.user.userId;
  const intakeRecord = new IntakeRecord();

  try {
      const records = await intakeRecord.getIntakeRecords(userId);
      console.log('Fetched intake records successfully');
      res.status(200).send({
          message: 'Fetched intake records successfully',
          intakeRecords: records
      });
  } catch (err) {
      console.error('Failed to fetch intake records:', err);
      res.status(500).send({
          message: 'Failed to fetch intake records',
          error: err
      });
  }
};

exports.trackIngredient = async (req, res) => {
  const userId = req.session.user && req.session.user.userId;  // Safely access UserId from session
  if (!userId) {
      return res.status(401).send({ message: 'User not authenticated' });
  }

  const { ingredient, weight, nutrients, datetime, location, totalCalories } = req.body;

  try {
      const intakeRecord = new IntakeRecord();
      await intakeRecord.trackIngredient(userId, ingredient, weight, nutrients, datetime, location, totalCalories);
      console.log('Ingredient tracked successfully');
      res.status(200).send({ message: 'Ingredient tracked successfully' });
  } catch (err) {
      console.error('Error tracking ingredient:', err);
      res.status(500).send({ message: 'Error tracking ingredient', error: err });
  }
};
