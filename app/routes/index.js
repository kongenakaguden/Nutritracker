// index.js

// Importere Express-frameworket for at oprette en router
const express = require('express');

// Opret en ny router ved hjælp af Express' router-objekt
const router = express.Router();

// Importere rute-filer fra forskellige moduler
const activityRouter = require('./activityTracker/activityRoutes');
const mealTrackerRouter = require('./mealTracker/mealTrackerRoutes');
const newMealRouter = require('./newMeal/newMealRoutes'); 
const mealOverviewRouter = require('./mealOverview/mealOverviewRoutes'); 
const createUserRouter = require('./users/create');
const loginUserRouter = require('./users/login');
const logoutRouter = require('./users/logout'); // Tilføj logout-ruten
const profileRouter = require('./users/profile');
const editProfileRouter = require('./users/editProfile'); // Tilføj ruten for at redigere profiler
const deleteRouter = require('./users/delete');
const dailyRouter = require('./dailyRoutes/dailyRoutes');

// Monter rute-filerne under de angivne basisstier
// Ruterne under '/activity' håndteres af activityRouter
router.use('/activity', activityRouter);

// Ruterne under '/meal-tracker' håndteres af mealTrackerRouter
router.use('/meal-tracker', mealTrackerRouter);

// Ruterne under '/new-meal' håndteres af newMealRouter
router.use('/new-meal', newMealRouter);

// Ruterne under '/meal-overview' håndteres af mealOverviewRouter
router.use('/meal-overview', mealOverviewRouter);

// Monter brugerruter (create, login, logout, profil) under '/users'
router.use('/users', createUserRouter);
router.use('/users', loginUserRouter);
router.use('/users', logoutRouter);
router.use('/users', profileRouter);
router.use('/users', editProfileRouter);
router.use('/users', deleteRouter);

// Monter daglige rutiner under '/daily'
router.use('/daily', dailyRouter);

// Eksportere routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
