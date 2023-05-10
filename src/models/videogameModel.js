const mongoose = require("mongoose");
const { Schema } = mongoose;

var videogameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    genre: { type: Array, required: true },
    price: { type: Number },
    nickname: {type: String, required: true},
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
}, {
    timestamps: true
})

const Videogame = mongoose.model('Videogames', videogameSchema);

module.exports = Videogame;