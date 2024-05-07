const Meal = require('../../views/models/Meal'); // Adjust the path as necessary

const fetchMeals = async (req, res) => {
    const userId = req.session.user.userId; // Ensure this is being set correctly

    const meal = new Meal();

    try {
        const meals = await meal.fetchAll(userId);
        res.status(200).json(meals);
    } catch (error) {
        console.error('Error fetching meals for overview:', error);
        res.status(500).json({ message: 'Error fetching meals for overview' });
    }
};

module.exports = {
    fetchMeals
};
