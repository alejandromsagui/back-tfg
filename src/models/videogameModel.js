const { default: mongoose } = require("mongoose");

var videogame = mongoose.Schema({
    name: {type: String},
    cover: {type: String},
    description: {type: String},
    genre: {type: String}
})

export default videogame;