const express = require('express');
const app = express();
const path = require('path');
const { connectToDatabase } = require('./config/db');
const routes = require('./app/routes');

const activityRoutes = require('./app/routes/activityTracker/activityRoutes');
const mealTrackerRoutes = require('./app/routes/mealTracker/mealTrackerRoutes');
const newMealRouter = require('./app/routes/newMeal/newMealRoutes');
const mealOverviewRouter = require('./app/routes/mealOverview/mealOverviewRoutes');
const createUserRouter = require('./app/routes/users/create');
const loginUserRouter = require('./app/routes/users/login');
const profileRouter = require('./app/routes/users/profile');

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());

app.set('view engine', 'ejs');

const viewsPath = path.join(__dirname, './app', 'views');

app.set('views', viewsPath);


// Serve static files from the 'views' directory

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/meal-creator', (req, res) => {
  res.render('mealCreator');
});

app.get('/meal-tracker', (req, res) => {
  res.render('mealTracker');
});

app.get('/activity-tracker', (req, res) => {
  res.render('activityTracker');
});

app.get('/food-inspector', (req, res) => {
  res.render('foodInspector');
});

app.get('/nutri-report', (req, res) => {
  res.render('nutriReport');
});


// Use routes
app.use('/', routes);
app.use('/activity', activityRoutes);
app.use('/meal-tracker', mealTrackerRoutes);
app.use('/meals', newMealRouter);
app.use('/meal-overview', mealOverviewRouter);
app.use('/users', createUserRouter);
app.use('/users', loginUserRouter);
app.use('/users', profileRouter);

connectToDatabase();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
