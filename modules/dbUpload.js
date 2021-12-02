const models = require("../models");

exports.uploadContent = async function (content) {
	const newContent = await models.Contents.create(content).then((uploadedColumn) => {
		return uploadedColumn;
	}).catch((err) => {
		console.log(err);
	});
	return (newContent.dataValues.id);
}

exports.updateContents = async function (content, content_id) {
	const targetcontent = await models.Contents.findOne({
		where: { id: content_id }
	})
	targetcontent.set({
		tagList: content.tagList
	})
	await targetcontent.save();
	return (targetcontent.dataValues.id);
}

exports.uploadUser = async function (user) {
	const id = await models.User.create(user).then((uploadedColumn) => {
		console.log(uploadedColumn.dataValues.uid)
		return uploadedColumn.dataValues.id;
	}).catch((err) => {
		console.log(err);
		throw new Error("유저를 업로드하지 못했습니다.");
	});
	return id;
}