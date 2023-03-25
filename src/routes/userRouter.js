const express = require('express');
const userRouter = express.Router();

userRouter.get('/users', (req, res) => {
    res.send("Aqui se podrán visualizar todos los usuarios")
})


module.exports = userRouter;