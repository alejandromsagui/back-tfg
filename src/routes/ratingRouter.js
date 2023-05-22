const express = require('express');
const verifyToken = require("../middlewares/validate-token")
const ratingController = require("../controllers/ratingController")
const checkTokenExpiration = require("../middlewares/expirationToken")
const ratingRouter = express.Router();

ratingRouter.get('/ratings/:nickname', ratingController.getRatings)
ratingRouter.post('/newRating', verifyToken, ratingController.newRating)
ratingRouter.get('/allRatings', ratingController.ratings)

module.exports = ratingRouter;