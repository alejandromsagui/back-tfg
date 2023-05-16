const express = require('express');
const transactionRouter = express.Router();
const transactionController = require("../controllers/transactionController")

transactionRouter.get('/transactions', transactionController.transactions);
transactionRouter.post('/newTransaction', transactionController.newTransaction);

module.exports = transactionRouter;