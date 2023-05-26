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

const getRankingByNickname = async (req, res) => {
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
      
        const userNickname = req.params.nickname;
      
        const userRanking = sortedRanking.find(
          (user) => user.nickname === userNickname
        );
      
        if (userRanking) {
          const userPosition = sortedRanking.findIndex(
            (user) => user.nickname === userNickname
          );
      
          const userRankingWithPosition = {
            ...userRanking,
            position: userPosition + 1,
          };
      
          res.json({ ranking: userRankingWithPosition });
        } else {
          res.status(200).send("Usuario no encontrado en el ranking");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener el ranking de transacciones");
      }
      
  };
  
  

module.exports = { getRanking, getRankingByNickname };
