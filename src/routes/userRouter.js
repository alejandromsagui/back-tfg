const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController')
const verifyToken = require ('../middlewares/validate-token')

userRouter.get('/users', verifyToken, userController.getUsers);
userRouter.get('/getNickname/:nickname', userController.getNickname)
userRouter.get('/getEmail/:email', userController.getEmail);
userRouter.get('/getPermission/:nickname', userController.getPermission)
userRouter.put('/updateUser/:id', userController.updateUser);
userRouter.get('/getUser/:nickname', userController.getUser)
userRouter.put('/updatePassword/:nickname', verifyToken, userController.updatePassword);
userRouter.put('/updateNickname/:nickname', verifyToken, userController.updateNickname)
userRouter.put('/updateEmail/:email', verifyToken, userController.updateEmail)
userRouter.delete('/deleteUser/:id', userController.deleteUser);

module.exports = userRouter;