const storage = require("../services/cloud")
const bucket = storage.bucket('namekiansgames')
const { format } = require('util');

const uploadImage = async (file) => {
    try {
        const { originalname, buffer } = file
        const blob = bucket.file('Videojuegos/'+originalname.replace(/ /g, "_"))
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