const express = require('express');
const router = express.Router();
const loginController = require('./loginController');

// Route for user login:
router.post('/login', loginController.login); // Add a forward slash before 'login'

module.exports = router;
