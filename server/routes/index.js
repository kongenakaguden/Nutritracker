const express = require('express');
const router = express.Router();

// Import other route files
const registerRouter = require('./register/register');
const loginRouter = require('./login/loginRoutes');
const activityRouter = require('./activityTracker/activityRoutes');
const mealTrackerRouter = require('./mealTracker/mealTrackerRoutes');
const newMealRouter = require('./newMeal/newMealRoutes'); // Import newMealRoutes module from the newMeal folder
const ingredientsRouter = require('./ingredients/IngredientRoutes');
const mealOverviewRouter = require('./mealOverview/mealOverviewRoutes'); // Import mealOverviewRoutes module

// Mount route files
router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/activity', activityRouter);
router.use('/meal-tracker', mealTrackerRouter);
router.use('/new-meal', newMealRouter); // Mount newMealRoutes under /new-meal path
router.use('/ingredients', ingredientsRouter);
router.use('/meal-overview', mealOverviewRouter); // Mount mealOverviewRoutes under /meal-overview path

module.exports = router;
