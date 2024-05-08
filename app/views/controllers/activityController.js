// Importerer Activity-modellen fra den specificerede sti
const Activity = require('../../views/models/Activity'); // Opdater stien efter behov

// Eksporterer funktionen trackActivity, der sporer en brugers aktivitet
exports.trackActivity = async (req, res) => {
    // Udpakker aktivitetens navn, varighed og brændte kalorier fra anmodningsindholdet
    const { activity, duration, caloriesBurned } = req.body;
    // Henter bruger-ID fra sessionen (forudsætter, at brugeren allerede er logget ind)
    const userId = req.session.user.userId;

    // Opretter en ny instans af Activity-modellen for at få adgang til dens metoder
    const activityModel = new Activity();

    // Forsøger at spore aktiviteten ved hjælp af Activity-modellens trackActivity-metode
    try {
        // Kald trackActivity-metoden med de indsamlede data
        await activityModel.trackActivity(userId, activity, duration, caloriesBurned);
        // Sender et svar med statuskode 200 og en succesmeddelelse
        res.status(200).json({ message: 'Activity tracked successfully' });
    } catch (err) {
        // Logger en fejlmeddelelse til konsollen ved fejlslagne forsøg
        console.error('Failed to track activity:', err);
        // Sender en fejlmeddelelse tilbage til klienten med statuskode 500
        res.status(500).send({ message: 'Failed to track activity', error: err });
    }
};
