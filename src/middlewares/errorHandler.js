const errorHandler = (err, req, res, next) => {
    if (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = errorHandler