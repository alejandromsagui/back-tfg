const transactionModel = require("../models/transactionModel")
const videogameModel = require("../models/videogameModel")
const userModel = require("../models/usuarioModel")
const mongoose = require("mongoose");
const axios = require("axios")
var ObjectId = require("mongoose").Types.ObjectId;

const transactions = async (req, res) => {
    try {
        const transaction = await transactionModel.find();
        res.status(200).json({
            status: 'ok',
            transaction
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Error al visualizar las transacciones',
            err
        });
    }
}

const newTransaction = async (req, res) => {
    try {
      const transaction = {
        idBuyer: req.user.id,
        nicknameBuyer: req.user.nickname,
        description: `Transacción realizada entre el usuario comprador ${req.user.nickname} y el usuario vendedor ${req.body.nicknameSeller}`,
        price: req.body.price,
        date: new Date().toLocaleString("es-ES"),
        idSeller: req.body.idSeller,
        nicknameSeller: req.body.nicknameSeller,
        idVideogame: req.body.idVideogame,
        videogame: req.body.videogame,
        platform: req.body.platform
      };
  
      const videogame = await videogameModel.findOne({ _id: transaction.idVideogame });
      const user = await userModel.findOne({ _id: transaction.idSeller });
      const userBuyer = await userModel.findOne({ _id: transaction.idBuyer });
  
      console.log('videogameid ', videogame.id);
      if (videogame.id !== transaction.idVideogame) {
        return res.status(400).send({ message: "El ID del videojuego no coincide" });
      }
      
      if (parseInt(videogame.price) !== parseInt(transaction.price)) {
        return res.status(400).send({ message: "El precio del videojuego no coincide" });
      }
      
      if (videogame.name !== transaction.videogame) {
        return res.status(400).send({ message: "El nombre del videojuego no coincide" });
      }
      
      if (transaction.description !== `Transacción realizada entre el usuario comprador ${req.user.nickname} y el usuario vendedor ${req.body.nicknameSeller}`) {
        return res.status(400).send({ message: "La descripción del videojuego no coincide" });
      }
      
      if (videogame.platform !== transaction.platform) {
        return res.status(400).send({ message: "La plataforma del videojuego no coincide" });
      }
      
      if (transaction.idSeller !== user.id) {
        return res.status(400).send({ message: "El ID del vendedor no coincide" });
      }
      
      if (videogame.nickname !== transaction.nicknameSeller) {
        return res.status(400).send({ message: "El nombre de usuario del vendedor no coincide" });
      }
  
      if (transaction.nicknameBuyer === user.nickname || transaction.idBuyer === user.id) {
        return res.status(400).send({ message: "No puedes comprar tus propios juegos" });
      }
  
      if (userBuyer.number_namekoins < transaction.price) {
        return res.status(400).send({ message: "Saldo insuficiente" });
      }

      if(videogame.status === 'Vendido'){
        return res.status(400).send({ message: "No puedes comprar un juego que ya se ha vendido"})
      }
  
      userBuyer.number_namekoins = userBuyer.number_namekoins -  transaction.price;
      user.number_namekoins = user.number_namekoins + transaction.price;
      videogame.status = 'Vendido'

      await userBuyer.save();
      await user.save();
      await videogame.save()

      await transactionModel.create(transaction)

      return res.status(200).send({ message: 'La transacción se ha realizado correctamente' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Error al realizar la transacción' });
    }
  };
  

  const getTransactionById = async (req, res) => {
    const nickname = req.params.nickname;
  
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // El método getMonth devuelve valores de 0 a 11, por eso se suma 1 para obtener el número del mes actual
      const currentYear = currentDate.getFullYear();
      const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1); // Primer día del mes actual
      const firstDayOfNextMonth = new Date(currentYear, currentMonth, 1); // Primer día del mes siguiente
  
      const transactions = await transactionModel.find({
        $or: [
          { nicknameBuyer: nickname },
          { nicknameSeller: nickname }
        ],
        createdAt: {
          $gte: firstDayOfMonth,
          $lt: firstDayOfNextMonth
        }
      });
  
      res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener las transacciones");
    }
  };
  
  
  

module.exports = { transactions, newTransaction, getTransactionById }