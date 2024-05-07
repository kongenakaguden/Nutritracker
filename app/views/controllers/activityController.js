const Activity = require('../../views/models/Activity'); // Update the path as necessary

exports.trackActivity = async (req, res) => {
    const { activity, duration, caloriesBurned } = req.body;
    const userId = req.session.user.userId;  // Assuming the user session is already set up

    const activityModel = new Activity();

    try {
        await activityModel.trackActivity(userId, activity, duration, caloriesBurned);
        res.status(200).json({ message: 'Activity tracked successfully' });
    } catch (err) {
        console.error('Failed to track activity:', err);
        res.status(500).send({ message: 'Failed to track activity', error: err });
    }
};
