const multer = require("multer");
const sharp = require("sharp")
const path = require('path');

const multerMid = multer({
    storage: multer.memoryStorage(),

    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
        const allowedExts = ['.jpeg', '.jpg', '.png'];

        const fileExt = path.extname(file.originalname).toLowerCase();
        const fileMime = file.mimetype.toLowerCase();

        if (allowedMimes.includes(fileMime) && allowedExts.includes(fileExt)) {
            cb(null, true);
        } else {
            cb(new Error('El archivo debe ser JPEG, JPG o PNG'));
        }
    },
});

const reduceImageSize = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        sharp(req.file.buffer)
            .resize({ height: 250, width: 500, fit: sharp.fit.contain })
            .toBuffer()
            .then((data) => {
                req.file.buffer = data;
                next();
            })
            .catch((err) => {
                console.error("Error procesando la imagen");
                next(err);
            });
    } catch (err) {
        console.error("Error procesando la imagen");
        next(err);
    }
};

module.exports = { multerMid, reduceImageSize };