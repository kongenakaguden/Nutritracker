const User = require('../../views/models/user'); // Adjust the path as necessary

async function renderEditProfile(req, res) {
    const user = new User();
    try {
        const userProfile = await user.fetchProfile(req.user.userId);
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.render('editProfile', { loggedIn: req.isAuthenticated(), profile: userProfile });
    } catch (error) {
        console.error('Error rendering edit profile page:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateProfile(req, res) {
    const user = new User();
    try {
        const result = await user.updateProfile(req.user.userId, req.body);
        if (result === 0) {
            return res.status(404).json({ message: 'User not found or no changes were made' });
        }
        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { renderEditProfile, updateProfile };
