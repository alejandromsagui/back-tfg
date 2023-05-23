const mongoose = require("mongoose");
const { Schema } = mongoose;

var videogameSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'El nombre es obligatorio'] },
    description: { type: String, required: [true, 'La descripción es obligatoria'] },
    image: {
        type: String, required: [true, 'La imagen es obligatoria'],
        validate: {
            validator: function (value) {
                return value !== null && value !== undefined && value !== '';
            },
            message: 'La imagen es obligatoria',
        },
    },
    genre: { type: Array, required: [true, 'El género es obligatorio'] },
    platform: {
        type: String, required: [true, 'La plataforma es obligatoria'],
        validate: {
            validator: function (value) {
                return ['PC', 'PS5', 'PS4', 'PS3', 'PS2', 'PS1', 'XBOX', 'Nintendo Switch'].includes(value);
            },
            message: 'La plataforma debe ser una de las siguientes opciones: PC, PS5, PS4, PS3, PS2, PS1, XBOX, Nintendo Switch'
        }
    },
    price: { type: Number, required: [true, 'El precio es obligatorio'] },
    nickname: { type: String, required: [true, 'El nombre de usuario es obligatorio'] },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'El id es obligatorio']
    },
    status: { type: String, enum: ['', 'Vendido', 'Reservado'] }

}, {
    timestamps: true
})

const Videogame = mongoose.model('Videogames', videogameSchema);

module.exports = Videogame;