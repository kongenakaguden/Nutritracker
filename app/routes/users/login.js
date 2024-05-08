// Importér Express-frameworket for at oprette en router
const express = require('express');

// Opret en ny router ved hjælp af Express' router-objekt
const router = express.Router();

// Importér controlleren, der håndterer login-logikken
const loginController = require('../../views/controllers/loginController');

// Definer en POST-rute for '/login'
// Når en POST-anmodning sendes til denne rute, vil 'login'-metoden i 'loginController' blive kaldt for at håndtere brugerens login
// Bemærk: Der er tilføjet et fremadskråstreg (/) før 'login' for at sikre, at ruten begynder korrekt
router.post('/login', loginController.login);

// Eksportér routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
