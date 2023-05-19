const express = require('express');
const videogameRouter = express.Router();
const videogameController = require('../controllers/videogameController');
const verifyToken = require ('../middlewares/validate-token');
const checkTokenExpiration = require('../middlewares/expirationToken');

videogameRouter.get('/videogames', videogameController.getVideogames);
videogameRouter.post('/newVideogame', verifyToken, videogameController.newVideogame);
videogameRouter.put('/updateVideogame/:id', verifyToken, videogameController.updateVideogame);
videogameRouter.delete('/deleteVideogame/:id', verifyToken, videogameController.deleteVideogame);
videogameRouter.post('/uploads', verifyToken, videogameController.uploadVideogameImage);


module.exports = videogameRouter