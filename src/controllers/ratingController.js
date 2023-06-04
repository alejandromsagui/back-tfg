const ratingModel = require('../models/ratingModel')
const userModel = require('../models/usuarioModel')

const getRatings = async (req, res) => {

    const nickname = req.params.nickname
    try {

        const ratings = await ratingModel.find({ nicknameUserProfile: nickname })
        res.json(ratings)
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Error al visualizar las valoraciones',
            err
        });
    }
}

const ratings = async (req, res) => {
    try {
        const ratings = await ratingModel.find();

        if (!ratings) {
            return res.status(400).send({ message: 'Error al visualizar las valoraciones' })
        }

        const dataRating = ratings.map(data => ({
            nickname: data.nickname,
            nicknameUserProfile: data.nicknameUserProfile,
            rating: data.rating,
            comment: data.comment
        }));

        return res.status(200).send({ dataRating })
    } catch (err) {
        res.status(500).json({
            message: 'Error al visualizar las valoraciones',
        });
    }
}

//El usuario registrado puede escribir una nueva valoración
const newRating = async (req, res) => {
    try {
        const rating = {
            rating: req.body.rating,
            comment: req.body.comment,
            date: new Date().toLocaleString("es-ES"),
            userId: req.user.id,
            nickname: req.user.nickname,
            idUserProfile: req.body.idUserProfile,
            nicknameUserProfile: req.body.nicknameUserProfile,
        };

        console.log("lo que se envia de comment: ", rating.comment);

        if (rating.rating < 1 || rating.rating > 5) {
            return res.status(400).send({
                message: "La puntuación debe estar entre el 1 y el 5",
            });
        }

        if (!rating.comment) {
            return res.status(400).send({
                message: "La valoración no puede estar vacía",
            });
        }

        if (
            rating.nickname === rating.nicknameUserProfile ||
            rating.userId === rating.idUserProfile
        ) {
            return res.status(400).send({
                message: "No puedes valorarte a ti mismo",
            });
        }

        console.log('id user profile: ', rating.idUserProfile);
        const user = await userModel.findOne({ _id: rating.idUserProfile });
        console.log('user nickname', user.nickname);
        console.log('rating nickname', rating.nicknameUserProfile);
        if (user.nickname !== rating.nicknameUserProfile) {
            return res.status(400).send({ message: "Algo ha ido mal" });
        }

        await ratingModel.create(rating);

        return res.status(200).send({
            message: "La valoración se ha creado correctamente",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Error al crear la valoración",
        });
    }
};



module.exports = { getRatings, newRating, ratings }