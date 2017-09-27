const jwt = require('jsonwebtoken');
const neo4j = require('neo4j-driver').v1;
const AWS = require('aws-sdk');
const async = require('async');
const constants = require('../constants/constants');
const payload = require('../response/payload');
const fs = require('fs');
const query = require('../neo/nodes/person');
const config = require('../../config/env/development');
const uuidv1 = require('uuid/v1');
const bucketName = "medwall";

const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

const driver = neo4j.driver(config.neoLocal, neo4j.auth.basic(config.neoUser, config.neoUserPassword));

AWS.config.loadFromPath('config.json');

const s3 = new AWS.S3({region: 'ap-south-1'});
const createMainBucket = (callback) => {
    // Create the parameters for calling createBucket
    const bucketParams = {
        Bucket: bucketName
    };
    s3.headBucket(bucketParams, function (err, data) {
        if (err) {
            console.log("ErrorHeadBucket", err);
            s3.createBucket(bucketParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                    callback(err, null)
                } else {
                    callback(null, data)
                }
            });
        } else {
            callback(null, data)
        }
    })
};

const createItemObject = (callback) => {
    const params = {
        Bucket: bucketName,
        Key: `${fileName}`,
        ACL: 'public-read',
        Body: file
    };
    s3.putObject(params, function (err, data) {
        if (err) {
            console.log("Error uploading image: ", err);
            callback(err, null)
        } else {
            console.log("Successfully uploaded image on S3");
            callback(null, data)
        }
    })
};
exports.upload = (req, res, next) => {
    let access_token = req.body.access_token;
    if (!access_token) {
        payload.unauthorized(null, constants.unauthorized, constants.invalid_login, req, res);
    } else {
        jwt.verify(access_token, config.jwtSecret, (err, decode) => {
            if (err) {
                payload.unauthorized(null, constants.unauthorized, constants.invalid_login, req, res);
            } else {
                let tmp_path = req.files.file.path;
                file = fs.createReadStream(tmp_path);
                fileType = req.files.file.type;
                fileExtension = getFileExtension(req.files.file.name);
                fileName = uuidv1().concat('.', fileExtension);
                async.series([
                    createMainBucket,
                    createItemObject
                ], (err, result) => {
                    if (err) return res.send(err);
                    else {
                        let params = {
                            case: req.body.case,
                            date: req.body.date,
                            amount: req.body.amount,
                            description: req.body.description,
                            fileName: req.files.file.name,
                            fileType: req.files.file.type,
                            fileSize: req.files.file.size,
                            status: constants.pending,
                            url: 'https://s3.' + config.region + '.amazonaws.com/' + config.bucket + '/' + fileName
                        };
                        createNewRecord(params, decode.id);
                        return res.json(params)
                    }
                })
            }
        });
    }
};
exports.displayForm = (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.write(
        '<form action="/upload" method="post" enctype="multipart/form-data">' +
        '<input type="file" name="file">' +
        '<input type="submit" value="Upload">' +
        '</form>'
    );
    res.end();
};

const verifyToken = async (token) => {
    await jwt.verify(token, config.jwtSecret, (err, decode) => {
        if (err) {
            return {
                access_token: token,
                isTokenValid: false,
                value: null,
            };
        } else {
            return {
                access_token: token,
                isTokenValid: true,
                value: decode.id,
            };
        }
    });
};

const createNewRecord = async (params, id) => {
    params.uploadedBy = id;
    let records = await putData(query.CREATE_RECORD, params);
    await createRelation(query.RELATE_RECORD, {id, recordId: records[0].id});
};

const createRelation = (relateQuery, params) => {
    let session = driver.session();
    session.run(relateQuery, params);
    session.close();
};

const putData = (mutateQuery, params) => {
    params.id = uuidv1();
    let session = driver.session();
    let response = session.run(mutateQuery, params)
        .then(result => {
            return result.records.map(record => {
                return record._fields[0].properties
            })
        });
    return response;
    session.close();
};