const User = require('../models/User');

const userController = {
    getMe: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json({
                success: true,
                user: user
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Error fetching user data'
            });
        }
    }
};

module.exports = userController; 