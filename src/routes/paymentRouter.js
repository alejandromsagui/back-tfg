const express = require('express');
const verifyToken = require("../middlewares/validate-token")
const paymentRouter = express.Router();
const paymentController = require('../controllers/paymentController');

paymentRouter.post('/create-order', verifyToken, paymentController.createOrder);
paymentRouter.get('/capture-order', paymentController.captureOrder);
paymentRouter.get('/cancel-order', paymentController.cancelOrder);
paymentRouter.get('/getRecharges', paymentController.getRecharges)

module.exports = paymentRouter;