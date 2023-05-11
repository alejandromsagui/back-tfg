const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Acceso denegado' });

    const token = authHeader.split(' ')[1];
    console.log(token);

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified;
        next();
        return req.user;
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'El token no es válido' });
    }
}

module.exports = verifyToken;
