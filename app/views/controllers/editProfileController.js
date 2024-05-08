// Importerer User-modellen fra den specificerede sti
const User = require('../../views/models/user'); // Juster stien efter behov

// Asynkron funktion til at rendere siden for at redigere brugerprofilen
async function renderEditProfile(req, res) {
    // Opretter en ny instans af User-modellen for at kunne bruge dens metoder
    const user = new User();
    try {
        // Henter brugerens profiloplysninger fra databasen ved hjælp af User-modellens fetchProfile-metode
        const userProfile = await user.fetchProfile(req.user.userId);
        // Hvis brugerprofilen ikke findes, returneres en 404-fejlmeddelelse
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Render siden 'editProfile' og videregiver oplysningerne om den loggede bruger samt profiloplysningerne
        res.render('editProfile', { loggedIn: req.isAuthenticated(), profile: userProfile });
    } catch (error) {
        // Logger en fejlmeddelelse til konsollen ved fejl og sender en 500-fejlmeddelelse til klienten
        console.error('Error rendering edit profile page:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Asynkron funktion til at opdatere brugerens profil
async function updateProfile(req, res) {
    // Opretter en ny instans af User-modellen for at kunne bruge dens metoder
    const user = new User();
    try {
        // Forsøger at opdatere brugerens profil ved hjælp af User-modellens updateProfile-metode
        const result = await user.updateProfile(req.user.userId, req.body);
        // Hvis ingen rækker blev opdateret, betyder det, at brugeren ikke blev fundet, eller at ingen ændringer blev foretaget
        if (result === 0) {
            return res.status(404).json({ message: 'User not found or no changes were made' });
        }
        // Sender en succesmeddelelse til klienten, hvis profilen blev opdateret
        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        // Logger en fejlmeddelelse til konsollen ved fejl og sender en 500-fejlmeddelelse til klienten
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Eksporterer funktionerne renderEditProfile og updateProfile, så de kan bruges i andre moduler
module.exports = { renderEditProfile, updateProfile };
