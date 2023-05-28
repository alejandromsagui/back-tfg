const mongoose = require("mongoose");
const { Schema } = mongoose;

var videogameSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    image: { type: String },
    genre: { type: Array },
    platform: {
      type: String,
      validate: {
        validator: function (value) {
          return [
            "PC",
            "PS5",
            "PS4",
            "PS3",
            "PS2",
            "PS1",
            "XBOX",
            "Nintendo Switch",
          ].includes(value);
        },
        message:
          "La plataforma debe ser una de las siguientes opciones: PC, PS5, PS4, PS3, PS2, PS1, XBOX, Nintendo Switch",
      },
    },
    price: { type: Number },
    nickname: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    status: {
      type: String,
      enum: ["En venta", "Vendido", "Reservado"],
      default: "En venta",
    },
  },
  {
    timestamps: true,
  }
);

const Videogame = mongoose.model("Videogames", videogameSchema);

module.exports = Videogame;
