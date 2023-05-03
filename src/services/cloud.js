const { Storage } = require('@google-cloud/storage')
require('dotenv').config({ path: '.env' });

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.split(String.raw`\n`).join('\n'),
    }
})

module.exports = storage;