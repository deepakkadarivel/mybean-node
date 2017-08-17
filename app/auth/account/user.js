const promise = require('bluebird');

const config = require('../../../config/env/development');
const constants = require('../../constants/constants');
const crypt = require('../../auth/crypt');
const jwt = require('../jwt');
const payload = require('../../response/payload');

const options = {
    promiseLib: promise
};

const pgp = require('pg-promise')(options);
const QRE = pgp.errors.QueryResultError;
const qrec = pgp.errors.queryResultErrorCode;
const connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL : config.db;
const db = pgp(connectionString);

const getAllUsers = (req, res, next) => {
    db.any('SELECT * FROM account').then((data) => {
        payload.successWithData(constants.success, null, constants.data, data, req, res);
    }).catch((err) => {
        return next(err)
    })
};

const login = (req, res, next) => {
    const account = req.body;

    db.one('SELECT * FROM account WHERE email=$1;', account.email).then((data) => {

        if (!crypt.validPassword(account.password, data.password_hash)) {
            payload.unauthorized(null, constants.unauthorized, constants.invalid_login, req, res);
        } else {
            const access_token = jwt.generateAccessTokenFrom(data.id, data.username, data.email);
            payload.successWithData(constants.success, constants.login_successful, constants.access_token, access_token, req, res);
        }
    }).catch((err) => {
        if (err instanceof QRE && err.code === qrec.noData) {
            payload.unauthorized(err, constants.unauthorized, constants.invalid_login, req, res);
        } else {
            return next(err);
        }
    })
};

const register = (req, res, next) => {
    const account = req.body;
    const password_hash = crypt.generateHash(account.password);

    db.none('INSERT INTO account (username, email, password_hash) VALUES ($1, $2, $3)', [account.username, account.email, password_hash]).then(() => {
        payload.created(constants.created, constants.account_created, req, res)
    }).catch((err) => {
        if (err.code === constants.unique_violation) {
            payload.unauthorized(err, constants.unauthorized, constants.duplicate_user, req, res);
        } else {
            return next(err);
        }
    })
};

module.exports = {
    getAllUsers: getAllUsers,
    login: login,
    register: register
};
