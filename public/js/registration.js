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

        console.log('User data:', userData); // Log user data

        // Send user data to the server for registration
        fetch('/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            console.log('Response:', response); // Log response
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to register user');
            }
        })
        .then(data => {
            console.log('User registered successfully:', data);
            alert('User registered successfully');
            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        })
        .catch(error => {
            console.error('Error registering user:', error);
            // Handle registration error (e.g., display error message to user)
        });
    });
});
