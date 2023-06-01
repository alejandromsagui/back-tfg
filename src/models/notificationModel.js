const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationsModel = mongoose.Schema({
  type: {
    type: String,
    required: [true, "El tipo de notificación es obligatorio"],
    enum: ["Reporte", "Recomendación"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "El id del usuario es obligatorio"],
  },
  nickname: { type: String, required: [true, "El nombre de usuario es obligatorio"]},
  message: {
    type: String,
    required: [true, "El mensaje es obligatorio"],
  },
  date: {
    type: String,
    default: new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    required: [true, "La fecha es obligatoria"],
  },
  details: {type: String, required: true},
  
  show: { type: Boolean },
});

const Notification = mongoose.model("Notifications", notificationsModel);

module.exports = Notification;
