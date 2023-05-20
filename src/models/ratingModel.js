const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = mongoose.Schema({
    rating: { type: Number, required: [true, 'La puntuación es obligatoria']},
    comment: { type: String, required: [true, 'El comentario es obligatorio']},
    date: { type: String, required: [true, 'La fecha es obligatoria'] },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'El id es obligatorio']
    },
    nickname: { type: String, required: [true, 'El nombre de usuario es obligatorio'] },
    idUserProfile: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'El id es obligatorio']
    },
    nicknameUserProfile: { type: String, required: [true, 'El nombre de usuario es obligatorio'] }
}, {
    timestamps: true
});

const Rating = mongoose.model('Ratings', ratingSchema)

module.exports = Rating;