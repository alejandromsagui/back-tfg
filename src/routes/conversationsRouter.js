const express = require('express');
const conversationRouter = express.Router()
const conversationController = require('../controllers/conversationsController');


conversationRouter.post('/newConversation', conversationController.newConversation)
conversationRouter.get('/getConversation/:id', conversationController.getConversation)

module.exports = conversationRouter;