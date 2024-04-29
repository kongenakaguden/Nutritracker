document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    const loginForm = document.getElementById('loginForm');
    const message = document.getElementById('message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Sending login request with username:', username);

        // Send a POST request to the server to handle the login
        fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }) // Using shorthand property names
        })
        .then(response => {
            if (response.ok) {
                console.log(response)
                return response.json();
            } else {
                throw new Error('Failed to login');
            }
        })
        .then(data => {
            console.log('Login successful:', data);
            // Redirect to the homepage after a successful login
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Error logging in:', error);
            message.textContent = 'Failed to login. Please try again.';
        });
    });
});
