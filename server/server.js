const express = require('express');
const path = require('path');
const { connectToDatabase } = require('./db');
const routes = require('./routes'); // Import index.js
const activityRoutes = require('./routes/activityRoutes'); // Import activityRoutes module

const app = express();

// Connect to the database
connectToDatabase();

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Use routes
app.use('/', routes); // Use index.js
app.use('/activity', activityRoutes); // Use the activity routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
