const crypto = require("crypto");

const generateCode = () => {

    const code = crypto.randomBytes(16).toString("hex").substring(0, 6).toUpperCase();
    return code;
}

const generateFilename = (originalName) => {
    const ext = path.extname(originalName);
    const name = crypto.randomBytes(16).toString('hex');
    return `${name}${ext}`;
};

module.exports = { generateCode, generateFilename };