const { Server } = require("socket.io");

const ACTIONS = require("./Actions");

const roomController = require("./controllers/roomController");
const messageController = require("./controllers/messageController");

// Maps socket IDs to usernames
const userSocketMap = {};

// Stores Run panel Input/Output for each room
const roomRunState = {};

// const roomCodeMap = {};
// const roomUsers = {};
// const roomMessages = {};

function getAllConnectedClients(io, roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);

  if (!room) return [];

  return Array.from(room).map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));
}

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // =========================
    // JOIN ROOM
    // =========================
    socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
      console.log("User joined:", {
        roomId,
        username,
        socketId: socket.id,
      });

      userSocketMap[socket.id] = username;

      socket.join(roomId);

      // Get room
      const room = await roomController.getRoom(roomId);

      if (!room) {
        console.error(`Room not found: ${roomId}`);
        return;
      }

      // Get connected clients
      const clients = getAllConnectedClients(io, roomId);

      await roomController.updateUsers(
        roomId,
        clients.map((client) => client.username),
      );

      // Tell everyone that a user joined
      io.to(roomId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });

      // Send existing code
      if (room.code) {
        socket.emit(ACTIONS.CODE_CHANGE, {
          code: room.code,
        });
      }

      // Send project files to newly joined user
      socket.emit(ACTIONS.FILES_SYNC, {
        roomId,
        files: room.files || [],
      });

      // Send existing messages
      const messages = await messageController.getRoomMessages(roomId);

      socket.emit(ACTIONS.FETCH_MESSAGES, {
        messages: messages.reverse(),
      });

      // Send current Run panel Input/Output to newly joined user
      if (roomRunState[roomId]) {
        socket.emit("RUN_STATE", {
          roomId,
          input: roomRunState[roomId].input || "",
          output: roomRunState[roomId].output || "",
        });
      }
    });

    // =========================
    // CODE CHANGE
    // =========================
    socket.on(ACTIONS.CODE_CHANGE, async ({ roomId, code }) => {
      await roomController.updateCode(roomId, code);

      socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(
      ACTIONS.FILE_CONTENT_CHANGE,
      async ({ roomId, fileId, content, language }) => {
       
        try {
          await roomController.updateFileContent(
            roomId,
            fileId,
            content,
            language,
          );

          

          socket.to(roomId).emit(ACTIONS.FILE_CONTENT_CHANGE, {
            roomId,
            fileId,
            content,
            language,
          });

          
        } catch (error) {
          console.error("❌ Error syncing file content:", error);
        }
      },
    );

    // =========================
    // FILES UPDATE
    // =========================
    socket.on(ACTIONS.FILES_UPDATE, async ({ roomId, files }) => {
      try {
        await roomController.updateFiles(roomId, files);

        // Send updated project to everyone else
        socket.to(roomId).emit(ACTIONS.FILES_UPDATE, {
          roomId,
          files,
        });
      } catch (error) {
        console.error("Error syncing files:", error);
      }
    });

    // =========================
    // SYNC CODE
    // =========================
    socket.on(ACTIONS.SYNC_CODE, async ({ socketId, roomId }) => {
      const room = await roomController.getRoom(roomId);

      if (room && room.code) {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
          code: room.code,
        });
      }
    });

    // =========================
    // REQUEST CODE
    // =========================
    socket.on(ACTIONS.REQUEST_CODE, async ({ roomId }) => {
      const room = await roomController.getRoom(roomId);

      if (room && room.code) {
        socket.emit(ACTIONS.CODE_CHANGE, {
          code: room.code,
        });
      }
    });

    // =========================
    // RUN PANEL - INPUT CHANGE
    // =========================
    socket.on("RUN_INPUT_CHANGE", ({ roomId, input }) => {
      console.log("Run input changed:", {
        roomId,
        socketId: socket.id,
      });

      // Create room state if it doesn't exist
      if (!roomRunState[roomId]) {
        roomRunState[roomId] = {
          input: "",
          output: "",
        };
      }

      // Save input
      roomRunState[roomId].input = input || "";

      // Send input to everyone except sender
      socket.to(roomId).emit("RUN_INPUT_CHANGE", {
        roomId,
        input: input || "",
      });
    });

    // =========================
    // RUN PANEL - OUTPUT CHANGE
    // =========================
    socket.on("RUN_OUTPUT_CHANGE", ({ roomId, output }) => {
      console.log("Run output changed:", {
        roomId,
        socketId: socket.id,
      });

      // Create room state if it doesn't exist
      if (!roomRunState[roomId]) {
        roomRunState[roomId] = {
          input: "",
          output: "",
        };
      }

      // Save output
      roomRunState[roomId].output = output || "";

      // Send output to everyone except sender
      socket.to(roomId).emit("RUN_OUTPUT_CHANGE", {
        roomId,
        output: output || "",
      });
    });

    // =========================
    // CHAT MESSAGE
    // =========================
    socket.on(ACTIONS.SEND_MESSAGE, async ({ roomId, message, username }) => {
      console.log("Server received message:", {
        roomId,
        message,
        username,
      });

      const savedMessage = await messageController.saveMessage(
        roomId,
        username,
        message,
      );

      io.to(roomId).emit(ACTIONS.RECEIVE_MESSAGE, {
        id: savedMessage._id,
        username,
        message,
        timestamp: savedMessage.timestamp,
      });
    });

    // =========================
    // FETCH MESSAGES
    // =========================
    socket.on(ACTIONS.FETCH_MESSAGES, async ({ roomId }) => {
      console.log("Fetching messages for room:", roomId);

      const messages = await messageController.getRoomMessages(roomId);

      socket.emit(ACTIONS.FETCH_MESSAGES, {
        messages: messages.reverse(),
      });
    });

    // =========================
    // DISCONNECTING
    // =========================
    socket.on("disconnecting", async () => {
      const rooms = Array.from(socket.rooms);

      const username = userSocketMap[socket.id];

      for (const roomId of rooms) {
        if (roomId !== socket.id) {
          io.to(roomId).emit(ACTIONS.DISCONNECTED, {
            socketId: socket.id,
            username,
          });

          const clients = getAllConnectedClients(io, roomId);

          await roomController.updateUsers(
            roomId,
            clients.map((client) => client.username),
          );
        }
      }

      delete userSocketMap[socket.id];
    });

    // =========================
    // LEAVE ROOM
    // =========================
    socket.on(ACTIONS.LEAVE, async ({ roomId }) => {
      const username = userSocketMap[socket.id];

      socket.leave(roomId);

      io.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username,
      });

      const clients = getAllConnectedClients(io, roomId);

      await roomController.updateUsers(
        roomId,
        clients.map((client) => client.username),
      );

      delete userSocketMap[socket.id];
    });
  });

  return io;
}

module.exports = initializeSocket;
