const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');
const myRoomController = require('../controllers/myRoomController');
const userController = require('../controllers/userController');

// Authentication routes
router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.post('/logout', auth.logout);

// Protected routes
router.get('/me', authMiddleware, userController.getMe);
router.post('/getMyRooms', authMiddleware, myRoomController.getMyRooms);

module.exports = router; 