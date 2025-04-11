const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const optionalAuth = require('../middleware/optionalAuth');

// Create a new room
router.post('/create', optionalAuth, roomController.handleCreateRoom);
// Join a room
router.post('/join', optionalAuth, roomController.handleJoinRoom);

module.exports = router; 