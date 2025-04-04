const Room = require('../models/Room');

const roomController = {
    createRoom: async (roomId, roomName = '') => {
        try {
            let room = await Room.findOne({ roomId });
            if (!room) {
                room = await Room.create({ 
                    roomId,
                    roomName,
                });
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
                //{ upsert: true } → If the room doesn't exist, create a new one.
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
    },

    handleCreateRoom: async (req, res) => {
        try {
            const { roomId, roomName } = req.body;
            const room = await roomController.createRoom(roomId, roomName);
            res.status(200).json({ success: true, room });
        } catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({ success: false, message: 'Failed to create room' });
        }
    },

    handleJoinRoom: async (req, res) => {
        try {
            const { roomId, username } = req.body;

    
            if (!roomId || !username) {
                return res.status(400).json({ success: false, message: 'Room ID and username are required' });
            }

            const room = await Room.findOne({ roomId });
            if (!room) {
                return res.json({ success: false, message: 'Room not found' });
            }
    
            if (room.users.includes(username)) {
                return res.json({ success: false, message: 'Username already taken' });
            }
            res.status(200).json({ success: true, room });
        } catch (error) {
            console.error('Error joining room:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }    
};

module.exports = roomController; 