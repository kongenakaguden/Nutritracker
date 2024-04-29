// routes/users/logout.js

const express = require('express');
const router = express.Router();
const logoutController = require('../../views/controllers/logoutController');

// Route for user logout
router.get('/logout', logoutController.logout);

module.exports = router;
