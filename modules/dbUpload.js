const models = require("../models");
const errorMsg = require("../message/error");

exports.uploadContent = async (content) => {
	const id = await models.Contents.create(content).then((uploadedColumn) => {
		return uploadedColumn.dataValues.id;
	})
	return (id);
}

exports.updateContents = async (content, content_id) => {
	// const targetcontent = await models.Contents.findOne({
	// 	where: { id: content_id }
	// })
	// if (!targetcontent)
	// 	throw (errorMsg.noContent);
	// targetcontent.set({
	// 	adj1_id: content.adj1_id,
	// 	adj2_id: content.adj2_id,
	// 	locationtag_id: content.locationtag_id,
	// })
	// await targetcontent.save();
	const result = await models.Contents.update(
		content, {
		where: {
			id: content_id
		}
	}
	)
	if (!result[0])
		throw (errorMsg.updateFail);
	return
}

exports.uploadUser = async (user) => {
	const id = await models.User.create(user).then((uploadedColumn) => {
		return uploadedColumn.dataValues.id;
	})
	return id;
}

exports.updateProfile = async (profile, user_id) => {
	// const user = await models.User.findOne({
	// 	where: { id: user_id }
	// })
	// if (!user)
	// 	throw (errorMsg.noUser);
	// if (profile.profileimg_path) {
	// 	user.set({
	// 		username: profile.username,
	// 		profileimg_path: profile.profileimg_path
	// 	})
	// } else {
	// 	user.set({
	// 		username: profile.username
	// 	})
	// }
	// await user.save();
	const result = await models.User.update(
		profile, {
		where: {
			id: user_id
		}
	}
	)
	if (!result[0])
		throw (errorMsg.updateFail);
	return;
}

exports.updateToken = async (token, kakao_id) => {
	console.log("token: " + token + "\n" + "kakao_id : " + kakao_id);
	const result = await models.User.update(
		{ kakaotoken: token }, {
		where: {
			kakao_id: kakao_id
		}
	}
	).catch(e => {
		console.log(e);
	})
	console.log(result);
	if (!result[0])
		throw (errorMsg.updateFail);
	return;
}