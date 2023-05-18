const express = require('express');
const videogameRouter = express.Router();
const videogameController = require('../controllers/videogameController');
const verifyToken = require ('../middlewares/validate-token');
const checkTokenExpiration = require('../middlewares/expirationToken');

videogameRouter.get('/videogames', videogameController.getVideogames);
videogameRouter.post('/newVideogame', verifyToken, checkTokenExpiration, videogameController.newVideogame);
videogameRouter.put('/updateVideogame/:id', verifyToken, checkTokenExpiration, videogameController.updateVideogame);
videogameRouter.delete('/deleteVideogame/:id', verifyToken, checkTokenExpiration, videogameController.deleteVideogame);
videogameRouter.post('/uploads', verifyToken, checkTokenExpiration, videogameController.uploadVideogameImage);


module.exports = videogameRouter