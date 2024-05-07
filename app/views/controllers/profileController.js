const User = require('../../views/models/user');

async function getProfile(req, res) {
    console.log('Fetching user profile...');
    if (!req.user || !req.user.userId) {  // Changed 'UserId' to 'userId' to match session setting
        console.log('User data or userId not found in session:', req.user);
        return res.status(401).json({ message: 'User not authenticated or userId missing' });
    }

    try {
        const user = new User();
        const userProfile = await user.fetchProfile(req.user.userId);  // Use 'userId' not 'UserId'
        if (!userProfile) {
            console.log('User profile not found for userId:', req.user.userId);
            return res.status(404).json({ message: 'User profile not found' });
        }

        console.log('User profile:', userProfile);
        res.status(200).json({ profile: userProfile });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error', errorDetails: error.message });
    }
};

module.exports = { getProfile };
