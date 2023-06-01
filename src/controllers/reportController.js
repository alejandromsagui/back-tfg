const reportModel = require("../models/reportModel");
const userModel = require("../models/usuarioModel");
const videogameModel = require("../models/videogameModel");
const notificationModel = require("../models/notificationModel");
const io = require("../index");

const getReports = async (req, res) => {
  try {

    if(req.user.rol === "Administrador"){
      const reports = await notificationModel.find();
      const userIds = reports.map((report) => report.user);
  
      const users = await userModel.find({ _id: { $in: userIds } });
      const userIdToNickname = users.reduce((acc, user) => {
        acc[user._id.toString()] = user.nickname;
        return acc;
      }, {});
  
      const getAllReports = reports.map((report) => ({
        user: userIdToNickname[report.user.toString()] || "",
        date: report.date,
        type: report.type,
        message: report.message,
        show: report.show,
      }));
  
      res.status(200).json({ getAllReports });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error al visualizar los usuarios",
    });
  }
};

const blockUser = async (req, res) => {
  try {
    const username = req.params.nickname;

    const user = await userModel.findOne({ nickname: req.user.nickname });
    const isAdmin = req.user.rol;

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
        .send({ message: "Usuario bloqueado" });
    } else {
      return res.status(403).send({ message: "No estás autorizado" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Error al bloquear al usuario" });
  }
}

const unblockUser = async (req, res) => {
  try {
    const username = req.params.nickname;

    const user = await userModel.findOne({ nickname: req.user.nickname });
    const isAdmin = req.user.rol;

    if (isAdmin === "Administrador") {
      const updatedUser = await userModel.findOneAndUpdate(
        { nickname: username },
        { blocked: false },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).send({ error: "Error al desbloquear al usuario" });
      }

      return res
        .status(200)
        .send({ message: "Usuario desbloqueado" });
    } else {
      return res.status(403).send({ message: "No estás autorizado" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Error al bloquear al usuario" });
  }
}

const reportGame = async (req, res) => {
  try {
    const id = req.params.id;

    const nickname = req.user.nickname; 
    const currentTime = Date.now(); 

    
    const userReports = await reportModel.find({
      nickname: nickname,
      createdAt: {
        $gte: new Date(currentTime - 3600000), 
      },
    });

    const userData = await userModel.findOne({ nickname: nickname });
    console.log('Valor de userData: ', userData.nickname);
    console.log('Valor de req.nickname: ', req.user.nickname);
    console.log('Valor de userData._id: ', userData._id);
    console.log('Valor de req.id: ', req.user.id);
    if (userReports.length >= 1 && req.user.nickname === userData.nickname && req.user.id === userData._id.toString()) {


      await userModel.updateOne({ nickname: nickname }, { blocked: true });

      const message = `El usuario ${nickname} ha sido bloqueado por denunciar de manera frecuente`;

      // if(req.user.rol === "Administrador"){


      //   const io = req.app.get("io");
      //   io.emit("adminNotification", message);
      // }
      const videogameData = await videogameModel.findOne({ _id: id });
      const name = videogameData.name;
    
      const details = `El videojuego ${name} ha sido denunciado por contenido inapropiado`
      const notification = new notificationModel({
        type: "Reporte",
        user: req.user.id,
        message: message,
        nickname: nickname,
        idVideogame: id || '',
        nameVideogame: name || '',
        details: details
      });

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

      await notification.save();
      
    const count = await notificationModel.countDocuments({idVideogame: req.params.id})

    console.log('Lo que da count: ', count);
    const report = new reportModel({
      user: req.user.id,
      nickname: userData.nickname,
      videogame: videogameData._id,
      nameVideogame: videogameData.name,
      owner: videogameData.nickname,
      times: count
    });

    console.log('Objeto report: ', report);
    await report.save();

      return res.status(403).send({
        message:
          "Tu cuenta ha sido bloqueada por denunciar de manera frecuente",
      });
    } else {
      return res.status(400).send({ message: "Acción denegada"})
    }

  } catch (error) {
    console.log(error);
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

const newRecommendation = async (req, res) => {
  try {

    const message = `El usuario ${req.user.nickname} ha realizado una nueva recomendación`

    const recommendation = {
      type: "Recomendación",
      user: req.user.id,
      nickname: req.user.nickname,
      message: message,
      details: req.body.details
    };

    const user = await userModel.findOne({ nickname: recommendation.nickname})
    if (!message) {
      return res.status(400).send({ message: "La recomendación no puede estar vacía" });
    }

    if(recommendation.type !== "Recomendación"){
      return res.status(400).send({ message: 'Acción no autorizada'})
    }
    if(recommendation.nickname !== user.nickname){
      return res.status(400).send({ message: 'Acción no autorizada'})
    }

    if (!recommendation.details) {
      return res.status(400).send({ message: 'Debes indicar un mensaje de recomendación' });
    }
    
    console.log('Recommendation: ', req.body.details);
    console.log('User nickname: ', recommendation.details);

    notificationModel.create(recommendation);

    return res.status(200).send({
      message: "Gracias por tu aportación. La recomendación ha sido enviada",
    });
  } catch (error) {
    return res.status(500).send({ message: "Algo ha ido mal" });
  }
};

const getVideogamesReported = async(req, res) => {
  try {
    const videogamesReported = await reportModel.find()
    return res.status(200).send(videogamesReported)
  } catch (error) {
    return res.status(500).send({ message: "Algo ha ido mal" });
  }
}
module.exports = { blockUser, reportGame, getReports, newRecommendation, unblockUser, getVideogamesReported };
