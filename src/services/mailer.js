const nodemailer = require("nodemailer");
require('dotenv').config({ path: '.env' });

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWD
    }
})

transporter.verify().then(() => {
    console.log('Listo para enviar emails');
})

module.exports = transporter;