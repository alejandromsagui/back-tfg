const mongoose = require("mongoose");

const namekoinSchema = new mongoose.Schema({
    amount: {type: Number},
    transactionType: { type: String, enum: ['Ganancia', 'Recarga']},
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
}, { 
    timestamps: true
})

const Namekoins = new mongoose.model('Namekoins', namekoinSchema);

module.exports = Namekoins;