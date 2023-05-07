const express = require('express');
const userRouter = require('./routes/userRouter');
const videogameRouter = require('./routes/videogameRouter');
const database = require('./database/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/auth');
const app = express();
const port = process.env.PORT || 3000;
const { multerMid } = require('./middlewares/multer')
const {reduceImageSize} = require('./middlewares/multer')
const errorHandler = require('./middlewares/errorHandler')

//Servidor en escucha
app.listen(port, () => {
    console.log('Servidor corriendo en el puerto ' + port);
});

//BodyParser
app.use(bodyParser.json());

//Url Encode
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

//Multer
app.use(multerMid.single('image'))
app.use(reduceImageSize)
app.use(errorHandler)
//CORS
app.use(cors({
    origin: true,
    credentials: true
}))

//Rutas
app.use(userRouter);
app.use(videogameRouter);
app.use(authRouter);


