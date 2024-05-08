// Importér Express-frameworket
const express = require('express');

// Opret en ny router ved hjælp af Express' router-objekt
const router = express.Router();

// Importere controlleren, der håndterer logikken for måltidsoverblik
const mealOverviewController = require('../../views/controllers/mealOverviewController');

// Definere en GET-rute for '/meals'
// Når en GET-anmodning sendes til denne rute, vil metoden 'fetchMeals' fra 'mealOverviewController' håndtere anmodningen
router.get('/meals', mealOverviewController.fetchMeals);

// Eksportere routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
