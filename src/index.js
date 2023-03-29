const express = require('express');
const userRouter = require('./routes/userRouter');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const app = express();
const port = 3000;

//Servidor en escucha
app.listen(port, () => {
    console.log('Servidor corriendo en el puerto ' + port);
});

//Conexión a la base de datos
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => console.log('Conexión con la base de datos establecida'))
    .catch(err => console.log('Error: ', err));

//Rutas
app.use(userRouter);