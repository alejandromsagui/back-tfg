const mongoose = require("mongoose");
const { Schema } = mongoose;

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  nickname: { type: String, required: true },
  videogame: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Videogames",
  },
  date: {
    type: String,
    default: new Date().toLocaleString("es-ES"),
  },
});

const Report = mongoose.model("Reports", reportSchema);

module.exports = Report;
