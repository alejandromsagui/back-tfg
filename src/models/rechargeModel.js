const mongoose = require("mongoose");
const { Schema } = mongoose;

const rechargeSchema = new mongoose.Schema({
    quantity: { type: Number, enum: ['10', '25', '40'], required: true},
    date: { type: Date, required: true},
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    nickname: {type: String, required: true}
}, {
    timestamps: true
});

const Recharge = mongoose.model('Recharges', rechargeSchema);

module.exports = Recharge;