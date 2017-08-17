var jwt = require('jsonwebtoken');

var constants = require('../constants/constants');
var config = require('../config/env/development');
var payload = require('../response/payload');

var token = (req, res, next) => {
    var token = req.body.token || req.headers['access_token'];

    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decode) => {
            if (err) {
                payload.unauthorized(err, constants.unauthorized, constants.invalid_token, req, res);
            } else {
                next()
            }
        })
    } else {
        payload.unauthorized(null, constants.unauthorized, constants.invalid_token, req, res);
    }
};

var generateAccessTokenFrom = (id, username, email) => {
    const jwtPayload = {
        id: id,
        username: username,
        email: email
    };
    const jwtData = {
        expiresIn: config.jwtDuration,
    };
    const secret = config.jwtSecret;
    var access_token = jwt.sign(jwtPayload, secret, jwtData);
    return access_token;
};

module.exports = {
    token: token,
    generateAccessTokenFrom: generateAccessTokenFrom
};