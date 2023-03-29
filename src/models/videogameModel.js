const { default: mongoose } = require("mongoose");

var videogameSchema = new mongoose.Schema({
    name: { type: String },
    cover: { type: String },
    description: { type: String },
    genre: { type: String }
}, {
    timestamps: true
})

export default videogame;
const Videogame = mongoose.model('Videogames', videogameSchema);

module.exports = Videogame;