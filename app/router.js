const express = require('express');
const multipart = require('connect-multiparty');

const neo = require('./neo/person');
const constants = require('./constants/constants');
const jwt = require('./auth/jwt');
const payload = require('./response/payload');

const Upload = require('./upload/upload.server.controller');
const multipartMiddleware = multipart();

const router = express.Router();
const secureRouter = express.Router();

const getAppStatus = (req, res) => {
    payload.success(constants.success, constants.app_initialized, req, res);
};

router.get('/', getAppStatus);

// neo4j access points
router.post('/api/v1/login', neo.login);
router.post('/api/v1/register', neo.register);
router.get('/uploadform', Upload.displayForm);
router.put('/upload', multipartMiddleware, Upload.upload);

// Validation Middleware
secureRouter.use('', jwt.token);
secureRouter.post('/api/v1/users', neo.allUsers);


module.exports = {
    router,
    secureRouter
};