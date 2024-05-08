// Importere Express-frameworket
const express = require('express');

// Opret en ny router ved hjælp af Express router-objekt
const router = express.Router();

// Importere controlleren, der håndterer logikken for sporing af måltider og ingredienser
const mealTrackerController = require('../../views/controllers/mealTrackerController');

// Definere en POST-rute for '/track-ingredient'
// Når en POST-anmodning sendes til denne rute, vil 'trackIngredient'-metoden i 'mealTrackerController' håndtere sporing af en ingrediens
router.post('/track-ingredient', mealTrackerController.trackIngredient);

// Definere en POST-rute for '/track-meal'
// Når en POST-anmodning sendes til denne rute, vil 'trackMeal'-metoden i 'mealTrackerController' håndtere sporing af et måltid
router.post('/track-meal', mealTrackerController.trackMeal);

// Definere en GET-rute for '/meals'
// Når en GET-anmodning sendes til denne rute, vil 'getUserMeals'-metoden i 'mealTrackerController' returnere brugerens måltider
router.get('/meals', mealTrackerController.getUserMeals);

// Definere en GET-rute for '/intake-records'
// Når en GET-anmodning sendes til denne rute, vil 'getIntakeRecords'-metoden i 'mealTrackerController' returnere brugerens indtagelsesposter
router.get('/intake-records', mealTrackerController.getIntakeRecords);

// Deaktiverede ruter til sletning og opdatering af poster, markeret som kommentarer
// Ruten til at slette en bestemt post baseret på dens 'recordId'
// router.delete('/delete-record/:recordId', mealTrackerController.deleteRecord);

// Ruten til at opdatere en bestemt post baseret på dens 'recordId'
// router.put('/update-record/:recordId', mealTrackerController.updateRecord);

// Eksportér routeren, så den kan bruges i andre dele af applikationen
module.exports = router;