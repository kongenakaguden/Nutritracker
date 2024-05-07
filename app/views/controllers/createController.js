const User = require('../../views/models/user');  // Adjust the path as necessary

async function createUser(req, res) {
    const user = new User();
    try {
        await user.createUser(req.body);
        console.log('User created successfully:', req.body);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.message === 'User already exists') {
            res.status(400).json({ message: 'User already exists' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = {
    createUser,
};
