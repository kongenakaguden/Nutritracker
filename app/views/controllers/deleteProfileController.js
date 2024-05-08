// Importerer User-modellen fra den specificerede sti
const User = require('../../views/models/user'); // Juster stien efter behov

// Definerer en asynkron funktion, der håndterer sletning af en bruger
async function deleteUser(req, res) {
    // Opretter en ny instans af User-modellen for at kunne bruge dens metoder
    const user = new User();
    try {
        // Henter bruger-ID fra `req.user`-objektet (forudsætter, at brugeroplysninger er tilgængelige i sessionen)
        const userId = req.user.userId; // Forudsætning: UserID er tilgængelig via session eller på anden måde
        // Kalder User-modellens deleteUser-metode for at slette brugeren baseret på bruger-ID
        const rowsDeleted = await user.deleteUser(userId);
        // Hvis ingen rækker blev slettet, betyder det, at brugeren ikke blev fundet
        if (rowsDeleted === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Optionelt: rydder brugersessionen for at logge brugeren ud efter sletning
        req.session.destroy(); // Hvis du bruger sessioner og vil logge brugeren ud efter sletning
        // Logger en succesmeddelelse til konsollen
        console.log('User deleted successfully:', userId);
        // Sender en succesmeddelelse tilbage til klienten med en 200-statuskode
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        // Logger en fejlmeddelelse til konsollen og sender en intern serverfejl (500) tilbage til klienten
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Eksporterer funktionen deleteUser, så den kan bruges i andre moduler
module.exports = { deleteUser };
