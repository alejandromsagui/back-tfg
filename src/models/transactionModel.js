const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new mongoose.Schema({
    idBuyer: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    nicknameBuyer: { type: String, required: true },
    description: { type: String, required: true },
    price: {type: Number, required: true},
    date: { type: String, required: true },
    idSeller: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    nicknameSeller: { type: String, required: true },
    idVideogame: {
        type: Schema.Types.ObjectId,
        ref: 'Videogames',
        required: true
    },
    videogame: { type: String, required: true },
    platform: {type: String, required: true}
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transactions', transactionSchema)

module.exports = Transaction;