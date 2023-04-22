const isAuthenticated = (req, res, next) => {
    const token = req.header('token')
    if (token && token !== "") {
        res.send('No puedes acceder a esta ruta estando autenticado')
    } else {
        next();
    }
}

module.exports = isAuthenticated;