const rankingModel = require("../models/rankingModel");
const transactionModel = require("../models/transactionModel");

const getRanking = async (req, res) => {
  try {
    const sellerRanking = await transactionModel.aggregate([
      {
        $group: {
          _id: "$nicknameSeller",
          transactions: { $sum: 1 },
        },
      },
    ]);

    const buyerRanking = await transactionModel.aggregate([
      {
        $group: {
          _id: "$nicknameBuyer",
          transactions: { $sum: 1 },
        },
      },
    ]);

    const combinedRanking = [...sellerRanking, ...buyerRanking];

    const ranking = combinedRanking.reduce((acc, user) => {
      const existingUser = acc.find((u) => u.nickname === user._id);
      if (existingUser) {
        existingUser.totalTransactions += user.transactions;
      } else {
        acc.push({
          nickname: user._id,
          totalTransactions: user.transactions,
        });
      }
      return acc;
    }, []);

    const sortedRanking = ranking.sort(
      (a, b) => b.totalTransactions - a.totalTransactions
    );

    const rankedUsers = sortedRanking.map((user, index) => ({
      ...user,
      position: index + 1,
    }));

    res.json({ ranking: rankedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener el ranking de transacciones");
  }
};

module.exports = { getRanking };
