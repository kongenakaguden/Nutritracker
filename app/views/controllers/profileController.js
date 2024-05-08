// Importér User-modellen fra den angivne sti
const User = require('../../views/models/user');

// Definér en asynkron funktion til at hente brugerens profil
async function getProfile(req, res) {
    // Log en meddelelse, der indikerer, at profilen hentes
    console.log('Fetching user profile...');

    // Kontroller, om bruger-ID er tilgængeligt i sessionen
    // Brug 'userId' i stedet for 'UserId' for at matche session-indstillingen
    if (!req.user || !req.user.userId) {
        console.log('User data or userId not found in session:', req.user);
        // Returnér en 401 Unauthorized-meddelelse, hvis bruger-ID ikke findes
        return res.status(401).json({ message: 'User not authenticated or userId missing' });
    }

    try {
        // Opret en ny instans af User-klassen
        const user = new User();

        // Hent brugerens profil ved hjælp af fetchProfile-metoden og det korrekte 'userId'
        const userProfile = await user.fetchProfile(req.user.userId);

        // Hvis brugerprofilen ikke findes, returnér en 404-fejl
        if (!userProfile) {
            console.log('User profile not found for userId:', req.user.userId);
            return res.status(404).json({ message: 'User profile not found' });
        }

        // Log brugerprofilens data og returnér dem i JSON-format
        console.log('User profile:', userProfile);
        res.status(200).json({ profile: userProfile });
    } catch (error) {
        // Log fejlen og returnér en 500 Internal Server Error-meddelelse
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error', errorDetails: error.message });
    }
}

// Eksportér getProfile-funktionen, så den kan bruges andre steder
module.exports = { getProfile };
