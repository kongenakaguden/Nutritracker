// Når HTML-dokumentet er fuldt indlæst, kør denne kode
document.addEventListener('DOMContentLoaded', function() {
    // Find registreringsformularen ved hjælp af dens id
    const registrationForm = document.getElementById('registrationForm');

    // Tilføj en event listener til formularens 'submit'-begivenhed
    registrationForm.addEventListener('submit', function(event) {
        // Forhindre standardformularindsendelsen
        event.preventDefault();

        // Saml brugerens input fra formularen og opret et objekt
        const userData = {
            username: registrationForm.username.value,
            email: registrationForm.email.value,
            password: registrationForm.password.value,
            weight: parseInt(registrationForm.weight.value),
            age: parseInt(registrationForm.age.value),
            gender: registrationForm.gender.value
        };

        // Log brugerdata til konsollen
        console.log('User data:', userData);

        // Send brugerdata til serveren via en POST-anmodning for at registrere brugeren
        fetch('/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            // Log serverens svar til konsollen
            console.log('Response:', response);

            // Kontroller om svaret er OK, og konverter det til JSON
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to register user');
            }
        })
        .then(data => {
            // Log en succesmeddelelse, hvis brugeren registreres korrekt
            console.log('User registered successfully:', data);
            alert('User registered successfully');

            // Omdirigér brugeren til login-siden efter en kort pause
            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        })
        .catch(error => {
            // Log en fejlmeddelelse, hvis registreringen mislykkes
            console.error('Error registering user:', error);
            // Håndter eventuelle fejl ved registreringen, fx ved at vise en fejlmeddelelse
        });
    });
});
