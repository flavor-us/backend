const models = require("../models");
const errorMsg = require("../message/error");

exports.uploadContent = async (content) => {
	const newContent = await models.Contents.create(content).then((uploadedColumn) => {
		return uploadedColumn;
	})
	return (newContent.dataValues.id);
}

exports.updateContents = async (content, content_id) => {
	const targetcontent = await models.Contents.findOne({
		where: { id: content_id }
	})
	if (!targetcontent)
		throw (errorMsg.noContent);
	targetcontent.set({
		adj1_id: content.adj1_id,
		adj2_id: content.adj2_id,
		locationtag_id: content.locationtag_id,
	})
	await targetcontent.save();
	return (targetcontent.dataValues.id);
}

exports.uploadUser = async (user) => {
	const id = await models.User.create(user).then((uploadedColumn) => {
		return uploadedColumn.dataValues.id;
	})
	return id;
}

exports.updateProfile = async (profile, user_id) => {
	const user = await models.User.findOne({
		where: { id: user_id }
	})
	if (!user)
		throw (errorMsg.noUser);
	if (profile.profileimg_path) {
		console.log(user.set({
			username: profile.username,
			profileimg_path: profile.profileimg_path
		}))
	} else {
		user.set({
			username: profile.username
		})
	}
	await user.save();
	return (user.dataValues.id);
}