const express = require('express');
const userRouter = require('./routes/userRouter');
const videogameRouter = require('./routes/videogameRouter');
const database = require('./database/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/auth');
// const validateToken = require('./middlewares')
const app = express();
const port = process.env.PORT || 3000;
const multerMid = require('./middlewares/multer')
const uploadImage = require('./helpers/upload')

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
//CORS
app.use(cors({
    origin: true,
    credentials: true
}))

//Rutas
app.use(userRouter);
app.use(videogameRouter);
app.use(authRouter);

//Ruta subida de imágenes
app.post('/uploads', async (req, res, next) => {
    try {
        const myFile = req.file
        const imageUrl = await uploadImage(myFile)
        res
            .status(200)
            .json({
                message: "Subida de imagen completada",
                data: imageUrl
            })
    } catch (error) {
        next(error)
    }
})

