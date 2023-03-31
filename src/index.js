const express = require('express');
const userRouter = require('./routes/userRouter');
const database = require('./database/database')
const app = express();
const port = 3000;

//Servidor en escucha
app.listen(port, () => {
    console.log('Servidor corriendo en el puerto ' + port);
});

//Base de datos
database
//Rutas
app.use(userRouter);