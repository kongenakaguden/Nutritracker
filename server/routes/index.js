const express = require('express');
const router = express.Router();

// Import other route files
const registerRouter = require('./register/register');
const loginRouter = require('./login/loginRoutes');
const activityRouter = require('./activityTracker/activityRoutes');
const mealTrackerRouter = require('./mealTracker/mealTrackerRoutes');
const newMealRouter = require('./newMeal/newMealRoutes'); // Import newMealRoutes module from the newMeal folder
const ingredientsRouter = require ('./ingredients/IngredientRoutes')

// Mount route files
router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/activity', activityRouter);
router.use('/meal-tracker', mealTrackerRouter);
router.use('/new-meal', newMealRouter); // Mount newMealRoutes under /new-meal path
router.use('/ingredients', ingredientsRouter);

module.exports = router;
