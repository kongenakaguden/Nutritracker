const express = require('express');
const session = require('express-session');
const path = require('path');
const { connectToDatabase } = require('./config/db');
const setUser = require('./app/views/auth/setUser'); // Update the path to the setUser middleware

const app = express();

// Configure session middleware
app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: true
}));

// Middleware to extract user information from session
app.use(setUser);

// Set loggedIn variable in res.locals based on session status
app.use((req, res, next) => {
  res.locals.loggedIn = req.session.loggedIn || false;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.set('view engine', 'ejs');

const viewsPath = path.join(__dirname, './app', 'views');

app.set('views', viewsPath);

// Serve static files from the 'views' directory

app.get('/', (req, res) => {
  console.log('Index route hit');
  res.render('index', { loggedIn: req.session.loggedIn });
});

app.get('/meal-creator', (req, res) => {
  res.render('mealCreator', { loggedIn: req.session.loggedIn });
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

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.get('/create-user', (req, res) => {
  res.render('createUser');
});

app.get('/new-meal', (req, res) => {
  res.render('newMeal');
});

app.get('/registration', (req, res) => {
  res.render('registration');
});

connectToDatabase();

// Define routes
const routes = require('./app/routes');
const activityRoutes = require('./app/routes/activityTracker/activityRoutes');
const mealTrackerRoutes = require('./app/routes/mealTracker/mealTrackerRoutes');
const newMealRouter = require('./app/routes/newMeal/newMealRoutes');
const mealOverviewRouter = require('./app/routes/mealOverview/mealOverviewRoutes');
const createUserRouter = require('./app/routes/users/create');
const loginUserRouter = require('./app/routes/users/login');
const profileRouter = require('./app/routes/users/profile');
const logoutRouter = require('./app/routes/users/logout');

app.use('/', routes);
app.use('/activity', activityRoutes);
app.use('/meal-tracker', mealTrackerRoutes);
app.use('/meals', newMealRouter);
app.use('/meal-overview', mealOverviewRouter);
app.use('/users', createUserRouter);
app.use('/users', loginUserRouter);
app.use('/users', logoutRouter);
app.use('/users', profileRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
