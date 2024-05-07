const express = require('express');
const router = express.Router();
const editProfileController = require('../../views/controllers/editProfileController');

// Route for updating the profile
router.put('/update-profile', editProfileController.updateProfile);

// Route for rendering the edit profile page
router.get('/edit-profile', editProfileController.renderEditProfile);

module.exports = router;
