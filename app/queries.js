var promise = require('bluebird');
var bcrypt   = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var options = {
    promiseLib: promise
};

var constants = require('./appconstants/constants');
var config = require('./appconstants/config');
var pgp = require('pg-promise')(options);
var QRE = pgp.errors.QueryResultError;
var qrec = pgp.errors.queryResultErrorCode;
var connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL : 'postgres://admin:C0mplexPwd!1234@localhost:5432/node_hero';
var db = pgp(connectionString);


function runSeedScripts() {
    createUsersTable()
}

function createUsersTable() {
    db.any(constants.DROP_USER_TABLE).then()
        .catch((err) => {
            return next(err)
        });

    db.any(constants.CREATE_ACCOUNT_TABLE).then()
        .catch((err) => {
            return next(err)
        });
};


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
    var password_hash = generateHash(account.password);

    db.none('INSERT INTO account (username, email, password_hash) VALUES ($1, $2, $3)', [account.username, account.email, password_hash]).then(() => {
        res.status(200).json({
            status: 'success',
            message: 'account created'
        })
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

        if (!validPassword(account.password, data.password_hash)) {
            res.status(401).json({
                status: 'Failed',
                message: 'Authentication failed. Wrong password.',
            })
        } else {
            const jwtPayload = {
                id: data.id,
                username: data.username,
                email: data.email
            };
            const jwtData = {
                expiresIn: config.jwtDuration,
            };
            const secret = config.jwtSecret;
            var token = jwt.sign(jwtPayload, secret, jwtData);

            res.status(200).json({
                status: 'success',
                message: 'login successful',
                access_token: token
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

var generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

var validPassword = (password, password_hash) => {
    return bcrypt.compareSync(password, password_hash);
};

module.exports = {
    getAllUsers: getAllUsers,
    runSeedScripts: runSeedScripts,
    register: register,
    login: login
};
