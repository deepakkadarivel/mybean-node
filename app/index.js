var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
var port = process.env.PORT || 8080;

var router = require('./router');

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
app.use(handleNotFound);
app.use(handleError);


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened...', err)
    }
    console.log(`app is running at port ${port}`)
});