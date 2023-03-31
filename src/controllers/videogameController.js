const Videogame = require('../models/videogameModel');

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
            description: req.body.descripcion,
            genre: req.body.genre
        })
        const videogameDB = await Videogame.create(videogame);

        return res.status(200).json({
            message: 'El videojuego se ha creadp correctamente',
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

module.exports = { getVideogames, newVideogame }