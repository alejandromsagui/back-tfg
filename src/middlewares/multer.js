const multer = require("multer");
const sharp = require("sharp")
const path = require('path');
const { generateFilename } = require('../services/generate-code')

const multerMid = multer({
    storage: multer.memoryStorage({
        
        filename: (req, file, cb) => {
            const filename = generateFilename(file.originalname);
            cb(null, filename);
        },
    }),

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
            .resize({ width: 800, height: 450, fit: 'inside' })
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