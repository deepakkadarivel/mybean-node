var unauthorized = (err, status, message, req, res) => {
    res.status(401).json({
        status: status,
        message: message
    })
};

var success = (status, message, req, res) => {
    res.status(200).json({
        status: status,
        message: message
    })
};

module.exports = {
    success: success,
    unauthorized: unauthorized
};