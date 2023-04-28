const express = require('express');
const authRouter = express.Router();
const authController = require ('../controllers/authController')
const isAuthenticated = require ('../middlewares/is-authenticated')


authRouter.post('/register', isAuthenticated, authController.newUser)
authRouter.post('/login', isAuthenticated, authController.login)
authRouter.post('/recovery', authController.recoveryPassword)
authRouter.get('/decode', authController.decodeToken)
module.exports = authRouter;