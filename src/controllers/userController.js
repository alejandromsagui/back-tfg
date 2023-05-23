const User = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uploadAvatar = require("../helpers/upload")
require('dotenv').config({ path: '.env' });

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, { nickname: 1, email: 1 });
        const transformedUsers = users.map(user => ({ nickname: user.nickname, email: user.email }));
        res.status(200).json({
            status: 'ok',
            users: transformedUsers
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Error al visualizar los usuarios',
        });
    }
}

const getUsersAdmin = async (req, res) => {
    try {
        const users = await User.find({}, { nickname: 1, email: 1, blocked: 1 });
        const transformedUsers = users.map(user => ({ nickname: user.nickname, email: user.email, blocked: user.blocked }));
        res.status(200).json({
            status: 'ok',
            users: transformedUsers
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Error al visualizar los usuarios',
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
                message: 'Algo ha ido mal'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(id, update, { new: true });

        return res.status(200).json({
            message: 'El usuario se ha actualizado correctamente'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Algo ha ido mal',
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).send({
                message: 'Algo ha ido mal'
            })
        }

        if (req.user.id === user.id) {
            return res.status(200).send({
                message: 'Tu cuenta ha sido eliminado correctamente'
            })
        }

    } catch (err) {
        return res.status(500).json({
            message: 'Algo ha ido mal'
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
            return res.status(400).json({ message: "Debe proporcionar un nombre de usuario válido" })
        }

        if (update.nickname === username) {
            return res.status(400).json({ message: "El nombre de usuario debe ser diferente al actual" })
        }
        if (!validPassword) return res.status(400).json({ message: "La contraseña no es válida" })

        const existingUser = await User.findOne({ nickname: update.nickname });

        if (existingUser) {
            return res.status(400).json({ message: "El nombre de usuario ya está en uso" })
        }
        const updatedUser = await User.findOneAndUpdate({ nickname: username }, update, { new: true });

        return res.status(200).json({
            message: 'El nombre de usuario se ha actualizado correctamente'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error al actualizar el usuario'
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
            return res.status(400).json({ message: "Debe proporcionar un correo válido" })
        }

        if (update.email === email) {
            return res.status(400).json({ message: "El correo debe ser diferente al actual" })
        }
        if (!validPassword) return res.status(400).json({ message: "La contraseña no es válida" })

        const existingEmail = await User.findOne({ email: update.email });

        if (existingEmail) {
            return res.status(400).json({ message: "El correo proporcionado ya está en uso" })
        }


        await User.findOneAndUpdate({ email: email }, update, { new: true });

        return res.status(200).json({
            message: 'El correo se ha actualizado correctamente'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error al actualizar el correo'
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
            return res.status(400).send({
                message: 'Algo ha ido mal'
            });
        }

        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
            return res.status(400).send({
                message: 'La contraseña antigua no es válida'
            });
        }

        if (oldPassword === newPassword) return res.status(400).json({ message: 'La contraseña nueva no puede coincidir con la antigua' })

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const update = { password: hashedPassword };
        await User.findOneAndUpdate({ nickname: username }, update, { new: true });

        return res.status(200).json({
            message: 'La contraseña se ha actualizado correctamente'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Algo ha ido mal'
        });
    }
};

const getNickname = async (req, res) => {
    try {
        const username = req.params.nickname;
        const user = await User.findOne({ nickname: username })

        if (!user) {
            return res.status(400).send({
                message: 'Ha ocurrido un error'
            })
        }

        return res.status(200).send({
            user: user.nickname
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Ha ocurrido un error'
        });
    }
}

const getNamekoins = async (req, res) => {
    try {
        const username = req.params.nickname;
        const user = await User.findOne({ nickname: username })

        if (!user) {
            return res.status(400).send({
                message: 'Algo ha ido mal'
            })
        }

        console.log('Valor de usuario del middleware: ', req.user.nickname);
        console.log('Valor de usuario: : ', req.user.nickname);
        if ((req.user.nickname === user.nickname)) {
            return res.status(200).send({
                coins: user.number_namekoins
            })
        } else {
            return res.status(401).send({
                message: 'Algo ha ido mal'
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: 'Algo ha ido mal'
        });
    }
}

const getPermission = async (req, res) => {
    try {
        const username = req.params.nickname;
        const user = await User.findOne({ nickname: username })

        if (!user) {
            return res.status(404).send({
                message: 'Algo ha ido mal'
            })
        }

        if (req.user.nickname === user.nickname) {
            if (user.rol === 'Administrador') {
                return res.status(200).send({
                    isAdmin: true
                })
            } else {
                return res.status(200).send({
                    isAdmin: false
                })
            }
        } else {
            return res.status(401).semd({
                message: 'Algo ha ido mal'
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: 'Algo ha ido mal'
        });
    }
}

const getEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(404).send({
                message: 'Algo ha ido mal'
            })
        }

        if (user.email === req.user.email) {
            return res.status(200).send({
                user: user.email
            })
        } else {
            return res.status(400).send({
                message: 'Algo ha ido mal'
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: 'Algo ha ido mal'
        });
    }
}

const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ id: id })

        if (!user) {
            return res.status(404).send({
                message: 'Algo ha ido mal'
            })
        }

        return res.status(200).send({
            user: user.id
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Algo ha ido mal'
        });
    }
}

const updateNamekoins = async (req, res) => {
    try {
        const id = req.params.id;
        const update = { number_namekoins: req.body.number_namekoins };
        const user = await User.findById(id);

        if (!user) {
            return res.status(400).send({
                message: 'Error al actualizar el número de Namekoins'
            });
        }

        console.log('Id de usuario desde middleware: ' + req.user.id);
        console.log('Id de usuario' + user._id);

        if (req.user.id === user.id) {
            await User.findByIdAndUpdate(id, update, { new: true });

            return res.status(200).json({
                message: 'Número de Namekoins actualizados correctamente',
                coins: user.number_namekoins
            })
        } else {
            return res.status(400).send({ message: 'Error al actualizar el número de Namekoins' })
        }

    } catch (err) {
        return res.status(500).json({
            message: 'Error al actualizar el número de Namekoins',
        });
    }
};

const uploadAvatarImage = async (req, res, next) => {
    try {
        const myFile = req.file
        const imageUrl = await uploadAvatar(myFile)
        const urlCover = imageUrl
        console.log('Valor de urlCover: ' + urlCover);
        return urlCover
    } catch (error) {
        console.log(error);
    }
}

const deleteUserByAdmin = async (req, res) => {
    try {
        const username = req.params.nickname;

        const user = await User.findOneAndDelete({ nickname: username })

        console.log('Usuario devuelto por user: ', user);

        if (!user) {
            return res.status(400).send({ message: 'Algo ha ido mal' })
        }

        return res.status(200).send({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
        
        return res.status(500).send({ message: 'Algo ha ido mal' })
    }
}

module.exports = { getUsers, deleteUserByAdmin, getUsersAdmin, updateUser, getEmail, deleteUser, updatePassword, getNickname, updateNickname, updateEmail, getPermission, getUser, updateNamekoins, uploadAvatarImage, getNamekoins }