var promise = require('bluebird');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL : 'postgres://admin:C0mplexPwd!1234@localhost:5432/node_hero';
var db = pgp(connectionString);


var getAllUsers = (req, res, next) => {
    db.any('SELECT * FROM users').then((data) => {
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

var createUser = (req, res, next) => {
    var user = req.body;

    db.none('INSERT INTO users (name, age) VALUES ($1, $2);', [user.name, user.age]).then(() => {
        res.status(200).json({
            status: 'success',
            message: 'User inserted'
        })
    }).catch((err) => {
        return next(err);
    })

};

module.exports = {
    getAllUsers: getAllUsers,
    createUser: createUser
};
