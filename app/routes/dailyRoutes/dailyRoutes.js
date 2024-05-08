// Importér Express-frameworket
const express = require('express');

// Opreter en ny router ved hjælp af Express router-objekt
const router = express.Router();

// Importere controlleren, der håndterer logikken for ernæringsdata
const dailyController = require('../../views/controllers/dailyController');

// Definere en GET-rute for '/hourly'
// Når en GET-anmodning sendes til denne rute, vil metoden 'getHourlyNutrition' fra 'dailyController' håndtere anmodningen
router.get('/hourly', dailyController.getHourlyNutrition);

// Definere en GET-rute for '/daily'
// Når en GET-anmodning sendes til denne rute, vil metoden 'getDailyNutrition' fra 'dailyController' håndtere anmodningen
router.get('/daily', dailyController.getDailyNutrition);

// Eksportér routeren, så den kan bruges i andre dele af applikationen
module.exports = router;