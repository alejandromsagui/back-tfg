const userModel = require("../models/usuarioModel")

const isAdmin = async(req, res, next) => {
    const id = req.user.id

    const user = await userModel.findOne({ _id: id })
    
    if (user.rol === "Administrador") {
        next()
    } else {
        return res.status(403).send({ message: "Acceso denegado" })
    }
}

module.exports = isAdmin;