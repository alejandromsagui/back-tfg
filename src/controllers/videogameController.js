const Videogame = require('../models/videogameModel');
const multer = require('multer');
const uploadImage = multer({dest: 'services/images/videogames'})

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

const uploadVideogameImage = (req, res) => {
    // Utilizar el middleware 'upload' y el nombre del campo correspondiente ('image' en este ejemplo)
    uploadImage.single('image')(req, res, err => {
        if (err) {
            return res.status(400).send({ message: 'Error al subir la imagen', error: err });
        } else if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
            return res.status(400).send({ message: 'Formato de imagen inválido. Solo se permiten imágenes JPEG y PNG.' });
        } else {
            // La imagen se ha subido correctamente, en 'req.file' encontrarás toda la información que necesitas
            // para guardar la URL de la imagen en la base de datos o realizar cualquier otra acción.
            const originalName = req.file.originalname;
            const storagePath = req.file.path;
            const url = req.file.location; // En este caso se está utilizando AWS S3 como storage

            // Aquí puedes realizar todas las operaciones que necesites con los datos de la imagen
            // Por ejemplo, guardar la URL en la base de datos del videojuego correspondiente

            return res.status(200).send({ message: 'Imagen subida correctamente', image: { originalName, storagePath, url } });
        }
    });
}

module.exports = { getVideogames, newVideogame, updateVideogame, deleteVideogame, uploadVideogameImage }