// Importar las bibliotecas necesarias
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const request = require('request');

// Configuración de las credenciales
const credentials = {
    client_id: '507575989771-jkila0fth1bur2ep8civ1if5t2tegi4o.apps.googleusercontent.com',
    client_secret: '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',
    redirect_uri: 'https://namekiansgames.herokuapp.com/'
};

const oauth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uri,
);

https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/storage&response_type=code&access_type=offline&redirect_uri=https://namekiansgames.herokuapp.com&client_id=507575989771-jkila0fth1bur2ep8civ1if5t2tegi4o.apps.googleusercontent.com

// URL de autorización de Google
const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/devstorage.read_write',
});

// Instrucciones para que el usuario visite la URL de autorización
console.log(`Visita la siguiente URL para autorizar la aplicación:\n${authorizeUrl}`);

// Introducción del código de autorización obtenido del usuario
const authorizationCode = 'https://www.googleapis.com/oauth2/v1/certs';

// Intercambiar el código de autorización por un token de acceso
oauth2Client.getToken(authorizationCode, (err, token) => {
    if (err) {
        console.error('Error al obtener el token de acceso', err);
        return;
    }
    // const url = `https://www.googleapis.com/storage/v1/b/${bucketName}/o/${imageName}`;

    // const url = "https://storage.googleapis.com/storage/v1/b/namekiansgames/o/Videojuegos"

    // request({ url, headers }, (error, response, body) => {
    //     if (error) {
    //         console.error('Error al realizar la petición GET', error);
    //         return;
    //     }

    //     console.log('Respuesta:', body);
    // });
});