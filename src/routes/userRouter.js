const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController')

userRouter.get('/users', userController.getUsers);
userRouter.get('/getNickname/:nickname', userController.getNickname)
userRouter.get('/getEmail/:email', userController.getEmail);
userRouter.put('/updateUser/:id', userController.updateUser);
userRouter.put('/updatePassword/:nickname', userController.updatePassword);
userRouter.put('/updateNickname/:nickname', userController.updateNickname)
userRouter.put('/updateEmail/:email', userController.updateEmail)
userRouter.delete('/deleteUser/:id', userController.deleteUser);

module.exports = userRouter;