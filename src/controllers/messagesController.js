const messageModel = require("../models/messages")

//añadir mensaje

const addMessage = async(req, res) => {
    const newMessage = new messageModel(req.body)

    try {
        const savedMessage = await newMessage.save()
        return res.status(200).json(savedMessage)
    } catch (error) {
        return res.status(500).json(error)
    }
}
//obtener mensaje

const getMessage = async(req, res) => {
    try {
        const messages = await messageModel.find({ 
            conversationId:req.params.id
        })

        res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json(error)
    }
}
module.exports = { addMessage, getMessage }