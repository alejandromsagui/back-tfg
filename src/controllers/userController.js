const User = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config({ path: '.env' });

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'ok',
            users
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Error al visualizar los usuarios',
            err
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const update = { nickname: req.body.nickname, email: req.body.email };
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send({
                message: 'El usuario no existe'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(id, update, { new: true });

        return res.status(200).json({
            message: 'El usuario se ha actualizado correctamente',
            updatedUser
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error al actualizar el usuario',
            err
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).send({
                message: 'El usuario no existe'
            })
        }

        return res.status(200).send({
            message: 'El usuario ha sido eliminado correctamente'
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Error en el servidor',
            err
        });
    }
}

const updatePassword = async (req, res) => {
    try {
        const username = req.params.nickname;
        const update = { password: req.body.password };
        const hashedPassword = bcrypt.hashSync(update.password, 10);
        update.password = hashedPassword;
        const user = await User.findOne({ nickname: username });

        if (!user) {
            return res.status(404).send({
                message: 'El usuario no existe'
            })
        }

        const updatedUser = await User.findOneAndUpdate({ nickname: username }, update, { new: true });

        return res.status(200).json({
            message: 'La contraseña se ha actualizado correctamente',
            updatedUser
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Error en el servidor',
            err
        });
    }
}

const getNickname = async (req, res) => {
    try {
        const username = req.params.nickname;
        const user = await User.findOne({nickname: username})

        if (!user) {
            return res.status(404).send({
                message: 'El usuario no ha sido encontrado'
            })
        }

        return res.status(200).send({
            message: 'El usuario existe'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al encontrar al usuario',
            error
        });
    }
}

const getEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({email: email})

        if (!user) {
            return res.status(404).send({
                message: 'El email no se ha encontrado'
            })
        }

        return res.status(200).send({
            message: 'El email existe'
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al encontrar el email',
            error
        });
    }
}



module.exports = { getUsers, updateUser, deleteUser, updatePassword, getNickname, getEmail }