const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = mongoose.Schema({
    members: [{ type: Schema.Types.ObjectId, ref: 'Users' }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Conversation", conversationSchema);

