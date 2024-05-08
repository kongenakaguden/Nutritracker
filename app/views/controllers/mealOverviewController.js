// Importér Meal-modellen fra den korrekte sti
const Meal = require('../../views/models/Meal'); // Justér stien om nødvendigt

// Definér en asynkron funktion til at hente måltider
const fetchMeals = async (req, res) => {
    // Hent brugerens ID fra sessionens data
    const userId = req.session.user.userId; // Sørg for, at dette er korrekt indstillet

    // Opret en ny instans af Meal-klassen
    const meal = new Meal();

    try {
        // Hent alle måltider for den specifikke bruger
        const meals = await meal.fetchAll(userId);

        // Returnér en liste af måltider i JSON-format med en successtatus
        res.status(200).json(meals);
    } catch (error) {
        // Log fejlen og returnér en 500 Internal Server Error-meddelelse
        console.error('Error fetching meals for overview:', error);
        res.status(500).json({ message: 'Error fetching meals for overview' });
    }
};

// Eksportér funktionen, så den kan bruges andre steder
module.exports = {
    fetchMeals
};
