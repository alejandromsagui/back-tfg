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
const rankingRouter = require("./routes/rankingRouter")
const bucket = storage.bucket('namekiansgames')
const { format } = require('util');
const reportRouter = require("./routes/reportRouter")
const authController = require("./controllers/authController")
const userModel = require("./models/usuarioModel")
const exportData = require("./services/export-data")
const http = require('http');
const verifyToken = require ('./middlewares/validate-token')
const server = http.createServer(app);
const enforce = require('express-sslify');

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:8000", "http://127.0.0.1:8000", 'https://namekiansgames.herokuapp.com'],
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Access-Control-Allow-Origin"]
    }
});

//Servidor en escucha
server.listen(port, () => {
    console.log('Servidor corriendo en el puerto ' + port);
});

if (process.env.NODE_ENV === 'production') {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }
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
    origin: 'https://namekiansgames.herokuapp.com',
    credentials: true
}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://namekiansgames.herokuapp.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.set('io', io)

//Rutas
app.use(userRouter);
app.use(videogameRouter);
app.use(authRouter);
app.use(paymentRouter);
app.use(transactionRouter);
app.use(ratingRouter);
app.use(reportRouter)
app.use(rankingRouter)


io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');
  
    // Enviar mensaje de conexión a todos los clientes
    const mensaje = 'Se ha establecido la conexión con el servidor';
    io.emit('conexion', mensaje);
    console.log('Mensaje de conexión enviado a todos los clientes: ', mensaje);
  
    // Enviar número de usuarios activos a todos los clientes
    io.emit('userCount', io.engine.clientsCount);
    console.log('Número de usuarios activos enviado a todos los clientes: ', io.engine.clientsCount);
  
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg.message.text);
      io.emit('chat message', msg.message.text);
    });
  
    socket.on('disconnect', () => {
      console.log('Un usuario se ha desconectado');
      io.emit('userCount', io.engine.clientsCount);
    });
  });
  



