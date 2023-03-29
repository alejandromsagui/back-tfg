const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nickname: { type: String },
    email: { type: String },
    password: { type: String },
    number_namekoins: { type: Number },
    number_transactions: { type: Number }
}, {
    timestamps: true

});

const User = mongoose.model('Users', userSchema);

module.exports = User;