// index.js

const express = require('express');
const router = express.Router();

// Import other route files
const activityRouter = require('./activityTracker/activityRoutes');
const mealTrackerRouter = require('./mealTracker/mealTrackerRoutes');
const newMealRouter = require('./newMeal/newMealRoutes'); 
const mealOverviewRouter = require('./mealOverview/mealOverviewRoutes'); 
const createUserRouter = require('./users/create');
const loginUserRouter = require('./users/login');
const profileRouter = require('./users/profile');

// Mount route files
router.use('/activity', activityRouter);
router.use('/meal-tracker', mealTrackerRouter);
router.use('/new-meal', newMealRouter); 
router.use('/meal-overview', mealOverviewRouter);
router.use('/users', createUserRouter);
router.use('/users', loginUserRouter);
router.use('/users', profileRouter);


module.exports = router;
