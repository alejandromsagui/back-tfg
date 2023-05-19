const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const verifyToken = (req, res, next) => {
    try {
    const authHeader = req.header('Authorization');
    const token = authHeader.split(' ')[1].trim().replace(/^"(.*)"$/, '$1');
    console.log('header 1', authHeader);
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Auth header desde el backend: '+authHeader);
        req.user = verified;
        next();
        return req.user;
    } catch (error) {
        res.status(401).json({ error: 'Acceso denegado' });
    }
}

module.exports = verifyToken;
