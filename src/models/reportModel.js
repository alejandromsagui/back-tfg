const mongoose = require("mongoose");
const { Schema } = mongoose;

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  nickname: { 
    type: String, 
    required: [true, 'El nombre de usuario no puede estar vacío'] 
  },
  videogame: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Videogames",
  },
  nameVideogame: { 
    type: String, 
    required: [true, 'El nombre del videojuego no puede estar vacío'] 
  },
  owner: { 
    type: String, 
    required: [true, 'El propietario del videojuego no puede estar vacío'] 
  },
  date: {
    type: String,
    default: new Date().toLocaleString("es-ES"),
  },
  times: {type: Number, default: 0},
  show: { type: Boolean, default: true}
});

const Report = mongoose.model("Reports", reportSchema);

module.exports = Report;
