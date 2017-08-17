const express = require('express');

const account = require('./auth/account/user');
const constants = require('./constants/constants');
const jwt = require('./auth/jwt');
const payload = require('./response/payload');

const router = express.Router();
const secureRouter = express.Router();

const getAppStatus = (req, res) => {
    payload.success(constants.success, constants.app_initialized, req, res);
};

router.get('/', getAppStatus);
router.post('/api/login', account.login);
router.post('/api/register', account.register);

// Validation Middleware
secureRouter.use('', jwt.token);
secureRouter.get('/api/users', account.getAllUsers);

module.exports = {
    router,
    secureRouter
};