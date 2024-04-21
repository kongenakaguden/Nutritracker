//ingredientRoutes.js//
const express = require('express');
const router = express.Router();
const ingredientController = require('./ingredientController');

// GET route to fetch ingredients
router.get('/', ingredientController.fetchIngredients);

module.exports = router;
