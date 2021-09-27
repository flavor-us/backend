var AWS = require('aws-sdk');
var fs = require('fs');
AWS.config.region = 'ap-northeast-2';
var s3 = new AWS.S3();
var param = {
    'Bucket':'flavbucket',
    'Key':'uploadedfile.jpeg',
    'ACL':'public-read',
    'Body': fs.createReadStream('foods-1632389247534.jpeg'),
    'ContentType': 'image/jpeg'
}
s3.putObject(param, function(err, data){
    console.log(err);
    console.log(data);
})