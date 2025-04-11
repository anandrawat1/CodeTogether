require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const initializeSocket = require('./socket');
const connectDB = require('./config/db');
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());


// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//     next();
// });

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);

const server = http.createServer(app);
const io = initializeSocket(server);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
