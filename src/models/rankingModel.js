const mongoose = require("mongoose");
const { Schema } = mongoose;

const rankingModel = mongoose.Schema({
    idTransaction: {
        type: Schema.Types.ObjectId,
        ref: 'Transactions',
        required: [true, "El id de la transacción es obligatoria"],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, "El id del usuario es obligatorio"],
    },
    users: {
        type: String, required: [true, "El nombre de usuario es obligatorio"]
    },
}, {
    timestamps: true
});

const Ranking = mongoose.model('Ranking', rankingModel)

module.exports = Ranking;