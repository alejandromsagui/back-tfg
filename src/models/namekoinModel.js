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
    date: { type: String, default: new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      required: [true, "La fecha es obligatoria"],
    },
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