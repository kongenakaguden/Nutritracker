document.addEventListener('DOMContentLoaded', function() {
    var loginForm = document.getElementById('loginForm');
    var message = document.getElementById('message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        // Here, you can send a POST request to your server to handle the login
        // For demonstration purposes, we'll just display a message
        message.textContent = 'Logging in...';
        setTimeout(function() {
            message.textContent = 'Login successful!';
        }, 1000);
    });
});
