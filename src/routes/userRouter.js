const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController')

userRouter.get('/users', userController.getUsers);
userRouter.put('/updateUser/:id', userController.updateUser);
userRouter.put('/updatePassword/:nickname', userController.updatePassword);
userRouter.delete('/deleteUser/:id', userController.deleteUser);

module.exports = userRouter;