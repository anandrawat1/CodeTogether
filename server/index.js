require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const initializeSocket = require('./socket');
const connectDB = require('./config/db');
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');
const agoraRoutes = require('./routes/agoraRoutes');
const executeRoutes = require('./routes/executeRoutes');
const { RtcTokenBuilder, RtcRole } = require('agora-token');

const app = express();

// Allow deployed frontend and any localhost port
const allowedOrigins = [
    process.env.CLIENT_URL,
    'https://code-together-iota.vercel.app',
    'https://code-together-5cyxahy8n-anandrawat1s-projects.vercel.app'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests without an origin
        if (!origin) {
            return callback(null, true);
        }

        // Allow configured production frontend
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow any localhost port
        if (/^http:\/\/localhost:\d+$/.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/agora', agoraRoutes);
app.use('/api/execute', executeRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Code Together API');
});

app.get("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

const server = http.createServer(app);
const io = initializeSocket(server);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});