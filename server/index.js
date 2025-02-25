const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./Actions");
const cors = require("cors");
const axios = require("axios");
const server = http.createServer(app);
require("dotenv").config();

const languageConfig = {
  python3: { versionIndex: "3" },
  java: { versionIndex: "3" },
  cpp: { versionIndex: "4" },
  nodejs: { versionIndex: "3" },
  c: { versionIndex: "4" },
  ruby: { versionIndex: "3" },
  go: { versionIndex: "3" },
  scala: { versionIndex: "3" },
  bash: { versionIndex: "3" },
  sql: { versionIndex: "3" },
  pascal: { versionIndex: "2" },
  csharp: { versionIndex: "3" },
  php: { versionIndex: "3" },
  swift: { versionIndex: "3" },
  rust: { versionIndex: "3" },
  r: { versionIndex: "3" },
};

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
const roomCodeMap = {};
const roomUsers = {}; // Track users in each room

function getAllConnectedClients(roomId) {
  // Get unique users in the room based on username
  const uniqueUsers = new Map();
  Array.from(io.sockets.adapter.rooms.get(roomId) || []).forEach((socketId) => {
    const username = userSocketMap[socketId];
    if (username) {
      // Only keep the most recent socket connection for each username
      uniqueUsers.set(username, {
        socketId,
        username,
      });
    }
  });
  return Array.from(uniqueUsers.values());
}

io.on("connection", (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    // Remove any existing connections for this username in this room
    const existingSockets = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    existingSockets.forEach((existingSocketId) => {
      if (userSocketMap[existingSocketId] === username) {
        const existingSocket = io.sockets.sockets.get(existingSocketId);
        if (existingSocket && existingSocket.id !== socket.id) {
          existingSocket.leave(roomId);
          delete userSocketMap[existingSocketId];
        }
      }
    });

    // Join new room
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    // Initialize room users if needed
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = new Set();
    }
    roomUsers[roomId].add(username);
    
    // Get connected clients (now unique by username)
    const clients = getAllConnectedClients(roomId);
    
    // Notify everyone in the room about the current state
    io.to(roomId).emit(ACTIONS.JOINED, {
      clients,
      username,
      socketId: socket.id,
    });

    // Send current code to new user if it exists
    if (roomCodeMap[roomId]) {
      socket.emit(ACTIONS.CODE_CHANGE, { code: roomCodeMap[roomId] });
    }
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    // Store the latest code
    roomCodeMap[roomId] = code;
    // Broadcast to others in the room
    socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, roomId, code }) => {
    // Update the room's code if provided
    if (code !== undefined) {
      roomCodeMap[roomId] = code;
    }
    // Send the current code to the requesting socket
    if (roomCodeMap[roomId]) {
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code: roomCodeMap[roomId] });
    }
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        const username = userSocketMap[socket.id];
        
        // Check if user has other active connections in the room
        const hasOtherConnections = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
          .some(sid => sid !== socket.id && userSocketMap[sid] === username);

        if (!hasOtherConnections) {
          socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
            socketId: socket.id,
            username: username,
          });
          
          // Remove user from room tracking
          if (roomUsers[roomId]) {
            roomUsers[roomId].delete(username);
            if (roomUsers[roomId].size === 0) {
              delete roomUsers[roomId];
              delete roomCodeMap[roomId];
            }
          }
        }
      }
    });

    delete userSocketMap[socket.id];
  });
});

app.post("/compile", async (req, res) => {
  const { code, language } = req.body;

  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      script: code,
      language: language,
      versionIndex: languageConfig[language].versionIndex,
      clientId: process.env.jDoodle_clientId,
      clientSecret: process.env.kDoodle_clientSecret,
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to compile code" });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
