const reportModel = require("../models/reportModel");
const userModel = require("../models/usuarioModel");
const videogameModel = require("../models/videogameModel");
const notificationModel = require("../models/nofitifactionsModel")
const io = require("../index");

const blockUser = async (req, res) => {
  try {
    const username = req.params.nickname;

    const user = await userModel.findOne({ nickname: req.user.nickname });
    const isAdmin = user.rol;

    if (isAdmin === "Administrador") {
      const updatedUser = await userModel.findOneAndUpdate(
        { nickname: username },
        { blocked: true },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).send({ error: "Error al bloquear al usuario" });
      }

      return res
        .status(200)
        .send({ message: "Usuario bloqueado y reporte creado" });
    } else {
      return res.status(403).send({ message: "No estás autorizado" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Error al bloquear al usuario" });
  }
};

const reportGame = async (req, res) => {
  try {
    const id = req.params.id;
    const nickname = req.user.nickname; // Recoge el nombre de usuario del middleware
    const currentTime = Date.now(); // Obtiene el tiempo actual en milisegundos

    // Realiza la lógica para contar las denuncias del usuario en la última hora
    const userReports = await reportModel.find({
      nickname: nickname,
      createdAt: {
        $gte: new Date(currentTime - 3600000), // Filtra las denuncias en la última hora
      },
    });

    const userData = await userModel.findOne({ nickname: nickname });

    if (userReports.length >= 1) {
      // El usuario ha realizado más de 5 denuncias en la última hora

      await userModel.updateOne({ nickname: nickname }, { blocked: true });

      const message = `El usuario ${nickname} ha sido bloqueado por denunciar de manera frecuente`

        const io = req.app.get("io");
        io.emit(
          "adminNotification",
          message
        )
      

      const notification = new notificationModel({
        type: "Reporte",
        user: req.user.id,
        message: message,
      });
      await notification.save();

      return res.status(403).send({
        message:
          "Tu cuenta ha sido bloqueada por denunciar de manera frecuente",
      });
    }

    const videogameData = await videogameModel.findOne({ _id: id });

    if (!videogameData) {
      return res
        .status(400)
        .send({ message: "El contenido del reporte no puede estar vacío" });
    }

    if (!nickname || !id) {
      return res
        .status(400)
        .send({ message: "El contenido del reporte no puede estar vacío" });
    }

    const report = new reportModel({
      user: req.user.id,
      nickname: nickname,
      videogame: videogameData._id,
      nameVideogame: videogameData.name,
      owner: videogameData.nickname,
    });

    await report.save();

    return res.status(200).send({ message: "Denuncia realizada" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .send({ message: "Error de validación", errors: validationErrors });
    } else {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Error al procesar la denuncia." });
    }
  }
};
module.exports = { blockUser, reportGame };
