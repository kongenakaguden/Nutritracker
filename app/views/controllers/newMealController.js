const Meal = require('../../views/models/Meal'); // Adjust the path as necessary

const saveMeal = async (req, res) => {
    const mealData = req.body;
    const userId = req.session.user.userId; // Assume userId is available and valid

    const meal = new Meal();

    try {
        const result = await meal.create(userId, mealData);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error saving meal to database:', error);
        res.status(500).json({ message: 'Error saving meal to database', errorDetails: error.message });
    }
};

module.exports = {
    saveMeal
};
