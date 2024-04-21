const express = require('express');
const path = require('path');
const { connectToDatabase } = require('./db');
const routes = require('./routes'); // Import index.js
const activityRoutes = require('./routes/activityTracker/activityRoutes'); // Import activityRoutes module
const mealTrackerRoutes = require('./routes/mealTracker/mealTrackerRoutes'); // Import mealTrackerRoutes module
const newMealRouter = require('./routes/newMeal/newMealRoutes'); // Import newMealRoutes module
const ingredientRouter = require('./routes/ingredients/IngredientRoutes'); 
const mealOverviewRouter = require('./routes/mealOverview/mealOverviewRoutes'); // Import mealOverviewRoutes module

const app = express();

app.use(express.json());

// Connect to the database
connectToDatabase();

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Use routes
app.use('/', routes); // Use index.js
app.use('/activity', activityRoutes); // Use the activity routes
app.use('/meal-tracker', mealTrackerRoutes); // Use the meal tracker routes
app.use('/meals', newMealRouter); // Use the meal tracker routes
app.use('/meal-overview', mealOverviewRouter); // Use mealOverviewRoutes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
