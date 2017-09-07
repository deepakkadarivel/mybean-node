const jwt = require('jsonwebtoken');

const constants = require('../constants/constants');
const config = require('../../config/env/development');
const payload = require('../response/payload');

const token = (req, res, next) => {
    const token = req.body.token || req.headers['access_token'];

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

const generateAccessTokenFrom = (email) => {
    const jwtPayload = {
        email,
    };
    const jwtData = {
        expiresIn: config.jwtDuration,
    };
    const secret = config.jwtSecret;
    return jwt.sign(jwtPayload, secret, jwtData);

};

module.exports = {
    token: token,
    generateAccessTokenFrom: generateAccessTokenFrom
};