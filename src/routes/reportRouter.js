const express = require('express');
const verifyToken = require("../middlewares/validate-token")
const reportRouter = express.Router();
const reportController = require("../controllers/reportController")
const isAdmin = require('../middlewares/isAdmin');

reportRouter.get('/reports', verifyToken, isAdmin, reportController.getReports)
reportRouter.get('/videogamesReported', verifyToken, reportController.getVideogamesReported)
reportRouter.post('/newRecommendation', verifyToken, reportController.newRecommendation)
reportRouter.put('/block/:nickname', verifyToken, isAdmin, reportController.blockUser)
reportRouter.put('/reportGame/:id', verifyToken, reportController.reportGame)
reportRouter.put('/unblock/:nickname', verifyToken, isAdmin, reportController.unblockUser)
reportRouter.put('/changeReaded/:id', verifyToken, reportController.changeReaded)
reportRouter.put('/editDetailsNotification/:id', verifyToken, reportController.editDetailsNotification)
reportRouter.delete('/deleteNotification/:id', verifyToken, reportController.deleteNotification)
reportRouter.get('/exportReports', reportController.exportReports)

module.exports = reportRouter;