const AWS = require('aws-sdk');
const async = require('async');
const bucketName = "medwall";
const fs = require('fs');
const config = require('../../config/env/development');
const uuidv1 = require('uuid/v1');

const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

AWS.config.loadFromPath('config.json');

const s3 = new AWS.S3({region: 'ap-south-1'});
const createMainBucket = (callback) => {
    // Create the parameters for calling createBucket
    const bucketParams = {
        Bucket: bucketName
    };
    s3.headBucket(bucketParams, function (err, data) {
        if (err) {
            console.log("ErrorHeadBucket", err)
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
            console.log("Successfully uploaded image on S3", data);
            callback(null, data)
        }
    })
};
exports.upload = (req, res, next) => {
    var tmp_path = req.files.file.path;
    file = fs.createReadStream(tmp_path);
    fileType = req.files.file.type;
    fileExtension = getFileExtension(req.files.file.name);
    fileName = uuidv1().concat('.', fileExtension);
    async.series([
        createMainBucket,
        createItemObject
    ], (err, result) => {
        if (err) return res.send(err);
        else return res.json({message: "Successfully uploaded", url: 'https://s3.' + config.region + '.amazonaws.com/' + config.bucket + '/' + fileName})
    })
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