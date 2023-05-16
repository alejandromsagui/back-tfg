const transactionModel = require("../models/transactionModel")
const mongoose = require("mongoose");


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

        const transaction = [{
            transaction: 'Compra',
            description: req.body.description,
            price: req.body.price,
            date: new Date().toLocaleString("es-ES"),
            idBuyer: req.user.id,
            nicknameBuyer: req.user.nickname,
            idSeller: req.body.idSeller,
            nicknameSeller: req.body.nicknameSeller,
            idVideogame: req.body.idVideogame,
            videogame: req.body.videogame
        },
        {
            transaction: 'Venta',
            description: req.body.description,
            price: req.body.price,
            date: new Date().toLocaleString("es-ES"),
            idBuyer: req.user.id,
            nicknameBuyer: req.user.nickname,
            idSeller: req.body.idSeller,
            nicknameSeller: req.body.nicknameSeller,
            idVideogame: req.body.idVideogame,
            videogame: req.body.videogame
        }
        ]

        transactionModel.insertMany(transaction)
            .then(value => {
                console.log('Transacción guardada');
            })
            .catch(error => {
                console.log(error);
            })
        return res.status(200).json({
            message: 'La transacción se ha realizado correctamente',
            transaction,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al realizar la transacción' });
    }
}

module.exports = { transactions, newTransaction }