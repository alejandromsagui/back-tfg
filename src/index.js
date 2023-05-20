const express = require('express');
const userRouter = require('./routes/userRouter');
const videogameRouter = require('./routes/videogameRouter');
const paymentRouter = require('./routes/paymentRouter')
const transactionRouter = require('./routes/transactionRouter')
const ratingRouter = require('./routes/ratingRouter')
const database = require('./database/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/auth');
const app = express();
const port = process.env.PORT || 3000;
const { multerMid } = require('./middlewares/multer')
const { reduceImageSize } = require('./middlewares/multer')
const errorHandler = require('./middlewares/errorHandler')
const storage = require("./services/cloud")
const bucket = storage.bucket('namekiansgames')
const { format } = require('util');
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

//Servidor en escucha
server.listen(port, () => {
    console.log('Servidor corriendo en el puerto ' + port);
});

//BodyParser
app.use(bodyParser.json());

//Url Encode
app.use(bodyParser.urlencoded({ extended: true }));

//Multer
app.use(multerMid.single('image'))
app.use(reduceImageSize)
app.use(errorHandler)

//CORS
app.use(cors({
    origin: true,
    credentials: true
}))

app.post('/upload', async (file) => {
    try {
        const { originalname, buffer } = file
        const blob = bucket.file('Videojuegos/' + originalname)
        const blobStream = blob.createWriteStream({ resumable: false })
        const publicUrl = await new Promise((resolve, reject) => {
            blobStream
                .on('finish', () => {
                    const publicUrl = format(
                        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                    )
                    resolve(publicUrl)
                })
                .on('error', (error) => {
                    reject(new Error(`Error al subir la imagen: ${error.message}`))
                })
                .end(buffer)
        })
        return publicUrl
    } catch (error) {
        console.error(error.message)
        throw error
    }
})

//Rutas
app.use(userRouter);
app.use(videogameRouter);
app.use(authRouter);
app.use(paymentRouter);
app.use(transactionRouter);
app.use(ratingRouter);

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg.text);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});