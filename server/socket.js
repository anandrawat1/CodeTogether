const { Server } = require("socket.io");
const ACTIONS = require("./Actions");
const roomController = require('./controllers/roomController');
const messageController = require('./controllers/messageController');

// Maps socket IDs to usernames
const userSocketMap = {};

// const roomCodeMap = {};
// const roomUsers = {};
// const roomMessages = {};

// roomUsers = { 'Room1': new Set(['User2']) };
// roomCodeMap = { 'Room1': 'console.log("Hello World");' };
// roomMessages = { 'Room1': [{ id: 1, message: 'Hi', username: 'User2' }] };
// userSocketMap = { 'socket_2': 'User2' };
// Room1: [socket_1, socket_2] inbuilt 

function getAllConnectedClients(io, roomId) { //We need it to make sure we're only updating the users inside that specific room, not all connected users.
    const room = io.sockets.adapter.rooms.get(roomId);
    // io.sockets.adapter.rooms = {
    //     'Room1': new Set(['socket_1', 'socket_2']),
    //     'Room2': new Set(['socket_3', 'socket_4'])
    // }
    if (!room) return [];
    return Array.from(room).map((socketId) => ({
        socketId,
        username: userSocketMap[socketId],
    }));
}
// [
//     { socketId: 'socket_1', username: 'User1' },
//     { socketId: 'socket_2', username: 'User2' }
// ]


function initializeSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
        socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
            console.log("User joined:", { roomId, username, socketId: socket.id });
            
            userSocketMap[socket.id] = username;
            socket.join(roomId);

            // Get room and update users
            const room = await roomController.getRoom(roomId);
            if(!room) {
                console.error(`Room not found: ${roomId}`);
                return;
            }
            const clients = getAllConnectedClients(io, roomId);
            await roomController.updateUsers(roomId, clients.map(client => client.username));

            io.to(roomId).emit(ACTIONS.JOINED, { clients, username, socketId: socket.id });

            // Send existing code if available
            if (room.code) {
                socket.emit(ACTIONS.CODE_CHANGE, { code: room.code });
            }

            // Send existing messages
            const messages = await messageController.getRoomMessages(roomId);
            socket.emit(ACTIONS.FETCH_MESSAGES, { messages: messages.reverse() });
        });

        socket.on(ACTIONS.CODE_CHANGE, async ({ roomId, code }) => {
            await roomController.updateCode(roomId, code);
            socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
        });

        socket.on(ACTIONS.SYNC_CODE, async ({ socketId, roomId }) => {
            const room = await roomController.getRoom(roomId);
            if (room && room.code) {
                io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code: room.code });
            }
        });

        socket.on(ACTIONS.REQUEST_CODE, async ({ roomId }) => {
            const room = await roomController.getRoom(roomId);
            if (room && room.code) {
                socket.emit(ACTIONS.CODE_CHANGE, { code: room.code });
            }
        });

        socket.on(ACTIONS.SEND_MESSAGE, async ({ roomId, message, username }) => {
            console.log("Server received message:", { roomId, message, username });
            const savedMessage = await messageController.saveMessage(roomId, username, message);
            io.to(roomId).emit(ACTIONS.RECEIVE_MESSAGE, {
                id: savedMessage._id,
                username,
                message,
                timestamp: savedMessage.timestamp
            });
        });

        socket.on(ACTIONS.FETCH_MESSAGES, async ({ roomId }) => {
            console.log("Fetching messages for room:", roomId);
            const messages = await messageController.getRoomMessages(roomId);
            socket.emit(ACTIONS.FETCH_MESSAGES, { messages: messages.reverse() });
        });

        socket.on("disconnecting", async () => {
            const rooms = Array.from(socket.rooms);
            const username = userSocketMap[socket.id];
            
            for (const roomId of rooms) {
                if (roomId !== socket.id) {
                    io.to(roomId).emit(ACTIONS.DISCONNECTED, {
                        socketId: socket.id,
                        username: username
                    });

                    const clients = getAllConnectedClients(io, roomId);
                    await roomController.updateUsers(roomId, clients.map(client => client.username));
                }
            }

            delete userSocketMap[socket.id];
        });

        socket.on(ACTIONS.LEAVE, async ({ roomId }) => {
            const username = userSocketMap[socket.id];
            socket.leave(roomId);
            
            io.to(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: username
            });

            const clients = getAllConnectedClients(io, roomId);
            await roomController.updateUsers(roomId, clients.map(client => client.username));
            
            delete userSocketMap[socket.id];
        });
    });

    return io;
}

module.exports = initializeSocket;