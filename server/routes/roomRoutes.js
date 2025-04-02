const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Create a new room
router.post('/create', roomController.handleCreateRoom);

// Get room details
router.get('/:roomId', roomController.handleGetRoom);

module.exports = router; 