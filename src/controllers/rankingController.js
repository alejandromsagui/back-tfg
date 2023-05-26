const rankingModel = require("../models/rankingModel")
const transactionModel = require("../models/transactionModel")

const getRanking = async (req, res) => {
    try {
        const ranking = await transactionModel.aggregate([
            {
                $group: {
                    nicknameBuyer: "$nicknameBuyer",
                    nicknameSeller: "$nicknameSeller",
                    transactions: { $sum: 1 }
                }
            },
            {
                $sort: { transactions: -1 }
            }
        ]);

        return res.status(200).send({ ranking });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Ha ocurrido un error" });
    }
}






module.exports = { getRanking };