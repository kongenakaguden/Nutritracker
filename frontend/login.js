// login.js

// Wait for the DOM content to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', function() {
    // Get the login form and message elements from the DOM
    var loginForm = document.getElementById('loginForm');
    var message = document.getElementById('message');

    // Add an event listener to the login form for form submission
    loginForm.addEventListener('submit', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the username and password values from the form fields
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        // Send a POST request to the server to handle the login
        fetch('/login', {
            method: 'POST', // Use the POST method
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify({ username: username, password: password }) // Convert data to JSON format
        })
        .then(response => {
            // Check if the response is successful
            if (response.ok) {
                // Parse the JSON response data
                return response.json();
            } else {
                // Throw an error if the response is not successful
                throw new Error('Failed to login');
            }
        })
        .then(data => {
            // Log a success message to the console
            console.log('Login successful:', data);
            // Redirect the user to the homepage
            window.location.href = '/'; // Redirect to homepage
        })
        .catch(error => {
            // Log an error message to the console
            console.error('Error logging in:', error);
            // Display an error message to the user
            message.textContent = 'Failed to login. Please try again.';
        });
    });
});
