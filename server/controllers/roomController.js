const Room = require('../models/Room');
const User = require('../models/User');

const roomController = {
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
            const { roomId, roomName, username } = req.body;
            if (!roomId ||!roomName || !username) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Room name & Username are required' 
                });
            }
            const room = await Room.create({
                roomId,
                roomName,
                users: [username],
                code: ''
            });

            // If user is logged in, add room to their createdRooms
            if (req.user) {
                await User.findByIdAndUpdate(
                    req.user.id,
                    { $push: { createdRooms: room._id } }
                );
            }
            
            console.log('Room created', room);
            res.status(200).json({ 
                success: true,
                room 
            });
        } catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to create room' 
            });
        }
    },

    handleJoinRoom: async (req, res) => {
        try {
            const { roomId, username } = req.body;

            if (!roomId || !username) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Room ID & Username are required' 
                });
            }

            const room = await Room.findOne({ roomId });
            if (!room) {
                return res.json({ 
                    success: false, 
                    message: 'Room not found' 
                });
            }
    
            if (room.users.includes(username)) {
                return res.json({ 
                    success: false,
                    message: 'Username already taken' 
                });
            }

            // If user is logged in, add room to their joinedRooms
            if (req.user) {
                await User.findByIdAndUpdate(
                    req.user.id,
                    { $push: { joinedRooms: room._id } }
                );
            }

            res.status(200).json({ 
                success: true, 
                room 
            });
        } catch (error) {
            console.error('Error joining room:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }    
};

module.exports = roomController; 