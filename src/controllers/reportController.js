const reportModel = require("../models/reportModel");
const userModel = require("../models/usuarioModel");
const videogameModel = require("../models/videogameModel");
const notificationModel = require("../models/notificationModel");
const puppeteer = require("puppeteer")
const io = require("../index");
const { default: axios } = require("axios");

const getReports = async (req, res) => {
  try {
    if (req.user.rol === "Administrador") {
      const reports = await notificationModel.find();
      const userIds = reports.map((report) => report.user);

      const users = await userModel.find({ _id: { $in: userIds } });
      const userIdToNickname = users.reduce((acc, user) => {
        acc[user._id.toString()] = user.nickname;
        return acc;
      }, {});

      const getAllReports = reports.map((report) => ({
        id: report._id.toString(),
        user: userIdToNickname[report.user.toString()] || "",
        date: report.date,
        type: report.type,
        message: report.message,
        readed: report.readed,
        details: report.details
      }));

      res.status(200).json({ getAllReports });
    } else {
      res.status(400).json({ error: "Acción denegada" });
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

const deleteNotification = async (req, res) => {
  try {
    const id = req.params.id

    if (req.user.rol === "Administrador") {
      const notification = await notificationModel.findById(id)


      console.log('Valor de id: ', id);
      console.log('Valor de notification: ', notification._id.toString().toLowerCase());
      if (!notification) {
        return res.status(400).send({ error: "La notificación no existe" });
      }
      if (id === notification._id.toString()) {
        await notificationModel.findOneAndDelete({ _id: notification._id })
        return res.status(200).send({ message: "Notificación eliminada" })
      } else {
        return res.status(400).send({ error: "Los ids no coinciden" });
      }

    } else {
      return res.status(400).send({ error: "Acción denegada" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error al eliminar al usuario" });
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

    console.log('Valor de id: ', id);
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

    console.log('Valor req.user.nickname: ', req.user.nickname);
    console.log('Valor user data nickname: ', userData.nickname);
    console.log('Valor req.user.id: ', req.user.id);
    console.log('Valor userData id: ', userData.id);
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
        idVideogame: videogameData._id || '',
        nameVideogame: name || '',
        details: details
      });

      if (!videogameData) {
        return res
          .status(400)
          .send({ message: "El contenido del reporte no puede estar vacío" });
      }

      if (!nickname || !videogameData._id) {
        return res
          .status(400)
          .send({ message: "El contenido del reporte no puede estar vacío" });
      }

      await notification.save();

      const count = await notificationModel.countDocuments({ idVideogame: req.params.id })

      console.log('Lo que da count: ', count);
      console.log('Lo que da videogame model: ', videogameData._id);

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
      return res.status(400).send({ message: "Acción denegada" })
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

    const user = await userModel.findOne({ nickname: recommendation.nickname })
    if (!message) {
      return res.status(400).send({ message: "La recomendación no puede estar vacía" });
    }

    if (recommendation.type !== "Recomendación") {
      return res.status(400).send({ message: 'Acción no autorizada' })
    }
    if (recommendation.nickname !== user.nickname) {
      return res.status(400).send({ message: 'Acción no autorizada' })
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

const getVideogamesReported = async (req, res) => {
  try {
    const videogamesReported = await reportModel.find()
    return res.status(200).send(videogamesReported)
  } catch (error) {
    return res.status(500).send({ message: "Algo ha ido mal" });
  }
}

const changeReaded = async (req, res) => {
  try {
    const id = req.params.id;

    const notification = await notificationModel.findOne({ _id: id });

    if (!notification) {
      return res.status(400).send({ message: "Notificación no encontrada" });
    }

    if (req.user.rol === 'Administrador') {
      await notificationModel.findByIdAndUpdate(id, { readed: true });

      return res.status(200).send({ message: "Valor de 'readed' actualizado correctamente" });
    } else {
      return res.status(400).send({ message: "Acción no autorizada" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Algo ha ido mal" });
  }
}

const editDetailsNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const newDetails = req.body.details;

    const notification = await notificationModel.findById(notificationId);

    if (req.user.rol !== "Administrador") {
      {
        return res.status(400).send({ message: "Acción denegada" })
      }
    }

    console.log('lo que devuelve notification: ', notification);
    if (!notification) {
      return res.status(400).send({ message: "Notificación no encontrada" });
    }

    notification.details = newDetails;
    await notification.save();

    return res.status(200).send({ message: "Detalles de notificación actualizados correctamente", newDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Algo ha ido mal" });
  }
};

const exportReports = async (req, res) => {
  try {
    const fechaActual = new Date();

    // Calcular la fecha de inicio del mes actual
    const fechaInicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);

    // Calcular la fecha de fin del mes actual
    const fechaFinMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

    const transactionsData = await reportModel.find({
      createdAt: { $gte: fechaInicioMes, $lte: fechaFinMes }
    });

    const reportedVideogames = {};

    transactionsData.forEach(transaction => {
      const videogame = transaction.nameVideogame;
      const user = transaction.nickname;

      if (!reportedVideogames[videogame]) {
        reportedVideogames[videogame] = {};
      }

      if (!reportedVideogames[videogame][user]) {
        reportedVideogames[videogame][user] = 0;
      }

      reportedVideogames[videogame][user]++;
    });

    let tableRows = '';
    for (const videogame in reportedVideogames) {
      for (const user in reportedVideogames[videogame]) {
        const count = reportedVideogames[videogame][user];
        const row = `
          <tr>
            <td style="text-align: center">${user}</td>
            <td style="text-align: center">${videogame}</td>
            <td style="text-align: center">${count}</td>
          </tr>
        `;
        tableRows += row;
      }
    }



    const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Listado de reportes mensuales</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
  
      h1 {
        text-align: center;
      }
  
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
  
      th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
  
      th {
        background-color: #C62828;
        color: #fff !important;
      }
      
    </style>
  </head>
  <body>
    <div style="display: flex; align-items: center;">
      <img src="https://storage.googleapis.com/namekiansgames/Logo/logo.png" alt="Logo" style="width: 15%; height: auto; vertical-align: sub; margin-right: 20px; display: inline-block;">
      <h4 style="font-size: 18px; display: inline-block; margin-bottom: 15px !important; margin-left: 10px;">Gracias por comprar en Namekians<span style="color: #C62828;">Games</span></h4>
    </div>
  
    <h1 style="text-align: center; margin-top: 20px;">Listado de reportes mensuales</h1>
  
    <table>
  <thead>
    <tr style="text-align: center">
      <th style="text-align: center">Usuario</th>
      <th style="text-align: center">Videojuego</th>
      <th style="text-align: center">Número de reportes</th>
    </tr>
  </thead>
  <tbody style="text-align: center !important;">
    ${tableRows}
  </tbody>
</table>

    <sub style="margin-top: 50px !important;">Atentamente, el equipo de Namekians<span style="color: #C62828;">Games</span></sub>
  </body>
  </html>
`
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    // Configurar el contenido HTML de la página
    await page.setContent(htmlContent);

    // Generar el nombre de archivo
    const fileName = "reportes.pdf";

    // Generar el archivo PDF en memoria
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });

    // Establecer los encabezados adecuados
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reportes.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Enviar el archivo PDF como respuesta
    res.send(pdfBuffer);
    await browser.close()
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Ha ocurrido un error al exportar los datos" });
  }
}







module.exports = { blockUser, exportReports, changeReaded, deleteNotification, reportGame, getReports, newRecommendation, unblockUser, getVideogamesReported, editDetailsNotification };
