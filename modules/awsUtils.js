var AWS = require('aws-sdk');
var fs = require('fs');
require("dotenv").config();

exports.uploadS3Bucket = function(filename){
    AWS.config.region = 'ap-northeast-2';
    var s3 = new AWS.S3();
    var param = {
        'Bucket':'flavbucket',
        'Key':'uploadedfile.jpeg',
        'ACL':'public-read',
        'Body': fs.createReadStream(filename),
        'ContentType': 'image/jpeg'
    }
    s3.putObject(param, function(err, data){
        console.log(err);
        console.log(data);
    })
}

exports.getLabel = function(filename){
    const bucket = 'flavbucket' // the bucketname without s3://
    const photo  = filename // the name of file

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
    client.detectLabels(params, function(err, response) {
    if (err) {
        console.log(err, err.stack); // if an error occurred
    } else {
        console.log(`Detected labels for: ${photo}`)
        response.Labels.forEach(label => {
        console.log(`Label:      ${label.Name}`)
        console.log(`Confidence: ${label.Confidence}`)
        console.log("Instances:")
        label.Instances.forEach(instance => {
            let box = instance.BoundingBox
            console.log("  Bounding box:")
            console.log(`    Top:        ${box.Top}`)
            console.log(`    Left:       ${box.Left}`)
            console.log(`    Width:      ${box.Width}`)
            console.log(`    Height:     ${box.Height}`)
            console.log(`  Confidence: ${instance.Confidence}`)
        })
        console.log("Parents:")
        label.Parents.forEach(parent => {
            console.log(`  ${parent.Name}`)
        })
        console.log("------------")
        console.log("")
        }) // for response.labels
    } // if
    });
}