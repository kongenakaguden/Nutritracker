// server.js
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
  host: 'jatakserver.database.windows.net', // Replace 'localhost' with your database host
  user: 'Viggo@jatakserver',      // Replace 'root' with your database username
  password: 'Vhx76dre.',  // Replace 'password' with your database password
  database: 'NutriTracker' // Replace 'your_database_name' with your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;

// Serve static files from the 'images' folder first
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Define a route to serve your index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Use bodyParser middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define a route to handle profile creation form submission
app.post('/create-profile', (req, res) => {
    try {
        const { username, email, password, weight, age, gender } = req.body;

        // TODO: Insert the user's details into the database using SQL queries
        
        // Placeholder response
        res.status(200).json({ message: 'Profile created successfully' });
    } catch (error) {
        console.error('Error handling profile creation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
