const express = require('express');
const router = express.Router();
const dailyController = require('../../views/controllers/dailyController');

router.get('/hourly', dailyController.getHourlyNutrition);

router.get('/daily', dailyController.getDailyNutrition);

module.exports = router;