const express = require('express');
const path = require('path');
const mssql = require('mssql');
const app = express();

// MSSQL configuration
const config = {
  server: 'jatakserver.database.windows.net',
  user: 'Viggo@jatakserver',
  password: 'Studiegruppe123.',
  database: 'NutriTracker',
  options: {
    encrypt: true
  }
};

// Connect to MSSQL database
mssql.connect(config)
  .then(() => console.log('Connected to MSSQL database'))
  .catch(err => console.error('Error connecting to MSSQL database:', err));

// Serve static files from the 'images' folder first
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Use bodyParser middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define a route to serve your index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Define a route to handle POST requests for user registration
app.post('/register', async (req, res) => {
  try {
    // Extract data from the request body
    const { username, email, password, weight, age, gender } = req.body;

    // Perform SQL query to insert data into the database
    const query = `
      INSERT INTO Nutri.Users (username, email, password, weight, age, gender) 
      VALUES (@username, @email, @password, @weight, @age, @gender)
    `;
    const pool = await mssql.connect(config);
    const result = await pool.request()
      .input('username', mssql.VarChar, username)
      .input('email', mssql.VarChar, email)
      .input('password', mssql.VarChar, password)
      .input('weight', mssql.Float, weight)
      .input('age', mssql.Int, age)
      .input('gender', mssql.VarChar, gender)
      .query(query);

    // Send response indicating success
    res.status(200).send('User registered successfully');
  } catch (error) {
    // Handle errors
    console.error('Error registering user:', error);
    res.status(500).send('Internal server error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
