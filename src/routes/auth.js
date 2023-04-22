const express = require('express');
const authRouter = express.Router();
const authController = require ('../controllers/authController')
const isAuthenticated = require ('../middlewares/is-authenticated')

authRouter.post('/register', isAuthenticated, authController.newUser)
authRouter.post('/login', isAuthenticated, authController.login)

module.exports = authRouter;