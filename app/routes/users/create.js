// routes/users/create.js

// Importere Express-frameworket for at oprette en router
const express = require('express');

// Opret en ny router ved hjælp af Express router-objekt
const router = express.Router();

// Importere controlleren, der indeholder logikken for at oprette brugere
const createController = require('../../views/controllers/createController');

// Definere en POST-rute for '/create'
// Når en POST-anmodning sendes til denne rute, vil 'createUser'-metoden i 'createController' blive kaldt for at håndtere brugeroprettelse
router.post('/create', createController.createUser);

// Eksportere routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
