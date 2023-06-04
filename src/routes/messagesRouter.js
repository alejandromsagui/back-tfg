const express = require('express');
const messageRouter = express.Router()
const messageController = require('../controllers/messagesController');

messageRouter.post('/addMessage', messageController.addMessage)
messageRouter.get('/getMessage/:id', messageController.getMessage)

module.exports = messageRouter