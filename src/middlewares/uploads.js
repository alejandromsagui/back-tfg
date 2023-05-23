const { uploadImage } = require('../helpers/upload')

const uploadVideogameImage = async (req, res, next) => {
    try {
      const myFile = req.file;
      const imageUrl = await uploadImage(myFile);
      const urlCover = imageUrl;
      console.log('Valor de urlCover: ' + urlCover);
      req.urlCover = urlCover; // Establecer urlCover en req para que esté disponible en la siguiente función
      next(); // Llamar a next() para pasar al siguiente middleware o ruta
    } catch (error) {
      next(error); // Pasar el error al siguiente middleware de error
    }
  };

  module.exports = uploadVideogameImage;