const User = require('../models/User');

const myRoomController = {
    getMyRooms: async (req, res) => {
        try {
            const userId = req.user.id;

            const user = await User.findById(userId)
                .populate('createdRooms')
                .populate('joinedRooms')
                .select('createdRooms joinedRooms');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
            res.status(200).json({
                success: true,
                createdRooms: user.createdRooms,
                joinedRooms: user.joinedRooms
            });
        } catch (error) {
            console.error('Error fetching user rooms:', error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }
};

module.exports = myRoomController;
