const Message = require('../models/Message');

const messageController = {
    saveMessage: async (roomId, username, message) => {
        try {
            return await Message.create({
                roomId,
                username,
                message
            });
        } catch (error) {
            console.error('Error saving message:', error);
            throw error;
        }
    },

    getRoomMessages: async (roomId, limit = 100) => {
        try {
            return await Message.find({ roomId })
                .sort({ timestamp: -1 })
                .limit(limit)
                .lean();
        } catch (error) {
            console.error('Error getting room messages:', error);
            throw error;
        }
    }
};

module.exports = messageController; 