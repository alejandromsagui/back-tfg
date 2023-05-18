const express = require('express');
const verifyToken = require("../middlewares/validate-token")
const ratingController = require("../controllers/ratingController")
const ratingRouter = express.Router();

ratingRouter.get('/ratings/:nickname', ratingController.getRatings)
ratingRouter.post('/newRating', verifyToken, ratingController.newRating)

module.exports = ratingRouter;