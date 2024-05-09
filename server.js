const express = require('express');
const session = require('express-session');
const path = require('path');
const { poolPromise } = require('./config/config');
const setUser = require('./app/views/auth/setUser'); // Update the path to the setUser middleware


const app = express();

app.use(session({
  secret: '123',  // En hemmelighed bruges til at signere session-cookie, hvilket øger sikkerheden
  resave: false,  // Sikrer at sessionen ikke gemmes igen, hvis der ikke er lavet ændringer
  saveUninitialized: false,  // Sikrer at ingen session bliver gemt, før den er initialiseret
  cookie: {
      maxAge: 3600000  // Angiver en tidsgrænse på 1 time for sessionens gyldighed
  }
}));

// Middleware to extract user information from session
app.use(setUser);

// Set loggedIn variable in res.locals based on session status
app.use((req, res, next) => {
  res.locals.loggedIn = !!req.session.user;  // More explicit check
  next();
});


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.set('view engine', 'ejs');

const viewsPath = path.join(__dirname, './app', 'views');

app.set('views', viewsPath);
const routes = require('./app/routes');

app.use('/', routes);
// Serve static files from the 'views' directory
app.get('/', (req, res) => {
  res.render('index', { loggedIn: req.session.loggedIn });
});

app.get('/meal-creator', (req, res) => {
  res.render('mealCreator', { loggedIn: req.session.loggedIn });
});

app.get('/meal-tracker', (req, res) => {
  res.render('mealTracker', { loggedIn: req.session.loggedIn });
});

app.get('/activity-tracker', (req, res) => {
  res.render('activityTracker', { loggedIn: req.session.loggedIn });
});

app.get('/food-inspector', (req, res) => {
  res.render('foodInspector', { loggedIn: req.session.loggedIn });
});

app.get('/nutri-report', (req, res) => {
  res.render('nutriReport', { loggedIn: req.session.loggedIn });
});

app.get('/login', (req, res) => {
  res.render('login', { loggedIn: req.session.loggedIn });
});

app.get('/profile', (req, res) => {
  res.render('profile', { loggedIn: req.session.loggedIn });
});

app.get('/create-user', (req, res) => {
  res.render('createUser', { loggedIn: req.session.loggedIn });
});

app.get('/new-meal', (req, res) => {
  res.render('newMeal', { loggedIn: req.session.loggedIn });
});

app.get('/registration', (req, res) => {
  res.render('registration', { loggedIn: req.session.loggedIn });
});

app.get('/edit-profile', (req, res) => {
  res.render('editProfile', { loggedIn: req.session.loggedIn });
});


// Define routes


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});