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
      status: "En venta",
    };

    const genres = await genresModel.find();

    const genresNames = genres.map((v) => v.genre.toLowerCase());

    const userGenres = videogame.genre.toLowerCase().split(',')
    const allGenresMatch = userGenres.every((userGenre) => genresNames.includes(userGenre));

    if(!videogame.name){
      return res.status(400).send({ message: 'El título es obligatorio'})
    }

    if(!videogame.description){
      return res.status(400).send({ message: 'La descripción es obligatoria'})
    }

    if(!videogame.platform){
      return res.status(400).send({ message: 'La plataforma es obligatoria'})
    }

    if(!videogame.image){
      return res.status(400).send({ message: 'La imagen es obligatoria'})
    }
    if(!allGenresMatch || !videogame.genre){
      return res.status(400).send({ message: 'El género no coincide'})
    }

    if (videogame.price <= 0) {
      return res.status(400).send({ message: "El precio debe ser mayor a 0" });
    }

    await Videogame.validate(videogame);

    const videogameDB = await Videogame.create(videogame);

    return res.status(200).json({
      message: "El videojuego se ha creado correctamente",
      videogame: videogameDB
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

    const existVideogame = await Videogame.findById(id);

    if (!existVideogame) {
      return res.status(404).send({
        message: "El videojuego no existe en tu lista",
      });
    }

    const url = await uploadVideogameImage(req);

    const videogame = {
      name: req.body.name || existVideogame.name,
      description: req.body.description || existVideogame.description,
      image: url || existVideogame.image,
      genre: req.body.genre || existVideogame.genre,
      price: req.body.price || existVideogame.price,
      platform: req.body.platform || existVideogame.platform,
      userId: req.user.id,
      nickname: req.user.nickname,
    }

    const genres = await genresModel.find();

    const genresNames = genres.map((v) => v.genre.toLowerCase());

    const userGenres = req.body.genre.toLowerCase().split(',')
    const allGenresMatch = userGenres.every((userGenre) => genresNames.includes(userGenre));

    if(!req.body.name){
      return res.status(400).send({ message: 'El título es obligatorio'})
    }

    if(!req.body.description){
      return res.status(400).send({ message: 'La descripción es obligatoria'})
    }

    if(!req.body.platform){
      return res.status(400).send({ message: 'La plataforma es obligatoria'})
    }

    if(!allGenresMatch || !req.body.genre){
      return res.status(400).send({ message: 'El género no coincide'})
    }

    if (req.body.price <= 0) {
      return res.status(400).send({ message: "El precio debe ser mayor que 0" });
    }

    await Videogame.validate(videogame);

    await Videogame.findByIdAndUpdate(id, videogame, {new: true})

    return res.status(200).json({
      message: 'Videojuego actualizado correctamente'
    });

  } catch (error) {
      console.log(error);
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (error) => error.message
        );
        return res.status(400).json({ message: validationErrors[0] });
      }
  }
};


const deleteVideogame = async (req, res) => {
  try {
    const id = req.params.id;
    
    const videogame = await Videogame.findById(id);

    if (!videogame) {
      return res.status(404).send({
        message: "El videojuego no existe",
      });
    }

    if (req.user.id.toString().toLowerCase() !== videogame.userId.toString().toLowerCase()) {
      return res.status(400).send({ message: 'Acción denegada' });
    }

    await Videogame.findByIdAndDelete(videogame.id);

    return res.status(200).send({
      message: "El videojuego ha sido eliminado correctamente",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error en el servidor"
    });
  }
}

const getVideogamesByUser = async (req, res) => {
  try {
    // Obtener el nickname del usuario desde req.user.nickname
    const nickname = req.user.nickname;
    
    // Lógica para buscar los videojuegos del usuario en la base de datos
    const videojuegos = await Videogame.find({ nickname: nickname });
    
    // Devolver los videojuegos como respuesta
    res.json(videojuegos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los videojuegos del usuario' });
  }
};


const updateState = async (req, res) => {
  try {
    const videogameId = req.params.id;
    const state = req.body.status;

    const existVideogame = await Videogame.findById(videogameId);

    if (!existVideogame) {
      return res.status(400).send({ message: "El videojuego no se encuentra en tu lista" });
    }

    if (state !== 'Vendido' && state !== 'Reservado' && state !== 'En venta') {
      return res.status(400).send({ message: "Estado de venta no autorizado" });
    }

    if (state === existVideogame.status) {
      return res.status(400).send({ message: "Estado de venta no autorizado" });
    }

    await Videogame.findByIdAndUpdate(videogameId, { status: state });

    return res.status(200).send({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error al actualizar el estado de venta" });
  }
};



const deleteVideogameByName = async() => {

}

module.exports = {
  getVideogames,
  newVideogame,
  updateVideogame,
  deleteVideogame,
  uploadVideogameImage,
  getVideogamesByUser,
  updateState,
  deleteVideogameByName
};
