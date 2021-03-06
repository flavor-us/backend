var AWS = require("aws-sdk");
var fs = require("fs");
const logger = require("../config/logger");

exports.uploadS3Bucket = async function (filepath, filetype, userId) {
	AWS.config.region = process.env.AWS_REGION;
	var s3 = new AWS.S3();
	const fileExtension = filetype.split("/")[1];
	var uploadedFileInfo = {
		key: "",
		location: "",
	};
	var param = {
		Bucket: process.env.BUCKET_NAME,
		Key: `${userId}/${Date.now()}.${fileExtension}`,
		ACL: "public-read",
		Body: fs.createReadStream(filepath),
		ContentType: filetype,
	};
	var putObjectPromise = s3.upload(param).promise();
	var location = await putObjectPromise
		.then(function (data) {
			return data.Location;
		})
		.catch(function (err) {
			logger.error(err);
			throw (err);
		});
	uploadedFileInfo.key = param.Key;
	uploadedFileInfo.location = location;
	return uploadedFileInfo;
};

exports.deleteS3Bucket = async function (filepath) {
	AWS.config.region = process.env.AWS_REGION;
	new AWS.Config({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION,
	})
	var s3 = new AWS.S3();
	var param = {
		Bucket: process.env.BUCKET_NAME,
		Key: filepath
	};
	s3.deleteObject(param, function (err, data) {
		if (err) {
			logger.error(err);
			throw (err)
		}
		else {
			return (data);
		}
	})
}

exports.getLabel = async function (filename) {
	const bucket = process.env.BUCKET_NAME; // the bucketname without s3://
	const photo = filename; // the name of file
	const config = new AWS.Config({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION,
	});
	const client = new AWS.Rekognition();
	const params = {
		Image: {
			S3Object: {
				Bucket: bucket,
				Name: photo,
			},
		},
		MaxLabels: 10,
	};
	function detectLabelsPromise(params) {
		return new Promise((resolve, rejects) => {
			client.detectLabels(params, (err, data) => {
				if (err) rejects(err);
				else resolve(data);
			});
		});
	}
	var labels = await detectLabelsPromise(params)
		.then((data) => {
			return data;
		})
		.catch((err) => {
			logger.error(err);
			throw (err);
		});
	return labels;
};
