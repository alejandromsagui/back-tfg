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

const updateNickname = async (req, res) => {
    try {
        const username = req.params.nickname;
        const update = { nickname: req.body.nickname };
        const user = await User.findOne({ nickname: username })

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!update.nickname || update.nickname === "") {
            return res.status(200).json({message: "Debe proporcionar un nombre de usuario válido"})
        }
        
        if (update.nickname === username) {
            return res.status(200).json({message: "El nombre de usuario debe ser diferente al actual"})
        }
        if(!validPassword) return res.status(200).json({message: "La contraseña no es válida"})

        const existingUser = await User.findOne({ nickname: update.nickname });

        if (existingUser) {
            return res.status(200).json({message: "El nombre de usuario ya está en uso"})
        }

        const updatedUser = await User.findOneAndUpdate({nickname: username}, update, { new: true });

        const payload = { username: updatedUser.nickname, email: updatedUser.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return res.status(200).json({
            message: 'El nombre de usuario se ha actualizado correctamente',
            updatedUser,
            token
        });
    } catch (err) {
        return res.status(200).json({
            message: 'Error al actualizar el usuario',
            err
        });
    }
};

const updateEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const update = { email: req.body.email };
        const user = await User.findOne({ email: email })

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!update.email || update.email === "") {
            return res.status(200).json({message: "Debe proporcionar un correo válido"})
        }
        
        if (update.email === email) {
            return res.status(200).json({message: "El correo debe ser diferente al actual"})
        }
        if(!validPassword) return res.status(200).json({message: "La contraseña no es válida"})

        const existingEmail = await User.findOne({ email: update.email });

        if (existingEmail) {
            return res.status(200).json({message: "El correo proporcionado ya está en uso"})
        }

        const updatedUser = await User.findOneAndUpdate({email: email}, update, { new: true });

        return res.status(200).json({
            message: 'El correo se ha actualizado correctamente',
            updatedUser
        });
    } catch (err) {
        return res.status(200).json({
            message: 'Error al actualizar el correo',
            err
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const username = req.params.nickname;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        
        const user = await User.findOne({ nickname: username });

        if (!user) {
            return res.status(200).send({
                message: 'El usuario no existe'
            });
        }

        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
            return res.status(200).send({
                message: 'La contraseña antigua no es válida'
            });
        }

        if(oldPassword === newPassword) return res.status(200).json({message: 'La contraseña nueva no puede coincidir con la antigua'})

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const update = { password: hashedPassword };
        const updatedUser = await User.findOneAndUpdate({ nickname: username }, update, { new: true });

        return res.status(200).json({
            message: 'La contraseña se ha actualizado correctamente',
            updatedUser
        });
    } catch (err) {
        return res.status(200).json({
            message: 'Error en el servidor',
            err
        });
    }
};

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



module.exports = { getUsers, updateUser, deleteUser, updatePassword, getNickname, getEmail, updateNickname, updateEmail }