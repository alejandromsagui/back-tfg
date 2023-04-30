const crypto = require("crypto");

const generateCode = () => {

    const code = crypto.randomBytes(16).toString("hex").substring(0, 6).toUpperCase();
    return code;
}

module.exports = generateCode;