const mongoose = require("mongoose");

const rechargeSchema = new mongoose.Schema({
    quantity: { type: Number},
    date: { type: Date},
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
}, {
    timestamps: true
});

const Rechargue = new mongoose.model('Recharges', rechargeSchema);

module.exports = Rechargue;