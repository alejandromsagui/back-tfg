const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });


//Conexión a la base de datos
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(db => console.log('Conexión con la base de datos establecida'))
    .catch(err => console.log('Error: ', err));