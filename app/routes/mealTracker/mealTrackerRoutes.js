const express = require('express');
const router = express.Router();
const mealTrackerController = require('../../views/controllers/mealTrackerController');

router.post('/track-ingredient', mealTrackerController.trackIngredient);
router.post('/track-meal', mealTrackerController.trackMeal);
router.get('/meals', mealTrackerController.getUserMeals);
router.get('/intake-records', mealTrackerController.getIntakeRecords);


//router.delete('/delete-record/:recordId', mealTrackerController.deleteRecord);//
//router.put('/update-record/:recordId', mealTrackerController.updateRecord);//

module.exports = router;