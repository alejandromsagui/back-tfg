const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    transaction: { type: String, enum: ['Compra', 'Venta'] },
    description: { type: String },
    date: { type: Date },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transactions', transactionSchema)

module.exports = Transaction;