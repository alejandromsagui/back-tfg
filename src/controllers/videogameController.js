const Videogame = require('../models/videogameModel');
const uploadImage = require('../helpers/upload')
const { decodeToken } = require('./authController')

const getVideogames = async (req, res) => {
    try {
        const videogames = await Videogame.find();

        res.status(200).json({
            status: 'ok',
            videogames
        })
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: 'Error al visualizar los videojuegos',
            err
        });
    }
}
const uploadVideogameImage = async (req, res, next) => {
    try {
        const myFile = req.file
        const imageUrl = await uploadImage(myFile)
        const urlCover = imageUrl
        console.log('Valor de urlCover: ' + urlCover);
        return urlCover
    } catch (error) {
        next(error)
    }
}

const newVideogame = async (req, res) => {
    try {
        const url = await uploadVideogameImage(req, res)

        const data =  decodeToken(req);
        console.log('Token desde nuevo videojuego: '+data);

        if (!data) {
            return res.status(401).json({
                message: 'El token de autorización es inválido o está en un formato incorrecto'
            });
        }
        
        console.log('Valor de data: ' + data);
        console.log('Valor url: ' + url);
        console.log('Valor de decodeToken id: '+data._id);
        console.log('Valor de decodeToken nickname: '+data.nickname);
        const videogame = ({
            name: req.body.name,
            description: req.body.description,
            genre: req.body.genre,
            image: url,
            price: req.body.price,
            userId: data._id,
            nickname: data.nickname
        })
        const videogameDB = await Videogame.create(videogame);

        console.log(videogame);
        return res.status(200).json({
            message: 'El videojuego se ha creado correctamente',
            videogameDB
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 'fail',
            message: 'Error al subir un videojuego',
            err
        });
    }
}

const updateVideogame = async (req, res) => {
    try {
        const id = req.params.id;
        const update = { name: req.body.name, description: req.body.description, genre: req.body.genre, price: req.body.price }
        const videogame = await Videogame.findById(id);

        if (!videogame) {
            return res.status(404).send({
                message: 'El videojuego no existe'
            })
        }

        const updateVideogame = await Videogame.findByIdAndUpdate(id, update, { new: true });

        return res.status(200).json({
            message: 'El usuario se ha actualizado correctamente',
            updateVideogame
        })

    } catch (err) {
        return res.status(500).json({
            message: 'Error al actualizar los datos del videojuego',
            err
        })
    }
}

const deleteVideogame = async (req, res) => {
    try {
        const id = req.params.id;
        const videogame = await Videogame.findByIdAndDelete(id);

        if (!videogame) {
            return res.status(404).send({
                message: 'El videojuego no existe'
            })
        }

        return res.status(200).send({
            message: 'El videojuego ha sido eliminado correctamente'
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Error en el servidor',
            err
        });
    }
}



module.exports = { getVideogames, newVideogame, updateVideogame, deleteVideogame, uploadVideogameImage }