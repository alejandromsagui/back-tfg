const express = require('express');
const transactionRouter = express.Router();
const transactionController = require("../controllers/transactionController")
const verifyToken = require("../middlewares/validate-token");
const checkTokenExpiration = require('../middlewares/expirationToken');

transactionRouter.get('/transactions', verifyToken, transactionController.transactions);
transactionRouter.get('/findTransaction/:nickname', transactionController.getTransactionById);
transactionRouter.post('/newTransaction', verifyToken, transactionController.newTransaction);

module.exports = transactionRouter;