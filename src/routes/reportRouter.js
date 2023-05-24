const express = require('express');
const verifyToken = require("../middlewares/validate-token")
const reportRouter = express.Router();
const reportController = require("../controllers/reportController")
const isAdmin = require('../middlewares/isAdmin');

reportRouter.get('/reports', verifyToken, isAdmin, reportController.getReports)
reportRouter.post('/newRecommendation', verifyToken, reportController.newRecommendation)
reportRouter.put('/block/:nickname', verifyToken, isAdmin, reportController.blockUser)
reportRouter.put('/reportGame/:id', verifyToken, reportController.reportGame)

module.exports = reportRouter;