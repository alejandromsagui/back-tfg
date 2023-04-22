const User = require('../models/usuarioModel')
const userModel = require ('../models/usuarioModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config({ path: '.env' });

const newUser = async (req, res) => {

    const hash = bcrypt.hashSync(req.body.password, 10);

    try {

        const user = ({
            nickname: req.body.nickname,
            email: req.body.email,
            password: hash,
            number_namekoins: 0,
            number_transactions: 0
        });

        const userDB = await User.create(user);

        return res.status(200).json({
            message: 'El usuario se ha creado correctamente',
            userDB
        })

    } catch (err) {
        return res.status(500).json({
            message: 'Error al crear el usuario',
            err
        })
    }
}

const login = async(req, res) => {

    const user = await userModel.findOne({nickname: req.body.nickname})
    if(!user) return res.status(400).json({ error: 'El usuario no es válido'})

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).json({error: 'La contraseña no es válida'})


    const token = jwt.sign({
        nickname: user.nickname
    }, process.env.JWT_SECRET);

    res.header('token', token).json({
        error: null,
        data: {token}
    })
}

module.exports = { newUser, login }