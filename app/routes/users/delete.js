// Importere Express-frameworket for at oprette en router
const express = require('express');

// Opret en ny router ved hjælp af Express router-objekt
const router = express.Router();

// Importere funktionen 'deleteUser' fra 'deleteProfileController' til at håndtere sletning af brugere
// Kontroller, at stien til controlleren er korrekt
const { deleteUser } = require('../../views/controllers/deleteProfileController');  // Justér stien om nødvendigt

// Definere en POST-rute for '/delete'
// Når en POST-anmodning sendes til denne rute, vil 'deleteUser'-funktionen blive kaldt for at håndtere sletningen
router.post('/delete', deleteUser);

// Eksportere routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
