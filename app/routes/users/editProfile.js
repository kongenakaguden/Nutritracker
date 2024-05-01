const express = require('express');
const router = express.Router();
const editProfileController = require('../../views/controllers/editProfileController');


router.put('/update-profile', editProfileController.updateProfile);

// Route for rendering the edit profile page
//router.get('/edit-profile', editProfileController.renderEditProfile);

// Route for updating the profile

module.exports = router;
