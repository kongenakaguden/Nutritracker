const express = require('express');
const router = express.Router();
const mealOverviewController = require('./mealOverviewController');

// Route to fetch meals for overview
router.get('/meals', mealOverviewController.fetchMeals);

module.exports = router;
