const models = require("../models");

exports.uploadContent = async function (content) {
	const contentId = await models.Contents.create(content).then((uploadedColumn) => {
		return uploadedColumn.dataValues.id;
	}).catch((err) => {
		console.log(err);
	});
	return contentId;
}

exports.uploadUser = async function (user) {
	const uid = await models.User.create(user).then((uploadedColumn) => {
		console.log(uploadedColumn.dataValues.uid)
		return uploadedColumn.dataValues.uid;
	}).catch((err) => {
		console.log(err);
	});
	return uid;
}