const express = require('express');
const videogameRouter = express.Router();
const videogameController = require('../controllers/videogameController');
const isAuthenticated = require ('../middlewares/is-authenticated')

videogameRouter.get('/videogames', videogameController.getVideogames);
videogameRouter.post('/newVideogame', videogameController.newVideogame);
videogameRouter.put('/updateVideogame/:id', videogameController.updateVideogame);
videogameRouter.delete('/deleteVideogame/:id', videogameController.deleteVideogame);
videogameRouter.post('/uploads', videogameController.uploadVideogameImage);


module.exports = videogameRouter