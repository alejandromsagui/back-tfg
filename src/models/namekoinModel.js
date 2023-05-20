const mongoose = require("mongoose");
const { Schema } = mongoose;

const namekoinsSchema = new mongoose.Schema({
    quantity: { type: Number, required: true, validate: {
        validator: function (value) {
            return [10, 25, 40].includes(value);
        },
        message: 'Las únicas opciones disponibles para la recarga son 10€, 25€ o 40€'
    }
},
    date: { type: String, required: true},
    rechargeId: {
        type: Schema.Types.ObjectId,
        ref: 'Recharge',
        required: true
    }
}, {
    timestamps: true
});

const namekoins = mongoose.model('Namekoins', namekoinsSchema);

module.exports = namekoins;