const express = require('express');
const verifyToken = require("../middlewares/validate-token")
const rankingController = require("../controllers/rankingController")
const rankingRouter = express.Router();

rankingRouter.get('/ranking', rankingController.getRanking)
rankingRouter.get('/findRanking/:nickname', rankingController.getRankingByNickname)

module.exports = rankingRouter