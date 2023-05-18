const ratingModel = require('../models/ratingModel')

const getRatings = async(req, res) => {
    try {
        const ratings = await ratingModel.find();
        res.status(200).json({
            status: 'ok',
            ratings
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Error al visualizar las valoraciones',
            err
        });
    }
}

const newRating = async(req, res) => {
    try {

        const rating = ({
            rating: req.body.rating,
            comment: req.body.comment,
            date: new Date().toLocaleString("es-ES"),
            userId: req.user.id,
            nickname: req.user.nickname,
            idUserProfile: req.body.idUserProfile,
            nicknameUserProfile: req.body.nicknameUserProfile
        });

        const ratingDB = await ratingModel.create(rating);

        return res.status(200).json({
            message: 'La valoración se ha creado correctamente',
            ratingDB
        })

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: 'Error al crear la valoración'
        })
    }
}

module.exports = { getRatings, newRating}