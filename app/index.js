var express = require('express');
var bodyParser = require('body-parser');
var promise = require('bluebird');

var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);

var app = express();
app.use(bodyParser.json());
const port = 3600;

var handleError = (err, req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: err.message
    })
};
app.use(handleError);

app.get('/', (req, res) => {
    res.json({
        status: 200,
        message: 'App initialized'
    })
});

app.post('/users', (req, res) => {
    var user = req.body;

    var db = pgp('postgres://admin:C0mplexPwd!1234@localhost:5432/node_hero');
    db.none('INSERT INTO users (name, age) VALUES ($1, $2);', [user.name, user.age]).then(() => {
        res.status(200).json({
            status: 'success',
            message: 'User inserted into table'
        })
    }).catch((err) => {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    })
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened...')
    }

    console.log(`app is running at port ${port}`)
});