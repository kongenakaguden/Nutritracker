// Importér Meal- og IntakeRecord-modellerne fra de angivne stier
const Meal = require('../../views/models/Meal'); // Justér stien om nødvendigt
const IntakeRecord = require('../../views/models/IntakeRecord'); // Justér stien om nødvendigt

// Hent brugerens måltider
exports.getUserMeals = async (req, res) => {
  // Hent bruger-ID fra sessionen og sørg for korrekt store/små bogstaver
  const userId = req.session.user.userId;
  const meal = new Meal();

  try {
    // Hent brugerens måltider ved hjælp af modellen
    const meals = await meal.getUserMeals(userId);
    console.log('Fetched user meals successfully');
    // Returnér måltiderne med en succesmeddelelse
    res.status(200).json({ message: 'Fetched user meals successfully', meals });
  } catch (err) {
    // Log fejlen og returnér en 500-fejl
    console.error('Error fetching user meals:', err);
    res.status(500).json({ message: 'Error fetching user meals', error: err });
  }
};

// Spor et måltid
exports.trackMeal = async (req, res) => {
  // Ekstrahér måltidsdata fra anmodningens body
  const { mealId, weight, datetime, waterVolume, waterDatetime, location, totalCalories } = req.body;
  // Hent bruger-ID fra sessionen og sørg for korrekt store/små bogstaver
  const userId = req.session.user.userId;
  console.log('Received datetime:', datetime); // Log datetime for fejlfinding

  const meal = new Meal();

  try {
    // Spor måltidet ved hjælp af trackMeal-metoden
    const result = await meal.trackMeal(mealId, userId, weight, datetime, waterVolume, waterDatetime, location, totalCalories);
    console.log('Tracked meal successfully');
    // Returnér en succesmeddelelse
    res.status(200).send({ message: 'Tracked meal successfully' });
  } catch (err) {
    // Log fejlen og returnér en 500-fejl
    console.error('Error tracking meal:', err);
    res.status(500).send({ message: 'Error tracking meal', error: err });
  }
};

// Hent brugerens indtagelsesposter
exports.getIntakeRecords = async (req, res) => {
  // Hent bruger-ID fra sessionen
  const userId = req.session.user.userId;
  const intakeRecord = new IntakeRecord();

  try {
    // Hent indtagelsesposter ved hjælp af getIntakeRecords-metoden
    const records = await intakeRecord.getIntakeRecords(userId);
    console.log('Fetched intake records successfully');
    // Returnér posterne med en succesmeddelelse
    res.status(200).send({
      message: 'Fetched intake records successfully',
      intakeRecords: records
    });
  } catch (err) {
    // Log fejlen og returnér en 500-fejl
    console.error('Failed to fetch intake records:', err);
    res.status(500).send({
      message: 'Failed to fetch intake records',
      error: err
    });
  }
};

// Spor en ingrediens
exports.trackIngredient = async (req, res) => {
  // Sørg for at brugeren er autentificeret, ellers returnér en 401 Unauthorized-fejl
  const userId = req.session.user && req.session.user.userId;
  if (!userId) {
    return res.status(401).send({ message: 'User not authenticated' });
  }

  // Ekstrahér ingrediensdata fra anmodningens body
  const { ingredient, weight, datetime, location, totalCalories } = req.body;

  try {
    // Spor ingrediensen ved hjælp af IntakeRecord-klassen
    const intakeRecord = new IntakeRecord();
    await intakeRecord.trackIngredient(userId, ingredient, weight, datetime, location, totalCalories);
    console.log('Ingredient tracked successfully');
    // Returnér en succesmeddelelse
    res.status(200).send({ message: 'Ingredient tracked successfully' });
  } catch (err) {
    // Log fejlen og returnér en 500-fejl
    console.error('Error tracking ingredient:', err);
    res.status(500).send({ message: 'Error tracking ingredient', error: err });
  }
};

exports.deleteRecord = async (req, res) => {
  const recordId = req.params.id;
  console.log('Attempting to delete record with ID:', recordId); // Check the received ID

  try {
      const deleted = await new IntakeRecord().deleteRecord(recordId);
      if (deleted) {
          console.log('Record deleted successfully');
          res.status(200).json({ message: 'Record deleted successfully' });
      } else {
          console.log('No record found with ID:', recordId);
          res.status(404).json({ message: 'Record not found' });
      }
  } catch (err) {
      console.error('Error deleting record:', err);
      res.status(500).json({ message: 'Error deleting record', error: err });
  }
};

// Assuming this is in your Express controller file
exports.updateIntakeRecord = async (req, res) => {
  const recordId = req.params.id;
  const { weight, datetime } = req.body;

  if (!recordId) {
      return res.status(400).json({ message: "Record ID is required" });
  }

  try {
      const intakeRecord = new IntakeRecord();
      const result = await intakeRecord.updateRecord(recordId, { weight, datetime });
      if (result) {
          res.status(200).json({ message: "Record updated successfully" });
      } else {
          res.status(404).json({ message: "Record not found" });
      }
  } catch (err) {
      res.status(500).json({ message: "Error updating record", error: err.toString() });
  }
};

exports.getUpdateRecordPage = async (req, res) => {
  const recordId = req.params.id;
  try {
      const intakeRecord = new IntakeRecord();
      const record = await intakeRecord.getRecordById(recordId);
      if (record) {
          res.render('editIntakeRecord', {
              loggedIn: req.session.loggedIn,
              record: record,
              active: 'meal_tracker'
          });
      } else {
          res.status(404).send('Record not found');
      }
  } catch (error) {
      console.error('Error fetching record:', error);
      res.status(500).send('Internal Server Error');
  }
};
