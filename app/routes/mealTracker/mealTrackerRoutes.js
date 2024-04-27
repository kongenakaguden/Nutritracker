const express = require('express');
const router = express.Router();

// Placeholder arrays for storing data (Replace this with database logic later)
let recipes = [];
let intakeRecords = [];

// Route to add a new intake record
router.post('/track-meal', (req, res) => {
  const newRecord = req.body;
  newRecord.id = intakeRecords.length + 1; // Temporary ID generation
  intakeRecords.push(newRecord);
  res.json(newRecord);
});

// Route to delete a record
router.delete('/delete-record/:recordId', (req, res) => {
  const recordId = parseInt(req.params.recordId);
  intakeRecords = intakeRecords.filter(record => record.id !== recordId);
  res.sendStatus(200);
});

// Route to get all recipes
router.get('/recipes', (req, res) => {
  res.json(recipes);
});

// Route to get all intake records
router.get('/intake-records', (req, res) => {
  res.json(intakeRecords);
});

module.exports = router;
