const User = require('../../views/models/user'); // Make sure path is correct

const getHourlyNutrition = async (req, res) => {
    const userId = req.session.user.userId; // Ensure this is being set correctly

    const user = new User();

    try {
        const data = await user.getHourlyNutrition(userId);
        if (!data) {
            console.log("No data returned from getHourlyNutrition");
            return res.status(404).json({ error: "No data found" });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getHourlyNutrition:", error);
        res.status(500).json({ message: "Failed to retrieve hourly nutrition data" });
    }
};

const getDailyNutrition = async (req, res) => {
    const userId = req.session.user.userId; // Ensure this is being set correctly

    const user = new User();

    try {
        const data = await user.getDailyNutrition(userId);
        if (!data) {
            console.log("No data returned from getDailyNutrition");
            return res.status(404).json({ error: "No data found" });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getDailyNutrition:", error);
        res.status(500).json({ message: "Failed to retrieve daily nutrition data" });
    }
};

module.exports = { getHourlyNutrition, getDailyNutrition };