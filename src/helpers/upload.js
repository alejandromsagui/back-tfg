const { format } = require('util');
const { Storage } = require('@google-cloud/storage')
require('dotenv').config({ path: '.env' });

// Crea una instancia del cliente de Google Cloud Storage
const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.split(String.raw`\n`).join('\n'),
    }
})

// Obtiene una referencia al bucket
const bucket = storage.bucket('namekiansgames')

const uploadImage = async (file) => {
    try {
        const { originalname, buffer } = file
        const blob = bucket.file(originalname.replace(/ /g, "_"))
        const blobStream = blob.createWriteStream({ resumable: false })
        const publicUrl = await new Promise((resolve, reject) => {
            blobStream
                .on('finish', () => {
                    const publicUrl = format(
                        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                    )
                    resolve(publicUrl)
                })
                .on('error', (error) => {
                    reject(new Error(`Error al subir la imagen: ${error.message}`))
                })
                .end(buffer)
        })
        return publicUrl
    } catch (error) {
        console.error(error.message)
        throw error
    }
}

module.exports = uploadImage