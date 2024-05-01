// routes/logout.js

const express = require('express');
const router = express.Router();
const { logout } = require('../../views/controllers/logoutController');

router.post('/logout', logout);

module.exports = router;