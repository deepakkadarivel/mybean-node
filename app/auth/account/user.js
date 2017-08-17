var promise = require('bluebird');
var jwt = require('../jwt');

var config = require('../../config/env/development');
var crypt = require('../../auth/crypt');
var payload = require('../../response/payload');
var constants = require('../../constants/constants');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var QRE = pgp.errors.QueryResultError;
var qrec = pgp.errors.queryResultErrorCode;
var connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL : config.db;
var db = pgp(connectionString);

var getAllUsers = (req, res, next) => {
    db.any('SELECT * FROM account').then((data) => {
        res.status(200)
            .json({
                status: 'success',
                data: data,
                message: 'Retrieved ALL Users'
            })
    }).catch((err) => {
        return next(err)
    })
};

var register = (req, res, next) => {
    var account = req.body;
    var password_hash = crypt.generateHash(account.password);

    db.none('INSERT INTO account (username, email, password_hash) VALUES ($1, $2, $3)', [account.username, account.email, password_hash]).then(() => {
        // res.status(200).json({
        //     status: 'success',
        //     message: 'account created'
        // })
        payload.success(constants.success, constants.account_created, req, res)
    }).catch((err) => {
        if (err.code === '23505') {
            res.status(401).json({
                status: 'Failed',
                message: 'User with email already exists.'
            })
        } else {
            return next(err);
        }
    })
};

var login = (req, res, next) => {
    var account = req.body;


    db.one('SELECT * FROM account WHERE email=$1;', account.email).then((data) => {

        if (!crypt.validPassword(account.password, data.password_hash)) {
            res.status(401).json({
                status: 'Failed',
                message: 'Authentication failed. Wrong password.',
            })
        } else {
            var access_token = jwt.generateAccessTokenFrom(data.id, data.username, data.email);

            res.status(200).json({
                status: 'success',
                message: 'login successful',
                access_token: access_token
            })
        }

    }).catch((err) => {
        if (err instanceof QRE && err.code === qrec.noData) {
            res.status(401).json({
                status: 'Failed',
                message: 'Authentication failed. User not found.'
            })
        } else {
            return next(err);
        }
    })
};

module.exports = {
    getAllUsers: getAllUsers,
    register: register,
    login: login
};
