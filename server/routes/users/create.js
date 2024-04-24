// routes/users/create.js

const express = require('express');
const router = express.Router();
const createController = require('./createController');

// Route for user creation
router.post('/create', createController.createUser);

module.exports = router;
