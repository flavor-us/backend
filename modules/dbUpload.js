const models = require("../models");

exports.uploadContent = async function (content, tagId) {
	const newContent = await models.Contents.create(content).then((uploadedColumn) => {
		return uploadedColumn;
	}).catch((err) => {
		console.log(err);
	});
	if (tagId) {
		const tag = await models.Tag.findOne({
			where: {
				id: tagId
			}
		});
		await newContent.addTag(tag);
	}
	return (newContent.dataValues.id);
}

exports.uploadUser = async function (user) {
	const uid = await models.User.create(user).then((uploadedColumn) => {
		console.log(uploadedColumn.dataValues.uid)
		return uploadedColumn.dataValues.uid;
	}).catch((err) => {
		console.log(err);
		throw new Error("유저를 업로드하지 못했습니다.");
	});
	return uid;
}