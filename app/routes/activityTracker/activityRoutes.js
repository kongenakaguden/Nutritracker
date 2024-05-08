// Import Express-frameworket
const express = require('express');

// Opretter en ny router
const router = express.Router();

// Importer controlleren, som indeholder funktioner til at håndtere logik for denne rute
const activityController = require('../../views/controllers/activityController');

// Definere en POST-rute ved '/track'
// Når en POST-anmodning modtages på denne rute, vil 'trackActivity'-metoden fra 'activityController' blive kaldt
router.post('/track', activityController.trackActivity);

// Eksportere routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
