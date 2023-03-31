const express = require('express');
const videogameRouter = express.Router();
const videogameController = require('../controllers/videogameController');

videogameRouter.get('/videogames', videogameController.getVideogames);
videogameRouter.post('/newVideogame', videogameController.newVideogame);


module.exports = videogameRouter