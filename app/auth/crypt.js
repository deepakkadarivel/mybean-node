var bcrypt   = require('bcrypt-nodejs');

var generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

var validPassword = (password, password_hash) => {
    return bcrypt.compareSync(password, password_hash);
};

module.exports = {
    generateHash: generateHash,
    validPassword: validPassword,
};