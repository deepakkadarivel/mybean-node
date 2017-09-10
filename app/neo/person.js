const promise = require('bluebird');

const config = require('../../config/env/development');
const constants = require('../../app/constants/constants');
const crypt = require('../auth/crypt');
const jwt = require('../auth/jwt');
const payload = require('../../app/response/payload');
const query = require('../../app/neo/nodes/person');
const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(config.neoSandbox, neo4j.auth.basic(config.neoUserSandbox, config.neoUserPasswordSandbox));
const session = driver.session();

const allUsers = (req, res, next) => {
    const payloadParam = req.body;

    const params = {
        skipParam: payloadParam.skip,
        limitParam: payloadParam.limit,
    };

    session.run(query.ALL_PERSONS, params)
        .then((result) => {
            let records = [];
            result.records.forEach((record) => {
                let newRecord = {
                    name: record._fields[0].properties.name,
                    email: record._fields[0].properties.email,
                    phone: record._fields[0].properties.phone,
                };
                records.push(newRecord);
            });
            payload.successWithData(constants.success, null, constants.data, records, req, res);
            session.close();
        })
        .catch((err) => {
            console.log('err', err);
            return next(err);
        });
};

const login = (req, res, next) => {
    const person = req.body;

    const params = {
        emailParam: person.email
    };

    session.run(query.AUTHENTICATE_PERSON, params)
        .then((result) => {
            if (result.records.length) {
                result.records.forEach((record) => {
                    if (!crypt.validPassword(person.password, record.get('password'))) {
                        payload.unauthorized(null, constants.unauthorized, constants.invalid_login, req, res);
                    } else {
                        const access_token = jwt.generateAccessTokenFrom(person.email);
                        payload.successWithData(constants.success, constants.login_successful, constants.access_token, access_token, req, res);
                    }
                });
            } else {
                payload.unauthorized(null, constants.unauthorized, constants.invalid_login, req, res);
            }
            session.close();
        })
        .catch((err) => {
            return next(err);

        });
};

const register = (req, res, next) => {
    const person = req.body;
    const password_hash = crypt.generateHash(person.password);

    const params = {
        nameParam: person.name,
        emailParam: person.email,
        phoneParam: person.phone,
        passwordParam: password_hash
    };

    session.run(query.CREATE_PERSON, params)
        .then((result) => {
            result.records.forEach((record) => {
                payload.created(constants.created, constants.account_created, req, res)
            });
            session.close();
        })
        .catch((err) => {
            if (err.code === constants.neo_unique_violation) {
                payload.unauthorized(err, constants.unauthorized, constants.duplicate_user, req, res);
            } else {
                return next(err);
            }
        });
};

module.exports = {
    allUsers,
    login,
    register,
};