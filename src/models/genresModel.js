const mongoose = require("mongoose");
const { Schema } = mongoose;

const genresSchema = mongoose.Schema({
    genres: { type: Array}
})

const genres = mongoose.model('Genres', genresSchema)

module.exports = genres;