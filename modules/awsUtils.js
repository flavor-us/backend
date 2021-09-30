var AWS = require('aws-sdk');
var fs = require('fs');
require("dotenv").config();

exports.uploadS3Bucket = async function (filepath, filetype) {
    AWS.config.region = 'ap-northeast-2';
    var s3 = new AWS.S3();
    var param = {
        'Bucket': 'flavbucket',
        'Key': 'uploadedfile.jpeg',
        'ACL': 'public-read',
        'Body': fs.createReadStream(filepath),
        'ContentType': filetype
    }
    var putObjectPromise = s3.upload(param).promise();
    var location = await putObjectPromise.then(function (data) {
        return data.Location;
    }).catch(function (err) {
        console.log(err);
    });
    return location;
}

exports.getLabel = async function (filename) {
    const bucket = 'flavbucket' // the bucketname without s3://
    const photo = filename // the name of file
    const config = new AWS.Config({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    })
    const client = new AWS.Rekognition();
    const params = {
        Image: {
            S3Object: {
                Bucket: bucket,
                Name: photo
            },
        },
        MaxLabels: 10
    }
    function detectLabelsPromise(params) {
        return new Promise((resolve, rejects) => {
            client.detectLabels(params, (err, data) => {
                if (err)
                    rejects(err)
                else
                    resolve(data);
            })
        })
    }
    var labels = await detectLabelsPromise(params)
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log(err);
        })
    return (labels)
}