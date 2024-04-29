// logoutController.js

async function logout(req, res) {
    try {
        // Clear the session
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            // Redirect the user to the login page after logout
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { logout };
