const mongoose = require("mongoose");
const { Schema } = mongoose;
const videogameModel = require("../models/videogameModel")
const ratingsModel = require("../models/ratingModel")
const reportsModel = require("../models/reportModel")
const notificationsModel = require("./notificationModel")
const rechargesModel = require("../models/rechargeModel")
const rankingModel = require("../models/rankingModel")
const transactionsModel = require("../models/transactionModel")

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
    reports: {
      type: Number, default: 0
    }
  },
  {
    timestamps: true,
  }
);

videogameSchema.pre('findOneAndDelete', async function(next){
  const videogameId = this._conditions._id;
  console.log('videogameId: ', videogameId);
  await reportsModel.deleteMany({videogame: videogameId})
  await notificationsModel.deleteMany({idVideogame: videogameId})
  
})
const Videogame = mongoose.model("Videogames", videogameSchema);

module.exports = Videogame;
