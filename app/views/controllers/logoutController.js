// logoutController.js

function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.clearCookie('connect.sid'); // replace 'connect.sid' with the name of your session cookie if it's different
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

module.exports = { logout };