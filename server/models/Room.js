const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    roomName: {
        type: String,
        required: true,
        default: '',
        trim: true
    },
    code: {
        type: String,
        default: ''
    },
    files: [
    {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['file', 'folder'],
            required: true
        },
        parentId: {
            type: String,
            default: null
        },
        content: {
            type: String,
            default: ''
        },
        language: {
            type: String,
            default: 'javascript'
        }
    }
],
    users: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Room', roomSchema); 