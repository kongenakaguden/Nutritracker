// newMealRoutes.js

const express = require('express');
const router = express.Router();
const newMealController = require('../../views/controllers/newMealController');

// Route to save meal data to the database
router.post('/saveMeal', newMealController.saveMeal);

module.exports = router;