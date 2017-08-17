const created = (status, message, req, res) => {
    res.status(201).json({
        status: status,
        message: message
    })
};

const success = (status, message, req, res) => {
    res.status(200).json({
        status: status,
        message: message
    })
};

const successWithData = (status, message, dataKey, dataValue, req, res) => {
    res.status(200).json({
        status: status,
        message: message,
        [dataKey]: dataValue
    })
};

const unauthorized = (err, status, message, req, res) => {
    res.status(401).json({
        status: status,
        message: message
    })
};

module.exports = {
    created: created,
    success: success,
    successWithData: successWithData,
    unauthorized: unauthorized,
};