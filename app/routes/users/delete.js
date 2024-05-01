// routes/users/delete.js

const express = require('express');
const router = express.Router();
const { deleteProfile } = require('../../views/controllers/deleteProfileController');

router.post('/delete', deleteProfile);

module.exports = router;