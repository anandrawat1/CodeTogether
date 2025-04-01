const Room = require('../models/Room');

const roomController = {
    createRoom: async (roomId) => {
        try {
            let room = await Room.findOne({ roomId });
            if (!room) {
                room = await Room.create({ roomId });
            }
            return room;
        } catch (error) {
            console.error('Error creating room:', error);
            throw error;
        }
    },

    updateCode: async (roomId, code) => {
        try {
            return await Room.findOneAndUpdate(
                { roomId },
                { code },
                { new: true, upsert: true }
            );
        } catch (error) {
            console.error('Error updating code:', error);
            throw error;
        }
    },

    updateUsers: async (roomId, users) => {
        try {
            return await Room.findOneAndUpdate(
                { roomId },
                { users },
                { new: true, upsert: true }
                //{ new: true } → Returns the updated document after the change.
                //{ upsert: true } → If the room doesn’t exist, create a new one.
            );
            
        } catch (error) {
            console.error('Error updating users:', error);
            throw error;
        }
    },

    getRoom: async (roomId) => {
        try {
            return await Room.findOne({ roomId });
        } catch (error) {
            console.error('Error getting room:', error);
            throw error;
        }
    }
};

module.exports = roomController; 