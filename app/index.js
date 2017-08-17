const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config/env/development');

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

app.use(router);
app.use(secureRouter);
app.use(handleNotFound);
app.use(handleError);


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened...', err)
    }
    console.log(`app is running at port ${port}`)
});