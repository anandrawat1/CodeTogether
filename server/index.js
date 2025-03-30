require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { initializeSocket } = require('./socket');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = initializeSocket(server);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
