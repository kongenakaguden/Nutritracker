const User = require('../../views/models/user'); // Adjust the path as necessary

async function login(req, res) {
    const { username, password } = req.body;
    const user = new User();

    try {
        const verifiedUser = await user.verifyUserCredentials(username, password);
        if (!verifiedUser) {
            console.log('Invalid username or password attempt for:', username);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Set loggedIn session variable
        req.session.loggedIn = true;
        req.session.user = {
            userId: verifiedUser.UserId,
            username: verifiedUser.username
        };

        console.log('User logged in successfully:', username);

        // Redirect or send response
        res.status(200).json({ message: 'Login successful', user: req.session.user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { login };
