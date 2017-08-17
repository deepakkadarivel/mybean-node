var express = require('express');
var router = express.Router();
var secureRouter = express.Router();
var jwt = require('./auth/jwt');

var account = require('./auth/account/user');

var getAppStatus = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'App Initialized'
    })
};

router.get('/', getAppStatus);
router.post('/api/register', account.register);
router.post('/api/login', account.login);

// Validation Middleware
secureRouter.use('', jwt.token);
secureRouter.get('/api/users', account.getAllUsers);

module.exports = {
    router,
    secureRouter
};