const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'namekiansgames@gmail.com',
        pass: 'dqfhwubyfnkugvbo'
    }
})

transporter.verify().then(() => {
    console.log('Listo para enviar emails');
})

module.exports = transporter;