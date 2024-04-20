const express = require('express');
const router = express.Router();

// Import other route files
const registerRouter = require('./register');
const loginRouter = require('./loginRoutes');
const activityRouter = require('./activityRoutes'); // Import activityRoutes module

// Mount route files
router.use('/register', registerRouter);
router.use('/login', loginRouter); // Mount loginRouter under /login path
router.use('/activity', activityRouter); // Mount activityRouter under /activity path

module.exports = router;
