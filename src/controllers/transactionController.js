const transactionModel = require("../models/transactionModel")

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
const newTransaction = async() => {
        try {

                const transaction = {
                    transaction: req.body.transaction,
                    description: req.body.description,
                    date: new Date().toLocaleString("es-ES"),
                    userId: req.user.id,
                    nickname: req.user.nickname,
                };
    
                const videogameDB = await Videogame.create(videogame);
    
                return res.status(200).json({
                    message: 'El videojuego se ha creado correctamente',
                    videogameDB,
                });
                
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al decodificar el token' });
        }
}

module.exports = { transactions, newTransaction}