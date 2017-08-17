var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config/env/development');

var app = express();
app.use(bodyParser.json());
var port = process.env.PORT || config.port;

var {router, secureRouter} = require('./router');
var db = require('./queries');

db.runSeedScripts();

var handleNotFound = (req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err)
};

var handleError = (err, req, res, next) => {
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