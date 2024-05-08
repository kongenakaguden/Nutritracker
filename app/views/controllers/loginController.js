// Importér User-modellen fra den specificerede sti
const User = require('../../views/models/user'); // Justér stien om nødvendigt

// Definér en asynkron funktion til at håndtere login
async function login(req, res) {
    // Hent brugernavn og adgangskode fra anmodningens body
    const { username, password } = req.body;

    // Opret en ny instans af User-klassen
    const user = new User();

    try {
        // Verificér brugernavn og adgangskode ved hjælp af verifyUserCredentials-metoden
        const verifiedUser = await user.verifyUserCredentials(username, password);

        // Hvis brugeren ikke kunne verificeres, returnér en 401 Unauthorized-meddelelse
        if (!verifiedUser) {
            console.log('Invalid username or password attempt for:', username);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Sæt session-variablen 'loggedIn' til true og gem brugerens detaljer
        req.session.loggedIn = true;
        req.session.user = {
            userId: verifiedUser.UserId,
            username: verifiedUser.username
        };

        // Log en succesmeddelelse
        console.log('User logged in successfully:', username);

        // Returnér en succesmeddelelse og brugerdata til klienten i JSON-format
        res.status(200).json({ message: 'Login successful', user: req.session.user });
    } catch (error) {
        // Log fejlmeddelelsen, hvis der opstår en fejl under loginprocessen
        console.error('Error logging in:', error);

        // Returnér en 500 Internal Server Error-meddelelse til klienten
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Eksportér login-funktionen, så den kan bruges i andre dele af applikationen
module.exports = { login };
