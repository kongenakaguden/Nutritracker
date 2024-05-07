const express = require('express');
const router = express.Router();
const { deleteUser } = require('../../views/controllers/deleteProfileController');  // Adjust the path as necessary

router.post('/delete', deleteUser);

module.exports = router;
