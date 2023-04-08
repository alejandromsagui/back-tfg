const express = require('express');
const authRouter = express.Router();
const userModel = require ('../models/usuarioModel');
const bcrypt = require("bcrypt");

authRouter.post('/login', async (req, res) => {

    const user = await userModel.findOne({nickname: req.body.nickname})
    if(!user) return res.status(400).json({ error: 'Usuario no encontrado'})

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).json({error: 'La contraseña no es válida'})

    res.json({
        error: null,
        data: 'Bienvenido'
    })
})

module.exports = authRouter;