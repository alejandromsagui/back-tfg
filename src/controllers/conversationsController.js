const conversationModel = require("../models/conversation")

//nueva conversacion

const newConversation = async(req, res) => {
    const conversation = new conversationModel({
        members: [req.body.senderId, req.body.receiverId]
    });

    
    try {
            const savedConverstion = await conversation.save()
            res.status(200).json(savedConverstion)
    } catch (error) {
        return res.status(500).json(error)
    }
}

//obtener conversacion
const getConversation = async(req, res) => {

    const id = req.params.id

    try {
        const conversation = await conversationModel.find({
            members: { $in: [id]}
        })
        res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = {newConversation, getConversation}