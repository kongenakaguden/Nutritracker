// newMealRoutes.js

// Importere Express-frameworket
const express = require('express');

// Opret en ny router ved hjælp af Express router-objekt
const router = express.Router();

// Importere controlleren, der håndterer logikken for nye måltider
const newMealController = require('../../views/controllers/newMealController');

// Definere en POST-rute for '/saveMeal'
// Når en POST-anmodning sendes til denne rute, vil 'saveMeal'-metoden i 'newMealController' gemme måltidsdata i databasen
router.post('/saveMeal', newMealController.saveMeal);

// Eksportere routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
