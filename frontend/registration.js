document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Collect user input
        const userData = {
            username: registrationForm.username.value,
            email: registrationForm.email.value,
            password: registrationForm.password.value,
            weight: parseInt(registrationForm.weight.value),
            age: parseInt(registrationForm.age.value),
            gender: registrationForm.gender.value
        };

        // Send user data to the server for registration
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to register user');
            }
        })
        .then(data => {
            console.log('User registered successfully:', data);
            // Optionally, redirect the user to a login page or dashboard
            window.location.href = '/login.html';
        })
        .catch(error => {
            console.error('Error registering user:', error);
            // Handle registration error (e.g., display error message to user)
        });
    });
});
