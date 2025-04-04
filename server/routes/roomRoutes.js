const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Create a new room
router.post('/create', roomController.handleCreateRoom);
// Join a room
router.post('/join', roomController.handleJoinRoom);

module.exports = router; 