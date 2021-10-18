const models = require("../models");

exports.uploadContent = async function (content) {
	console.log(content.rekognition);
	await models.Contents.create(content).catch((err) => {
		console.log(err);
	});
};
