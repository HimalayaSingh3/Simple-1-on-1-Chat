// server/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

// CORS configuration to allow requests from http://localhost:5173
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
}));

app.use(express.json());

// Connect to MongoDB (Update the connection string as per your setup)
mongoose.connect('mongodb://localhost:27017/chat-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Socket.io setup for real-time communication
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

// Handle socket connection
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for chat message
    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Run the server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
