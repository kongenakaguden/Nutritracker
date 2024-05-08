// Importerer User-modellen fra den specificerede sti
const User = require('../../views/models/user'); // Justér stien efter behov

// Definerer en asynkron funktion, der håndterer oprettelse af en ny bruger
async function createUser(req, res) {
    // Opretter en ny instans af User-modellen for at kunne kalde dens metoder
    const user = new User();
    try {
        // Forsøger at oprette en ny bruger med dataene fra anmodningen (req.body)
        await user.createUser(req.body);
        // Logger en besked i konsollen ved succesfuld brugeroprettelse
        console.log('User created successfully:', req.body);
        // Sender et svar til klienten med statuskode 201 og en succesmeddelelse
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        // Logger en fejlmeddelelse til konsollen, hvis brugeroprettelsen fejler
        console.error('Error creating user:', error);
        // Kontrollerer om fejlen skyldes, at brugeren allerede findes
        if (error.message === 'User already exists') {
            // Returnerer en fejlmeddelelse med statuskode 400, hvis brugeren allerede findes
            res.status(400).json({ message: 'User already exists' });
        } else {
            // Returnerer en generel fejlmeddelelse med statuskode 500 ved andre fejl
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

// Eksporterer funktionen createUser, så den kan bruges andre steder i projektet
module.exports = {
    createUser,
};

