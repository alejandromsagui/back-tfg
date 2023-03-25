const express = require('express');
const userRouter = require('./routes/userRouter');
const mongoose = require('mongoose');

const app = express();
const port = 3000;


// Routes
app.use(userRouter);

app.listen(port, () => {
    console.log('Servidor corriendo en el puerto ' + port);
});

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/NamekiansGames', {
    useNewUrlParser: true
}).then(db => console.log('Conexión con la base de datos establecida'))
    .catch(err => console.log('Error: ', err));