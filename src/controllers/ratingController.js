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

//El usuario registrado puede escribir una nueva valoración
const newRating = async (req, res) => {
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

        const ratingModelInstance = new ratingModel(rating);

        await ratingModelInstance.validate();
        
        if((rating.rating < 1 || rating.rating > 5)){
            return res.status(400).send({ message: 'La puntuación debe estar entre el 1 y el 5'})
        }

        if(rating.nickname === rating.nicknameUserProfile){
            return res.status(400).send({
                message: 'No puedes valorarte a ti mismo'
            })
        }

        const user = await userModel.findOne({ id: rating.idUserProfile})
        
        if(user.nickname !== rating.nicknameUserProfile){
            return res.status(400).send({ message: 'Algo ha ido mal'})
        }

        // const ratingDB = await ratingModel.create(rating);

        return res.status(200).json({
            message: 'La valoración se ha creado correctamente'
        })

    } catch (err) {
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({message: validationErrors });
        }

        return res.status(500).json({
            message: 'Error al crear la valoración'
        })
    }
}

module.exports = { getRatings, newRating }