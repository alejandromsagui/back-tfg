const User = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uploadAvatar = require("../helpers/upload")
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const downloadsFolder = require("downloads-folder");
const axios = require("axios")
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
        const username = req.user.nickname;
        const user = await User.findOne({ nickname: username })
        const newNickname = req.body.nickname

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (newNickname === username) {
            return res.status(400).send({ message: "El nombre de usuario debe ser diferente al actual" })
        }

        if (req.body.password === "") {
            return res.status(400).send({ message: "La contraseña no puede estar vacía" })
        }

        if (!validPassword) return res.status(400).send({ message: "La contraseña no es válida" })

        if (user.nickname !== newNickname) {
            const existingUser = await User.findOne({ nickname: newNickname });
            if (existingUser) {
                return res.status(400).send({ message: "El nombre de usuario ya está en uso" })
            }
        }

        if (!newNickname) {
            return res.status(400).send({ message: "El nuevo nombre de usuario es obligatorio" })
        }

        if (newNickname.length > 3) {
            await User.findOneAndUpdate({ nickname: username }, { nickname: newNickname }, { new: true });

            const token = jwt.sign(
                {
                    id: user.id,
                    nickname: newNickname,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            //   res.header("Authorization", token).json({
            //    token
            //   });

            return res.status(200)
                .header('Authorization', token)
                .send({
                    message: 'El nombre de usuario se ha actualizado correctamente',
                    data: {token}
                });
        } else {
            return res.status(400).send({ message: "El nombre de usuario debe ser superior a 3 caracteres" })
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Error al actualizar el usuario'
        });
    }
}

const isValidEmailRule = (val) => {
    const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val);
};


const updateEmail = async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email: email })
        const newEmail = req.body.email;

        if (req.body.password === "") {
            return res.status(400).send({ message: "La contraseña no puede estar vacía" })
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (newEmail === email) {
            return res.status(400).json({ message: "El correo electrónico no puede ser el mismo" })
        }

        if (!validPassword) return res.status(400).json({ message: "La contraseña no es válida" })

        if (!newEmail) {
            return res.status(400).send({ message: "El nuevo correo electrónico es obligatorio" })
        }

        if (!isValidEmailRule(newEmail)) {
            return res.status(400).send({ message: "El correo electrónico no tiene un válido" })
        }
        if (user.email !== newEmail) {
            const existingEmail = await User.findOne({ email: newEmail })
            if (existingEmail) {
                return res.status(400).send({ message: "El correo electrónico ya está en uso" })
            }
        }


        await User.findOneAndUpdate({ email: email }, { email: newEmail }, { new: true });

        const token = jwt.sign(
            {
                id: user.id,
                nickname: newEmail,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200)
            .header('Authorization', token)
            .json({
                message: 'El correo se ha actualizado correctamente'
            });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Error al actualizar el correo'
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const username = req.user.nickname;
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


        if(newPassword.length > 5){
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const update = { password: hashedPassword };
            await User.findOneAndUpdate({ nickname: username }, update, { new: true });

            
        return res.status(200).json({
            message: 'La contraseña se ha actualizado correctamente'
        });
        } else {
            return res.status(400).json({
                message: 'La nueva contraseña tiene que ser superior a 5 caracteres'
            });
        }

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

const exportData = async(req, res) => {
    try {
        const transactions = await axios.get(`${process.env.HOST}/findTransaction/${req.user.nickname}`)
        
        const transactionsData = transactions.data;

        let tableRows = '';
        for (let i = 0; i < transactionsData.length; i++) {
          const transaction = transactionsData[i];
          const row = `
            <tr>
              <td>${transaction.videogame}</td>
              <td>${transaction.nicknameBuyer === req.user.nickname ? 'Compra' : 'Venta'}</td>
              <td>${transaction.price / 10}€</td>
              <td>${transaction.date}</td>
            </tr>
          `;
          tableRows += row;
        }
      const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Factura Mensual</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
      
          h1 {
            text-align: center;
          }
      
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
      
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
      
          th {
            background-color: #C62828;
            color: #fff !important;
          }
          
        </style>
      </head>
      <body>
        <div style="display: flex; align-items: center;">
          <img src="https://storage.googleapis.com/namekiansgames/Logo/logo.png" alt="Logo" style="width: 15%; height: auto; vertical-align: sub; margin-right: 20px; display: inline-block;">
          <h4 style="font-size: 18px; display: inline-block; margin-bottom: 15px !important; margin-left: 10px;">Gracias por comprar en Namekians<span style="color: #C62828;">Games</span></h4>
        </div>
      
        <h1 style="text-align: center; margin-top: 20px;">Factura mensual</h1>
      
        <table>
          <thead>
            <tr>
              <th>Videojuego</th>
              <th>Tipo de operación</th>
              <th>Precio</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
          ${tableRows}
        </tbody>
        </table>
        <sub style="margin-top: 50px !important;">Atentamente, el equipo de Namekians<span style="color: #C62828;">Games</span></sub>
      </body>
      </html>
    `  
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Configurar el contenido HTML de la página
    await page.setContent(htmlContent);
    
    // Generar el nombre de archivo
    const fileName = "transacciones.pdf";
    
    // Generar el archivo PDF en memoria
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
    
    // Establecer los encabezados adecuados
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Enviar el archivo PDF como respuesta
    res.send(pdfBuffer);
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Ha ocurrido un error al exportar los datos" });
  }
}

module.exports = { exportData, getUsers, deleteUserByAdmin, getUsersAdmin, updateUser, getEmail, deleteUser, updatePassword, getNickname, updateNickname, updateEmail, getPermission, getUser, updateNamekoins, uploadAvatarImage, getNamekoins }