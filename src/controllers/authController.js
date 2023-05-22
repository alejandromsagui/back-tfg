const userModel = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../services/mailer");
const { generateCode } = require("../services/generate-code");
const verifyToken = require("../middlewares/validate-token");
require("dotenv").config({ path: ".env" });

//Función que valida y registra al usuario si cumple con las condiciones establecidas
const newUser = async (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);

  try {
    const user = {
      nickname: req.body.nickname,
      email: req.body.email,
      password: hash,
    };

    const userModelInstance = new userModel(user);

    await userModelInstance.validate();

    const nicknameExists = await userModel.findOne({ nickname: user.nickname });
    const emailExists = await userModel.findOne({ email: user.email });

    if (nicknameExists) {
      return res
        .status(400)
        .send({ message: "El nombre de usuario ya está en uso" });
    }

    if (emailExists) {
      return res
        .status(400)
        .send({ message: "El correo electrónico ya está en uso" });
    }

    if (req.body.password.length < 6) {
      return res
        .status(400)
        .send({ message: "La contraseña debe tener al menos 5 caracteres" });
    }

    await userModel.create(user);
    return res
      .status(200)
      .send({ message: "El usuario se ha creado correctamente" });
  } catch (err) {
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map(
        (error) => error.message
      );
      return res.status(400).json({ message: validationErrors });
    }

    return res.status(500).json({
      message: "Ha ocurrido un error al crear el usuario",
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await userModel.findOne({
      $or: [{ nickname: req.body.nickname }, { email: req.body.email }],
    });

    if (!user) {
      return res
        .status(400)
        .send({ error: "Nombre de usuario o contraseña incorrectos" });
    }

    const validPassword = await bcrypt.compare(
      "" + req.body.password,
      user.password
    );
    if (!validPassword) {
      return res
        .status(400)
        .send({ error: "Nombre de usuario o contraseña incorrectos" });
    }

    if (user.blocked) {
      return res.status(403).send({
        error:
          "Tu usuario está bloqueado. Por favor, contacta con el administrador para recuperar tu cuenta.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.header("Authorization", token).json({
      error: null,
      data: { token },
    });
  } catch (error) {
    console.log("Error: " + error);
    return res
      .status(500)
      .json({ error: "Nombre de usuario o contraseña incorrectos" });
  }
};

//Recuperar contraseña
const recoveryPassword = async (req, res) => {
  const code = generateCode();

  try {
    const user = await userModel.findOne({
      $or: [{ nickname: req.body.nickname }, { email: req.body.email }],
    });

    console.log("Nombre de usuario: " + user.nickname);
    console.log("Correo: " + user.email);

    if (user) {
      res.status(200).send({
        message:
          "Si existe, recibirás en tu correo electrónico el código para modificar tu cuenta",
      });
      transporter.sendMail({
        from: "NamekiansGames  <namekiansgames@gmail.com>",
        to: user.email,
        subject: "Correo de recuperación de contraseña ✔",
        html:
          "<!doctype html><html><head> <meta name='viewport' content='width=device-width, initial-scale=1.0' /> <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /> <title>Recuperación de contraseña.</title> <style> @import url('https://fonts.googleapis.com/css2?family=Alegreya+Sans+SC:wght@700&display=swap'); img { border: none; -ms-interpolation-mode: bicubic; max-width: 100%; } body { font-family: 'Alegreya Sans SC', sans-serif;; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } table { border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; } table td { font-family: sans-serif; font-size: 14px; vertical-align: top; } /* ------------------------------------- BODY & CONTAINER ------------------------------------- */ .body { width: 100%; } /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */ .container { display: block; margin: 0 auto !important; /* makes it centered */ max-width: 580px; padding: 10px; width: 580px; } /* This should also be a block element, so that it will fill 100% of the .container */ .content { box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px; } /* ------------------------------------- HEADER, FOOTER, MAIN ------------------------------------- */ .main { background: #ffffff; border-radius: 3px; width: 100%; } .wrapper { box-sizing: border-box; padding: 20px; } .content-block { padding-bottom: 10px; padding-top: 10px; } .footer { clear: both; margin-top: 10px; text-align: center; width: 100%; } .footer td, .footer p, .footer span, .footer a { color: #999999; font-size: 12px; text-align: center; } /* ------------------------------------- TYPOGRAPHY ------------------------------------- */ h1, h2, h3, h4 { color: #000000; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; margin-bottom: 30px; } h1 { font-size: 35px; font-weight: 300; text-align: center; text-transform: capitalize; } p, ul, ol { font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px; } p li, ul li, ol li { list-style-position: inside; margin-left: 5px; } a { color: #3498db; text-decoration: underline; } /* ------------------------------------- BUTTONS ------------------------------------- */ .btn { box-sizing: border-box; width: 100%; } .btn>tbody>tr>td { padding-bottom: 15px; } .btn table { width: auto; } .btn table td { background-color: #ffffff; border-radius: 5px; text-align: center; } .btn a { background-color: #ffffff; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; color: #3498db; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; } .btn-primary table td { background-color: #3498db; } .btn-primary a { background-color: #3498db; border-color: #3498db; color: #ffffff; } /* ------------------------------------- OTHER STYLES THAT MIGHT BE USEFUL ------------------------------------- */ .last { margin-bottom: 0; } .first { margin-top: 0; } .align-center { text-align: center; } .align-right { text-align: right; } .align-left { text-align: left; } .clear { clear: both; } .mt0 { margin-top: 0; } .mb0 { margin-bottom: 0; } .preheader { color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0; } .powered-by a { text-decoration: none; } hr { border: 0; border-bottom: 1px solid #f6f6f6; margin: 20px 0; } /* ------------------------------------- RESPONSIVE AND MOBILE FRIENDLY STYLES ------------------------------------- */ @media only screen and (max-width: 620px) { table.body h1 { font-size: 28px !important; margin-bottom: 10px !important; } table.body p, table.body ul, table.body ol, table.body td, table.body span, table.body a { font-size: 16px !important; } table.body .wrapper, table.body .article { padding: 10px !important; } table.body .content { padding: 0 !important; } table.body .container { padding: 0 !important; width: 100% !important; } table.body .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table.body .btn table { width: 100% !important; } table.body .btn a { width: 100% !important; } table.body .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #34495e !important; } .btn-primary a:hover { background-color: #34495e !important; border-color: #34495e !important; } } </style></head><body> <table role='presentation' border='0' cellpadding='0' cellspacing='0' class='body'> <tr> <td>&nbsp;</td> <td class='container'> <div class='content'> <!-- START CENTERED WHITE CONTAINER --> <table role='presentation' class='main' style='background-color: #2B2B2B;'> <!-- START MAIN CONTENT AREA --> <tr> <td class='wrapper'> <table role='presentation' border='0' cellpadding='0' cellspacing='0'> <tr> <td> <img src='https://storage.googleapis.com/namekiansgames/Logo/logo.png' alt='Logo' style='display: inline-block; width: 15%; height: auto; vertical-align: sub'> <h2 style='display: inline-block; margin-left: 20px; vertical-align: middle; font-weight: bold; color: #fff; margin-bottom: 60px; margin-top: 20px;' ><span>Namekians</span><span style='color: #F80808; font-weight:bold;'>Games</span></h2> <h3 style='color: #fff;'>Hola gamer. Aquí tienes el código de recuperación que necesitas para poder acceder a tu cuenta nuevamente:</h3> <div style='background-color: #F80808; width: 50%; margin: 0 auto; text-align: center; '> <h3 style='padding: 10px; color: #fff; font-weight: bold;'>" +
          code +
          "</h3> </div> <h3 style='color: #fff;'>Este código se ha generado a partir de una petición de recuperación de contraseña.</h3> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- END CENTERED WHITE CONTAINER --> <!-- START FOOTER --> <div class='footer'> <table role='presentation' border='0' cellpadding='0' cellspacing='0'> <tr> <td class='content-block powered-by' style='color: #000000'> Atentamente, el equipo de <a href='https://namekiansgames.herokuapp.com/' style='color: #000000'>Namekians<span style='color: #F80808;'>Games</span></a>. </td> </tr> </table> </div> <!-- END FOOTER --> </div> </td> </tr> </table></body></html>",
      });
    } else {
      res.status(200).send({
        message:
          "Si existe, recibirás en tu correo electrónico el código para modificar tu cuenta",
      });
    }
  } catch (error) {
    res
      .status(200)
      .send(
        "Si existe, recibirás en tu correo electrónico el código para modificar tu cuenta"
      );
  }
};

const decodeToken = (req, res) => {
  const user = req.user;
  res.status(200).json({ user });
};

const updateToken = async (req, res) => {
  const user = await userModel.findOne({
    $or: [{ nickname: req.body.nickname }, { email: req.body.email }],
  });

  const token = jwt.sign(
    {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.header("Authorization", token).json({
    error: null,
    data: { token },
  });
};

const parseJwt = (req, res) => {
  const token = req.header("Authorization");
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const buffer = Buffer.from(base64, "base64");
  const decode = JSON.parse(buffer.toString());
  console.log("Decode: ", decode);
  const expirationTimeInSeconds = decode.exp;
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  if (expirationTimeInSeconds < currentTimeInSeconds) {
    res.status(401).json({ error: "Token expirado" });
  } 


};
module.exports = {
  newUser,
  login,
  recoveryPassword,
  decodeToken,
  updateToken,
  parseJwt,
};
