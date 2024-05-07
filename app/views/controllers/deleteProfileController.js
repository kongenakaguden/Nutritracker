const User = require('../../views/models/user'); // Adjust the path as necessary

async function deleteUser(req, res) {
    const user = new User();
    try {
        const userId = req.user.userId; // Assumption: UserID is available from the user session or passed in some way
        const rowsDeleted = await user.deleteUser(userId);
        if (rowsDeleted === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Optionally clear user session or handle post-delete logic
        req.session.destroy(); // if using sessions and you want to log the user out after deletion
        console.log('User deleted successfully:', userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { deleteUser };
