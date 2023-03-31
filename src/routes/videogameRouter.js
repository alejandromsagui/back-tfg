const express = require('express');
const videogameRouter = express.Router();
const videogameController = require('../controllers/videogameController');

videogameRouter.get('/videogames', videogameController.getVideogames);
videogameRouter.post('/newVideogame', videogameController.newVideogame);
videogameRouter.put('/updateVideogame/:id', videogameController.updateVideogame);
videogameRouter.delete('/deleteVideogame/:id', videogameController.deleteVideogame);


module.exports = videogameRouter