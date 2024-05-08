// routes/users/profile.js

// Importere Express-frameworket for at oprette en router
const express = require('express');

// Opret en ny router ved hjælp af Express' router-objekt
const router = express.Router();

// Importere controlleren, der håndterer logikken for brugerprofiler
const profileController = require('../../views/controllers/profileController');

// Definere en GET-rute for '/profile'
// Når en GET-anmodning sendes til denne rute, vil 'getProfile'-metoden i 'profileController' returnere brugerens profil
// Denne rute er være beskyttet, så det kun er den autoriserede brugere kan få adgang til profilen
router.get('/profile', profileController.getProfile);

// Eksportere routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
