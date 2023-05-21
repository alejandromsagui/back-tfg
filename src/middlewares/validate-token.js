const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const verifyToken = (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader.split(' ')[1].trim().replace(/^"(.*)"$/, '$1');
      const verified = jwt.verify(token, process.env.JWT_SECRET)
      req.user = verified;
      next();
      return req.user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'La sesión ha expirado. Por favor, inicia sesión de nuevo' });
      } else {
        res.status(401).json({ error: 'Acceso denegado' });
      }
    }
  }

module.exports = verifyToken;
