const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the 'images' directory first
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Define a route to serve your index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveren kører på localhost:${PORT}`);
});
