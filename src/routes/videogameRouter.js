const express = require('express');
const videogameRouter = express.Router();
const videogameController = require('../controllers/videogameController');
const verifyToken = require ('../middlewares/validate-token');
const checkTokenExpiration = require('../middlewares/expirationToken');

videogameRouter.get('/videogames', videogameController.getVideogames);
videogameRouter.get('/getVideogames', verifyToken, videogameController.getVideogamesByUser)
videogameRouter.post('/newVideogame', verifyToken, videogameController.newVideogame);
videogameRouter.put('/updateVideogame/:id', verifyToken, videogameController.updateVideogame);
videogameRouter.put('/updateState/:id', verifyToken, videogameController.updateState);
videogameRouter.delete('/deleteVideogame/:id', verifyToken, videogameController.deleteVideogame);
videogameRouter.get('/getVideogameById/:id', verifyToken, videogameController.getVideogameById);
videogameRouter.delete('/deleteVideogameByAdmin/:id', verifyToken, videogameController.deleteVideogameByAdmin)
videogameRouter.post('/uploads', verifyToken, videogameController.uploadVideogameImage);



module.exports = videogameRouter