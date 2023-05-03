const Videogame = require('../models/videogameModel');
const multer = require('multer');

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

const newVideogame = async (req, res) => {
    try {
        const videogame = ({
            name: req.body.name,
            cover: req.body.cover,
            description: req.body.description,
            genre: req.body.genre
        })
        const videogameDB = await Videogame.create(videogame);

        return res.status(200).json({
            message: 'El videojuego se ha creado correctamente',
            videogameDB
        });

    } catch (err) {
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
        const update = {name: req.body.name, cover:req.body.cover, description:req.body.description, genre:req.body.genre}
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


module.exports = { getVideogames, newVideogame, updateVideogame, deleteVideogame }