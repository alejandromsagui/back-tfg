const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = mongoose.Schema({
    rating: { type: Number, min: [1], max: [5], required: true },
    comment: { type: String, required: true },
    date: { type: String, required: true },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    nickname: { type: String },
    idUserProfile: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    nicknameUserProfile: { type: String, required: true }
}, {
    timestamps: true
});

const Rating = mongoose.model('Ratings', ratingSchema)

module.exports = Rating;