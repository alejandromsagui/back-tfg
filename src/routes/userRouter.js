const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController')
const verifyToken = require ('../middlewares/validate-token');
const isAdmin = require('../middlewares/isAdmin');

userRouter.get('/users', verifyToken, userController.getUsers);
userRouter.get('/export', verifyToken, userController.exportData);
userRouter.get('/countRegister', userController.countRegister)
userRouter.get('/getNickname/:nickname', userController.getNickname)
userRouter.get('/getNamekoins/:nickname', verifyToken, userController.getNamekoins)
userRouter.get('/getEmail/:email', verifyToken, userController.getEmail);
userRouter.get('/getUsersDetails', verifyToken, userController.getUsersAdmin)
userRouter.get('/getPermission/:nickname', verifyToken, userController.getPermission),
userRouter.put('/uploadAvatarImage', userController.uploadAvatarImage)
userRouter.put('/updateUser/:id', userController.updateUser);
userRouter.put('/updateNamekoins/:id', verifyToken, userController.updateNamekoins);
userRouter.get('/getUser/:id', userController.getUser)
userRouter.put('/updatePassword', verifyToken, userController.updatePassword);
userRouter.put('/updateNickname', verifyToken, userController.updateNickname)
userRouter.put('/updateEmail', verifyToken, userController.updateEmail)
userRouter.delete('/deleteUser/:id', verifyToken, userController.deleteUser);
userRouter.delete('/deleteUserByAdmin/:id', verifyToken, userController.deleteUserByAdmin)
// userRouter.get('/chat', userController.chat)/getUsersDetail

module.exports = userRouter;