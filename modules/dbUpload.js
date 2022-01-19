const models = require("../models");
const errorMsg = require("../message/error");
const logger = require("../config/logger");

exports.uploadContent = async (content) => {
	const id = await models.Contents.create(content).then((uploadedColumn) => {
		return uploadedColumn.dataValues.id;
	})
	return (id);
}

exports.updateContents = async (content, content_id) => {
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
	const result = await models.User.update(
		{ kakaotoken: token }, {
		where: {
			kakao_id: kakao_id
		}
	}
	).catch(e => {
		logger.error("[updateToken] : " + JSON.stringify(e));
	})
	if (!result[0])
		throw (errorMsg.updateFail);
	return;
}

exports.uploadAppointment = async (appointment) => {
	const id = await models.Appointments.create(appointment).then((uploadedColumn) => {
		return uploadedColumn.dataValues.id;
	})
	return id;
}