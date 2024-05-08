// Når HTML-dokumentet er fuldt indlæst, kør følgende kode
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    
    // Find loginformularen og meddelelsesområdet ved hjælp af deres id'er
    const loginForm = document.getElementById('loginForm');
    const message = document.getElementById('message');

    // Tilføj en event listener til loginformularen for at håndtere indsendelsen
    loginForm.addEventListener('submit', function(event) {
        // Forhindre standardformularens indsendelsesadfærd
        event.preventDefault();

        // Hent brugernavn og adgangskode fra formularens inputfelter
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Sending login request with username:', username);

        // Send en POST-anmodning til serveren for at håndtere login
        fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Brug kortere notationsform for at sende brugernavn og adgangskode som JSON
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            // Hvis anmodningen lykkedes, konverteres svaret til JSON
            if (response.ok) {
                console.log(response);
                return response.json();
            } else {
                // Kast en fejl, hvis svaret ikke er OK
                throw new Error('Failed to login');
            }
        })
        .then(data => {
            // Hvis login er succesfuldt, log en succesmeddelelse
            console.log('Login successful:', data);
            // Omdirigér til hjemmesiden efter vellykket login
            window.location.href = '/';
        })
        .catch(error => {
            // Log en fejlmeddelelse, hvis loginanmodningen mislykkes
            console.error('Error logging in:', error);
            // Vis en fejlmeddelelse i meddelelsesområdet
            message.textContent = 'Failed to login. Please try again.';
        });
    });
});
