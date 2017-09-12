const bodyParser = require('body-parser');
const express = require('express');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const config = require('../config/env/development');
const schema = require('./schema');

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || config.port;

const {router, secureRouter} = require('./router');

const handleNotFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err)
};

const handleError = (err, req, res, next) => {
    res.status(err.status || 500)
        .json({
            status: 'error',
            message: err.message
        })
};

let access_token = {};
const validateToken = (req, res, next) => {
    const token = req.body.token || req.headers['access_token'];
    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decode) => {
            if (err) {
                const newObj = {isTokenValid: false, value: null};
                Object.assign(access_token, newObj);
            } else {
                const newObj = {isTokenValid: true, value: decode.id};
                Object.assign(access_token, newObj);
            }
        })
    } else {
        const newObj = {isTokenValid: false, value: null};
        Object.assign(access_token, newObj);
    }
    next();
};

app.use(validateToken);
app.use('/graphql', bodyParser.json(), graphqlExpress({schema, context: {access_token}}));
app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmMmE5MGEwLTk3ZDQtMTFlNy04MGJjLTFkOWYxYjRhMjk1MCIsImlhdCI6MTUwNTI0MzQ4MiwiZXhwIjoxNTA1MjQ1MjgyfQ.u45BaVqWuCWDD7Kd4yGKFpuML8SUHqQ2CKg0h8xRoHQ'`,
}));

app.use(router);
// app.use(secureRouter);
app.use(handleNotFound);
app.use(handleError);


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened...', err)
    }
    console.log(`app is running at port ${port}`)
});