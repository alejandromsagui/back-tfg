const reportModel = require("../models/reportModel");
const userModel = require("../models/usuarioModel");

const blockUser = async (req, res) => {
  try {
    const username = req.params.nickname;

    const user = await userModel.findOne({ nickname: req.user.nickname})
    const isAdmin = user.rol;

    if(isAdmin === "Administrador"){
        const updatedUser = await userModel.findOneAndUpdate(
            { nickname: username },
            { blocked: true },
            { new: true }
          );
          
          if (!updatedUser) {
            return res.status(400).send({ error: "Error al bloquear al usuario" });
          }
      
          const report = new reportModel({
            user: updatedUser._id,
            nickname: updatedUser.nickname,
            videogame: null, 
          });
      
          await report.save();
      
          return res
            .status(200)
            .json({ message: "Usuario bloqueado y reporte creado" });
    } else {
        return res.status(403).send({message: "No estás autorizado"})
    }

  } catch (error) {
    console.log("Error: " + error);
    return res
      .status(500)
      .send({ error: "Error al bloquear al usuario" });
  }
};
module.exports = { blockUser };
