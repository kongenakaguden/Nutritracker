// routes/logout.js

// Importere Express-frameworket for at oprette en router
const express = require('express');

// Opret en ny router ved hjælp af Express router-objekt
const router = express.Router();

// Importere logout-funktionen fra logoutController til at håndtere logik for brugerens logout
const { logout } = require('../../views/controllers/logoutController');

// Definere en POST-rute for '/logout'
// Når en POST-anmodning sendes til denne rute, vil 'logout'-funktionen håndtere brugerens logout
router.post('/logout', logout);

// Eksportere routeren, så den kan bruges i andre dele af applikationen
module.exports = router;