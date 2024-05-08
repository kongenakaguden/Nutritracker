// Importerer User-modellen fra den specificerede sti
const User = require('../../views/models/user'); // Sørg for, at stien er korrekt

// Definerer en asynkron funktion, der henter ernæringsdata time for time
const getHourlyNutrition = async (req, res) => {
    // Henter bruger-ID fra sessionen (forudsætter, at sessionen allerede er oprettet korrekt)
    const userId = req.session.user.userId; // Sørg for, at dette sættes korrekt

    // Opretter en ny instans af User-modellen for at bruge dens metoder
    const user = new User();

    try {
        // Forsøger at hente brugerens timebaserede ernæringsdata ved hjælp af User-modellens getHourlyNutrition-metode
        const data = await user.getHourlyNutrition(userId);
        if (!data) {
            // Logger en besked, hvis der ikke blev returneret data, og sender en 404-fejlmeddelelse
            console.log("No data returned from getHourlyNutrition");
            return res.status(404).json({ error: "No data found" });
        }
        // Sender de hentede data til klienten med en 200-status
        res.status(200).json(data);
    } catch (error) {
        // Logger fejlen til konsollen og sender en 500-fejlmeddelelse til klienten ved fejl
        console.error("Error in getHourlyNutrition:", error);
        res.status(500).json({ message: "Failed to retrieve hourly nutrition data" });
    }
};

// Definerer en asynkron funktion, der henter ernæringsdata dag for dag
const getDailyNutrition = async (req, res) => {
    // Henter bruger-ID fra sessionen (forudsætter, at sessionen allerede er oprettet korrekt)
    const userId = req.session.user.userId; // Sørg for, at dette sættes korrekt

    // Opretter en ny instans af User-modellen for at bruge dens metoder
    const user = new User();

    try {
        // Forsøger at hente brugerens dagsbaserede ernæringsdata ved hjælp af User-modellens getDailyNutrition-metode
        const data = await user.getDailyNutrition(userId);
        if (!data) {
            // Logger en besked, hvis der ikke blev returneret data, og sender en 404-fejlmeddelelse
            console.log("No data returned from getDailyNutrition");
            return res.status(404).json({ error: "No data found" });
        }
        // Sender de hentede data til klienten med en 200-status
        res.status(200).json(data);
    } catch (error) {
        // Logger fejlen til konsollen og sender en 500-fejlmeddelelse til klienten ved fejl
        console.error("Error in getDailyNutrition:", error);
        res.status(500).json({ message: "Failed to retrieve daily nutrition data" });
    }
};

// Eksporterer begge funktioner, så de kan bruges i andre moduler
module.exports = { getHourlyNutrition, getDailyNutrition };
