const mongoose = require("mongoose");
const { Schema } = mongoose;

const genresSchema = mongoose.Schema({
    genre: { type: String}
})

const genres = mongoose.model('Genres', genresSchema)

module.exports = genres;