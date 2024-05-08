// logoutController.js

// Definér logout-funktionen til at håndtere brugerens logout
function logout(req, res) {
    // Ødelæg sessionen for at logge brugeren ud
    req.session.destroy(err => {
        if (err) {
            // Hvis der opstår en fejl under logout-processen, returnér en 500 Internal Server Error-meddelelse
            return res.status(500).json({ message: 'Error logging out' });
        }

        // Fjern sessionens cookie ved at rydde cookien ved navn 'connect.sid'
        // Hvis session-cookien har et andet navn, skal det erstattes her
        res.clearCookie('connect.sid');

        // Returnér en 200 OK-meddelelse med en succesbesked
        res.status(200).json({ message: 'Logged out successfully' });
    });
}

// Eksportér logout-funktionen, så den kan bruges i andre dele af applikationen
module.exports = { logout };
