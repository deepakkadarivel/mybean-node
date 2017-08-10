var express = require('express');
var router = express.Router();

var db = require('./queries');

var getAppStatus = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'App Initialized'
    })
};

router.get('/', getAppStatus);
router.get('/api/users', db.getAllUsers);
router.post('/api/users', db.createUser);

module.exports = router;