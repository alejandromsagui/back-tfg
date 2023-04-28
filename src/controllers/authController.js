const userModel = require ('../models/usuarioModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../services/mailer");
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

        const userDB = await userModel.create(user);

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

    const user = await userModel.findOne({
        $or: [
            { nickname: req.body.nickname },
            { email: req.body.email }
        ]
    });

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


const recoveryPassword = async (req, res) => {

    try {
        const user = await userModel.findOne({
            $or: [
                { nickname: req.body.nickname },
                { email: req.body.email }
            ]
        })

        console.log('Datos de nickname: '+ user.email);
        console.log('Datos de email: '+ user.email);

        if (user) {

            res.status(200).send({
                message: 'Email o nombre de usuario correcto'
            })
            transporter.sendMail({
                from: '"Correo de recuperación de contraseña 👻" <namekiansgames@gmail.com>',
                to: user.email,
                subject: "NamekiansGames - Correo de recuperación de contraseña ✔",
                text: "Pulsa en este enlace para recuperar tu contraseña:",
                // html: "<b>Hello world?</b>",
            });

        } else {
            res.status(404).send({
                message: 'Email o nombre de usuario no encontrado'
            })
        }

        
        

    } catch (error) {
        if (error) {
            console.log(error);
            res.status(500).send('Error al enviar el correo electrónico');
        }
    }
}

module.exports = { newUser, login, recoveryPassword }