const { default: mongoose } = require("mongoose");

var videogameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cover: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true }
}, {
    timestamps: true
})

export default videogame;
const Videogame = mongoose.model('Videogames', videogameSchema);

module.exports = Videogame;