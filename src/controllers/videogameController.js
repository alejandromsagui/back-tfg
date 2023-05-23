const Videogame = require("../models/videogameModel");
const { uploadImage } = require("../helpers/upload");
const { decodeToken } = require("./authController");
const userModel = require("../models/usuarioModel");
const genresModel = require("../models/genresModel");
const verifyToken = require("../middlewares/validate-token");

const getVideogames = async (req, res) => {
  try {
    const videogames = await Videogame.find();

    res.status(200).json({
      status: "ok",
      videogames,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Error al visualizar los videojuegos",
      err,
    });
  }
};
const getGenres = async (req, res) => {
  try {
    const genres = await genresModel.find();
    const test = []

    genres.forEach(element => {
      test.push(element.genre)
    })
    return res.status(200).send({
      status: 'ok',
      test
    })
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Error al visualizar los géneros",
      err,
    });
  }
};

const uploadVideogameImage = async (req, res, next) => {
  try {
    const myFile = req.file;
    const imageUrl = await uploadImage(myFile);
    const urlCover = imageUrl;
    console.log("Valor de urlCover: " + urlCover);
    return urlCover;
  } catch (error) {}
};
const newVideogame = async (req, res) => {
  try {
    const url = await uploadVideogameImage(req);
    console.log("Url desde newVideogame: " + url);

    if (!url) {
      console.log("No hay url");
    }
    const videogame = {
      name: req.body.name,
      description: req.body.description,
      image: url,
      genre: req.body.genre,
      platform: req.body.platform,
      price: req.body.price,
      userId: req.user.id,
      nickname: req.user.nickname,
      status: "",
    };

    if (videogame.price <= 0) {
      return res.status(400).send({ message: "El precio debe ser mayor a 0" });
    }

    const genres = [videogame.genre]

    
    const existingGenres = await genresModel.find();
    //No da el valor pero si el id
    const genreValues = existingGenres.map((obj) => obj._id);
    console.log('resultado de genres ', genres);
    console.log('resultado de existingGenres ', genreValues);


//     const array1 = ['Acción', 'Deportes', 'Exploración'];
// const array2 = ['Acción', 'Carrera', 'Deportes'];

// const resultadosCoincidentes = array1.filter((valor) => array2.includes(valor));




    await Videogame.validate(videogame);

    // const videogameDB = await Videogame.create(videogame);
    return res.status(200).json({
      message: "El videojuego se ha creado correctamente",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (error) => error.message
      );
      return res.status(400).json({ message: validationErrors });
    }
    res.status(500).json({ message: "Error al decodificar el token" });
  }
};

const updateVideogame = async (req, res) => {
  try {
    const id = req.params.id;
    const update = {
      name: req.body.name,
      description: req.body.description,
      genre: req.body.genre,
      price: req.body.price,
    };
    const videogame = await Videogame.findById(id);

    if (!videogame) {
      return res.status(404).send({
        message: "El videojuego no existe",
      });
    }

    const updateVideogame = await Videogame.findByIdAndUpdate(id, update, {
      new: true,
    });

    return res.status(200).json({
      message: "El usuario se ha actualizado correctamente",
      updateVideogame,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al actualizar los datos del videojuego",
      err,
    });
  }
};

const deleteVideogame = async (req, res) => {
  try {
    const id = req.params.id;
    const videogame = await Videogame.findByIdAndDelete(id);

    if (!videogame) {
      return res.status(404).send({
        message: "El videojuego no existe",
      });
    }

    return res.status(200).send({
      message: "El videojuego ha sido eliminado correctamente",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error en el servidor",
      err,
    });
  }
};

module.exports = {
  getVideogames,
  newVideogame,
  updateVideogame,
  deleteVideogame,
  uploadVideogameImage,
  getGenres
};
