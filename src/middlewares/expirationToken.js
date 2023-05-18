const checkTokenExpiration = (req, res, next) => {
    const token = req.header('Authorization');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buffer = Buffer.from(base64, 'base64');
    const decode = JSON.parse(buffer.toString());
    const expirationTimeInSeconds = decode.exp;
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    if (expirationTimeInSeconds < currentTimeInSeconds) {
        res.status(401).json({ error: 'Token expirado' });
    } else {
        next(); 
    }
};

module.exports = checkTokenExpiration;