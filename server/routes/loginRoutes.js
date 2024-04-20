// loginRoutes.js

// Import express module
const express = require('express');
// Create a new router instance
const router = express.Router();

// Define a POST route to handle user login
router.post('/login', async (req, res) => {
  try {
    // Extract username and password from the request body
    const { username, password } = req.body;

    // Validate username/email and password
    // For demonstration purposes, we'll just check if the username and password are provided
    if (!username || !password) {
      // If username or password is missing, send a 400 Bad Request response with an error message
      return res.status(400).json({ message: 'Username/email and password are required' });
    }

    // Assuming authentication is successful,
    // Send a response indicating successful login with a status code of 200 OK
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    // If an error occurs during the login process,
    // Log the error to the console and send a 500 Internal Server Error response with an error message
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Export the router to make it accessible to other parts of the application
module.exports = router;
