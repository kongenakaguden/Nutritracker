// Importér Meal-modellen fra den specificerede sti
const Meal = require('../../views/models/Meal'); // Justér stien om nødvendigt

// Definér en asynkron funktion til at gemme måltidsdata i databasen
const saveMeal = async (req, res) => {
    // Hent måltidsdata fra anmodningens body
    const mealData = req.body;

    // Hent brugerens ID fra sessionen og antag, at det er tilgængeligt og gyldigt
    const userId = req.session.user.userId;

    // Opret en ny instans af Meal-klassen
    const meal = new Meal();

    try {
        // Gem måltidet i databasen ved at kalde create-metoden på Meal-klassen
        const result = await meal.create(userId, mealData);

        // Returnér resultatet af oprettelsen som en succesmeddelelse i JSON-format
        res.status(200).json(result);
    } catch (error) {
        // Log fejlen til konsollen og returnér en 500 Internal Server Error-meddelelse
        console.error('Error saving meal to database:', error);
        res.status(500).json({ message: 'Error saving meal to database', errorDetails: error.message });
    }
};

// Eksportér saveMeal-funktionen, så den kan bruges i andre dele af applikationen
module.exports = {
    saveMeal
};
