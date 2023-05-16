const mongoose = require("mongoose");
const { Schema } = mongoose;

const rechargeSchema = new mongoose.Schema({
    quantity: { type: Number, required: true, validator: function(v){
        return [10, 25, 40].includes(v);
    }, message: 'El valor de {PATH} debe ser 10, 25 o 40' },
    date: { type: String, required: true},
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