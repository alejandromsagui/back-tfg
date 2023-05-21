const express = require('express');
const verifyToken = require("../middlewares/validate-token")
const reportRouter = express.Router();
const reportController = require("../controllers/reportController")

reportRouter.put('/block/:nickname', reportController.blockUser)

module.exports = reportRouter;