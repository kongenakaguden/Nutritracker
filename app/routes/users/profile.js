// routes/users/profile.js

const express = require('express');
const router = express.Router();
const profileController = require('../../views/controllers/profileController');

// Route for getting the profile (protected route)
router.get('/profile', profileController.getProfile);

// Route for updating the profile (protected route)
router.put('/profile', profileController.updateProfile);


module.exports = router;
