const express = require('express');
const router = express.Router();
const activityController = require('../../views/controllers/activityController');

// Route to post a new activity
router.post('/track', activityController.trackActivity);

module.exports = router;
