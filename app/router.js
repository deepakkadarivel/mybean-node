var express = require('express');
var router = express.Router();
var secureRouter = express.Router();
var config = require('./config/env/development');
var jwt = require('jsonwebtoken');

var db = require('./queries');

var getAppStatus = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'App Initialized'
    })
};

var token = (req, res, next) => {
    var token = req.body.token || req.headers['token'];

    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decode) => {
            if (err) {
                res.status(401).json({
                    status: 'Unauthorized',
                    message: 'Unauthorized'
                })
            } else {
                next()
            }
        })
    } else {
        res.status(401).json({
            status: 'Unauthorized',
            message: 'Unauthorized',
            decode: decode
        })
    }
};

router.get('/', getAppStatus);
router.post('/api/register', db.register);
router.post('/api/login', db.login);

// Validation Middleware
secureRouter.use('', token);
secureRouter.get('/api/users', db.getAllUsers);

module.exports = {
    router,
    secureRouter
};