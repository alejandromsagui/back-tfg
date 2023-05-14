const express = require('express');
const paymentRouter = express.Router();
const paymentController = require('../controllers/paymentController');

paymentRouter.post('/create-order', paymentController.createOrder);
paymentRouter.get('/capture-order', paymentController.captureOrder);
paymentRouter.get('/cancel-order', paymentController.cancelOrder);


module.exports = paymentRouter;