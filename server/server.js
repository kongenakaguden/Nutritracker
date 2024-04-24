//server.js
const express = require('express');
const path = require('path');
const { connectToDatabase } = require('./db');
const routes = require('./routes');


const activityRoutes = require('./routes/activityTracker/activityRoutes');
const mealTrackerRoutes = require('./routes/mealTracker/mealTrackerRoutes');
const newMealRouter = require('./routes/newMeal/newMealRoutes');
const mealOverviewRouter = require('./routes/mealOverview/mealOverviewRoutes');
const createUserRouter = require('./routes/users/create');
const loginUserRouter = require('./routes/users/login');


const app = express();

app.use(express.json());

connectToDatabase();

app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Use routes
app.use('/', routes);
app.use('/activity', activityRoutes);
app.use('/meal-tracker', mealTrackerRoutes);
app.use('/meals', newMealRouter);
app.use('/meal-overview', mealOverviewRouter);
app.use('/users', createUserRouter,);
app.use('/users', loginUserRouter,);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
