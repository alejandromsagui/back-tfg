const User = require("../models/usuarioModel");
const bcrypt = require("bcrypt");

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


module.exports = { getUsers, newUser, updateUser, deleteUser, updatePassword }