const transactionModel = require("../models/transactionModel")
const mongoose = require("mongoose");
const axios = require("axios")

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

//SIn acabar
const newTransaction = async (req, res) => {
    try {

        const transaction = {
            idBuyer: req.user.id, 
            nicknameBuyer: req.user.nickname, 
            description: req.body.description,
            price: req.body.price,
            date: new Date().toLocaleString("es-ES"),
            idSeller: req.body.idSeller,
            nicknameSeller: req.body.nicknameSeller, 
            idVideogame: req.body.idVideogame,
            videogame: req.body.videogame
        }

        const transactionDB = transactionModel.create(transaction)
        
        const userBuyer = await axios.get(`${process.env.HOST}/getUser/${transaction.nicknameBuyer}`)
        const userSeller = await axios.get(`${process.env.HOST}/getUser/${transaction.nicknameSeller}`)
        let namekoinsBuyer = userBuyer.data.user.number_namekoins;
        let namekoinsSeller = userSeller.data.user.number_namekoins;

        namekoinsBuyer = namekoinsBuyer - transaction.price
        await axios.put(`${process.env.HOST}/updateNamekoins/${transaction.idBuyer}`, {number_namekoins: namekoinsBuyer})

        namekoinsSeller = namekoinsSeller + transaction.price
        await axios.put(`${process.env.HOST}/updateNamekoins/${transaction.idSeller}`, {number_namekoins: namekoinsSeller})
        
        return res.status(200).json({
            message: 'La transacción se ha realizado correctamente',
            transactionDB,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al realizar la transacción' });
    }
}

module.exports = { transactions, newTransaction }