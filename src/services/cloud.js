const cloud = require('@google-cloud/storage');
const path = require('path');
const serviceKey = path.join(__dirname, '../config.json')

const { Storage } = cloud

const storage = new Storage({
    keyFileName: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
    projectId: 'namekiansgames'
})

module.exports = storage;