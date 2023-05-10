const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    console.log(token);
    if(!token) return res.status(401).json({error: 'Acceso denegado'})

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified;
        next()
        return req.user
    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'El token no es válido'})
    }
}

module.exports = verifyToken
