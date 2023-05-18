const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController')
const verifyToken = require ('../middlewares/validate-token');
const checkTokenExpiration = require('../middlewares/expirationToken');

userRouter.get('/users', verifyToken, checkTokenExpiration, userController.getUsers);
userRouter.get('/getNickname/:nickname', userController.getNickname)
userRouter.get('/getEmail/:email', userController.getEmail);
userRouter.get('/getPermission/:nickname', userController.getPermission),
userRouter.put('/uploadAvatarImage', userController.uploadAvatarImage)
userRouter.put('/updateUser/:id', userController.updateUser);
userRouter.put('/updateNamekoins/:id', userController.updateNamekoins);
userRouter.get('/getUser/:nickname', userController.getUser)
userRouter.put('/updatePassword/:nickname', verifyToken, userController.updatePassword);
userRouter.put('/updateNickname/:nickname', verifyToken, userController.updateNickname)
userRouter.put('/updateEmail/:email', verifyToken, checkTokenExpiration, userController.updateEmail)
userRouter.delete('/deleteUser/:id', userController.deleteUser);

module.exports = userRouter;