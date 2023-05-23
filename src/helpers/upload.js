const storage = require("../services/cloud")
const bucket = storage.bucket('namekiansgames')
const { format } = require('util');
const { v4: uuidv4 } = require('uuid');

const uploadImage = async (file) => {
    if (!file) {
        throw new Error('La imagen es obligatoria');
    }

const bucket = storage.bucket('namekiansgames')

    try {
        const { originalname, buffer } = file;
        const fileName = uuidv4();
        const blob = bucket.file('Videojuegos/' + fileName);
        const blobStream = blob.createWriteStream({ resumable: false });
        const publicUrl = await new Promise((resolve, reject) => {
            blobStream
                .on('finish', () => {
                    const publicUrl = format(
                        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                    );
                    resolve(publicUrl);
                })
                .on('error', (error) => {
                    reject(new Error(`Error al subir la imagen: ${error.message}`));
                })
                .end(buffer);
        });
        return publicUrl;
    } catch (error) {
        throw error;
    }
};

const uploadAvatar = async (file) => {
    try {
        const { originalname, buffer } = file;
        const fileName = uuidv4();
        const blob = bucket.file('Avatares/' + fileName);
        const blobStream = blob.createWriteStream({ resumable: false });
        const publicUrl = await new Promise((resolve, reject) => {
            blobStream
                .on('finish', () => {
                    const publicUrl = format(
                        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                    );
                    resolve(publicUrl);
                })
                .on('error', (error) => {
                    reject(new Error(`Error al subir la imagen: ${error.message}`));
                })
                .end(buffer);
        });
        return publicUrl;
    } catch (error) {
        throw error;
    }
};

module.exports = { uploadImage, uploadAvatar }