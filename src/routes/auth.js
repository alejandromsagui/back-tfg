const express = require('express');
const authRouter = express.Router();
const userModel = require ('../models/usuarioModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config({ path: '.env' });

authRouter.post('/login', async (req, res) => {

    const user = await userModel.findOne({nickname: req.body.nickname})
    if(!user) return res.status(400).json({ error: 'El usuario no es válido'})

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).json({error: 'La contraseña no es válida'})


    const token = jwt.sign({
        nickname: user.nickname
    }, process.env.JWT_SECRET);

    res.header('auth-token', token).json({
        error: null,
        data: {token}
    })
})

module.exports = authRouter;