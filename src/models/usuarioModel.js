const mongoose = require("mongoose");

const userSchema =  new mongoose.Schema({
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    number_namekoins: { type: Number },
    number_transactions: { type: Number },
    rol: {type: String, enum: ['Administrador', 'Usuario']}
}, {
    timestamps: true

});

const User = mongoose.model('Users', userSchema);

module.exports = User;