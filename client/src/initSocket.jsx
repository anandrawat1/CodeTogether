import { io } from 'socket.io-client';

export const initSocket = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    if (!backendURL) {
        console.error("VITE_BACKEND_URL is not defined!");
        throw new Error("Backend URL missing! Check your .env file.");
    }

    const options = {
        'force new connection': true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket'],
    };

    const socket = io(backendURL, options);

    // Log successful connection
    socket.on("connect", () => console.log(`Connected to server with ID: ${socket.id}`));

    // Handle connection errors
    socket.on("connect_error", (err) => console.error("Socket connection error:", err));

    return socket;
};
