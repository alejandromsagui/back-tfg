const express = require('express');
const authRouter = express.Router();
const authController = require ('../controllers/authController')
const verifyToken = require ('../middlewares/validate-token')


authRouter.get('/checkJWT', authController.parseJwt)
authRouter.post('/register', authController.newUser)
authRouter.post('/login', authController.login)
authRouter.post('/recovery', authController.recoveryPassword)
authRouter.get('/decode', verifyToken, authController.decodeToken)
authRouter.put('/updateToken', verifyToken, authController.updateToken)

module.exports = authRouter;