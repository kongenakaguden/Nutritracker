// Importere Express-frameworket for at oprette en router
const express = require('express');

// Opret en ny router ved hjælp af Express router-objekt
const router = express.Router();

// Importere controlleren, der indeholder logikken for at redigere brugerprofiler
const editProfileController = require('../../views/controllers/editProfileController');

// Definere en PUT-rute for '/update-profile'
// Når en PUT-anmodning sendes til denne rute, vil 'updateProfile'-metoden i 'editProfileController' håndtere opdatering af brugerens profil
router.put('/update-profile', editProfileController.updateProfile);

// Definere en GET-rute for '/edit-profile'
// Når en GET-anmodning sendes til denne rute, vil 'renderEditProfile'-metoden i 'editProfileController' returnere redigeringssiden for brugerens profil
router.get('/edit-profile', editProfileController.renderEditProfile);

// Eksportere routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
