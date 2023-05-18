const express = require('express');
const verifyToken = require("../middlewares/validate-token")
const checkTokenExpiration = require("../middlewares/expirationToken")
const paymentRouter = express.Router();
const paymentController = require('../controllers/paymentController');

paymentRouter.post('/create-order', verifyToken, checkTokenExpiration, paymentController.createOrder);
paymentRouter.get('/capture-order', paymentController.captureOrder);
paymentRouter.get('/cancel-order', paymentController.cancelOrder);
paymentRouter.get('/recharges', verifyToken, checkTokenExpiration, paymentController.getRecharges)

module.exports = paymentRouter;