//index.js
const express = require('express');
const router = express.Router();

// Import other route files
const activityRouter = require('./activityTracker/activityRoutes');
const mealTrackerRouter = require('./mealTracker/mealTrackerRoutes');
const newMealRouter = require('./newMeal/newMealRoutes'); 
const mealOverviewRouter = require('./mealOverview/mealOverviewRoutes'); 
const createUserRouter = require('./users/create');
const loginUserRouter = require('./users/login');
const logoutRouter = require('./users/logout');
const profileRouter = require('./users/profile');
const editProfileRouter = require('./users/editProfile'); // Add the route for editing profile
const deleteRouter = require('./users/delete');
const dailyRouter = require('./dailyRoutes/dailyRoutes');



// Mount route files
router.use('/activity', activityRouter);
router.use('/meal-tracker', mealTrackerRouter);
router.use('/new-meal', newMealRouter); 
router.use('/meal-overview', mealOverviewRouter);
router.use('/users', createUserRouter);
router.use('/users', loginUserRouter);
router.use('/users', logoutRouter); // Mount the logout route
router.use('/users', profileRouter);
router.use('/users', editProfileRouter);
router.use('/users', deleteRouter);
router.use('/daily', dailyRouter);


module.exports = router;
