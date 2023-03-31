const mongoose = require("mongoose");

var videogameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cover: { type: String },
    description: { type: String, required: true },
    genre: { type: String, required: true }
}, {
    timestamps: true
})

const Videogame = mongoose.model('Videogames', videogameSchema);

module.exports = Videogame;