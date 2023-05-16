const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new mongoose.Schema({
    transaction: { type: String, enum: ['Compra', 'Venta'] },
    description: { type: String },
    price: {type: Number},
    date: { type: String },
    idBuyer: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    nicknameBuyer: { type: String, required: true },
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
    videogame: { type: String, required: true }
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transactions', transactionSchema)

module.exports = Transaction;