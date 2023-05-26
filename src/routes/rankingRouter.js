const express = require('express');
const verifyToken = require("../middlewares/validate-token")
const rankingController = require("../controllers/rankingController")
const rankingRouter = express.Router();

rankingRouter.get('/ranking', verifyToken, rankingController.getRanking)

module.exports = rankingRouter