const dbUpload = require("../../../modules/dbUpload");
const models = require("../../../models");
const errorMsg = require("../../../message/error");
const completeMsg = require("../../../message/complete");
const Sequelize = require("sequelize");
const nearStation = require("../../../modules/nearStation");
const kakaoIdConvert = require("../../../modules/kakaoIdConvert");
const nearCity = require("../../../modules/nearCity");
const Op = Sequelize.Op;
const logger = require("../../../config/logger");

exports.uploadContents = async (req, res) => {
	var content_id, city;
	try {
		if (!req.body.lat || !req.body.lng || !req.body.filename || !req.body.restname)
			throw (errorMsg.notEnoughReq);
		const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.body.kakao_id);
		const station = await nearStation.getNearStation(req.body.lat, req.body.lng);
		if (!station)
			city = await nearCity.getNearCity(req.body.lat, req.body.lng);
		const content = {
			user_id: user_id,
			rest_id: req.body.rest_id,
			date: new Date(),
			filename: req.body.filename,
			filepath: process.env.BUCKET_ADDR + user_id + "/" + req.body.filename,
			rekognition: req.body.rekog,
			restname: req.body.restname,
			lat: req.body.lat,
			lng: req.body.lng,
			adj1_id: req.body.adj1_id,
			adj2_id: req.body.adj2_id,
			locationtag_id: req.body.locationtag_id,
			near_station: station ? station.name : city.name,
			near_point: station ? station.name : city.name,
			station_distance: station ? station.distance : city.distance,
			point_distance: station ? station.distance : city.distance
		}
		content_id = await dbUpload.uploadContent(content);
	} catch (e) {
		console.log(e);
		logger.error("[uploadContents] : " + e);
		if (e == errorMsg.notEnoughReq)
			return (res.status(400).send(errorMsg.notEnoughReq));
		if (e == errorMsg.noUser)
			return (res.status(400).send(errorMsg.noUser));
		else
			return (res.status(400).send(errorMsg.uploadFail));
	};
	return (res.status(201).send({ msg: completeMsg.uploadComplete.msg, content_id: content_id }));
}

exports.updateContents = async (req, res) => {
	var content_id;
	try {
		let content = {};
		if ((!req.body.adj1_id && !req.body.adj2_id && !req.body.locationtag_id) || (!req.params.content_id))
			throw (errorMsg.notEnoughReq)
		if (req.body.adj1_id)
			content.adj1_id = req.body.adj1_id
		if (req.body.adj2_id)
			content.adj2_id = req.body.adj2_id
		if (req.body.locationtag_id)
			content.locationtag_id = req.body.locationtag_id
		content_id = await dbUpload.updateContents(content, req.params.content_id);
	} catch (e) {
		logger.error("[updateContents] : " + JSON.stringify(e));
		if (e == errorMsg.notEnoughReq)
			return (res.status(400).send(errorMsg.notEnoughReq));
		else
			return (res.status(400).send(errorMsg.updateFail));
	}
	return (res.status(201).send({ msg: completeMsg.updateComplete.msg, content_id: content_id }));
}

exports.deleteContents = async (req, res) => {
	logger.info(`${req.method} ${req.url}`);
	try {
		if (!req.params.content_id)
			throw (errorMsg.notEnoughReq);
		const content = await models.Contents.destroy({
			where: {
				id: req.params.content_id
			}
		});
		if (!content)
			throw (errorMsg.noContent);
	} catch (e) {
		logger.error("[deleteContents] : " + JSON.stringify(e));
		if (e == errorMsg.noContent)
			return (res.status(400).send(errorMsg.noContent));
		else if (e == errorMsg.notEnoughReq)
			return (res.status(400).send(errorMsg.notEnoughReq));
		else
			return (res.status(400).send(errorMsg.deleteFail));
	}
	return (res.status(204).send());
}

exports.getMyContents = async (req, res) => {
	var contents;
	logger.info(`${req.method} ${req.url}`);
	try {
		if (!req.params.kakao_id)
			throw (errorMsg.notEnoughReq);
		const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
		contents = await models.Contents.findAll({
			include: [
				{ attributes: ["username", "profileimg_path", "kakao_id"], model: models.User },
				{ attributes: ["tagname"], model: models.Tag_FirstAdj },
				{ attributes: ["tagname"], model: models.Tag_SecondAdj },
				{ attributes: ["tagname"], model: models.Tag_Location },
				{ attributes: ["id", "user_id", "content"], model: models.Comments }
			],
			where: { user_id: user_id }
		})
	} catch (e) {
		logger.error("[getMyContents] : " + JSON.stringify(e));
		if (e == errorMsg.notEnoughReq)
			return (res.status(400).send(errorMsg.notEnoughReq));
		else if (e == errorMsg.noUser)
			return (res.status(400).send(errorMsg.noUser));
		else
			return (res.status(400).send(errorMsg.readFail));
	}
	return (res.status(200).send({ result: contents }));
}

exports.getRelevantContents = async (req, res) => {
	logger.info(`${req.method} ${req.url}`);
	var contents;
	if (req.query.page && req.query.count) {
		var page = Number(req.query.page);
		var count = Number(req.query.count);
		var offset = Number(count * (page - 1));
	}
	try {
		if (!req.params.kakao_id)
			throw (errorMsg.notEnoughReq);
		const maxCnt = (req.query.max && req.query.max < 50 && req.query.max > 0) ? req.query.max : null;
		const user_id = await kakaoIdConvert.getUserIdByKakaoId(req.params.kakao_id);
		const friends = await models.Relation.findAll({
			attributes: ['followed_id'],
			where: {
				follower_id: user_id
			}
		})
		const friendList = friends.map((item) => {
			return item.dataValues.followed_id;
		})
		if (!req.query.page || !req.query.count) {
			contents = await models.Contents.findAll({
				include: [
					{ attributes: ["username", "profileimg_path", "kakao_id"], model: models.User },
					{ attributes: ["tagname"], model: models.Tag_FirstAdj },
					{ attributes: ["tagname"], model: models.Tag_SecondAdj },
					{ attributes: ["tagname"], model: models.Tag_Location },
					{ attributes: ["id", "user_id", "content", "createdAt"], model: models.Comments },
				],
				where: { [Op.or]: [{ user_id: { [Op.in]: friendList } }, { user_id: user_id }] },
				order: [['date', 'DESC']],
				limit: maxCnt ? Number(maxCnt) : null
			})
		} else {
			contents = await models.Contents.findAll({
				include: [
					{ attributes: ["username", "profileimg_path", "kakao_id"], model: models.User },
					{ attributes: ["tagname"], model: models.Tag_FirstAdj },
					{ attributes: ["tagname"], model: models.Tag_SecondAdj },
					{ attributes: ["tagname"], model: models.Tag_Location },
					{ attributes: ["id", "user_id", "content", "createdAt"], model: models.Comments },
				],
				where: { [Op.or]: [{ user_id: { [Op.in]: friendList } }, { user_id: user_id }] },
				order: [['date', 'DESC']],
				offset: offset,
				limit: count
			})
		}

		contents = contents.map((content) => {
			if (content.dataValues.near_station && content.dataValues.station_distance) {
				content.dataValues.near_point = content.dataValues.near_station;
				content.dataValues.point_distance = content.dataValues.station_distance;
			}
			return (content);
		});
		var i = -1, j = -1;
		while (contents && contents[++i]) {
			j = -1;
			while (contents[i].Comments && contents[i].Comments[++j]) {
				console.log(contents[i].Comments && contents[i].Comments[j]);

				var writer = await models.User.findOne({
					where: {
						id: contents[i].Comments[j].dataValues.user_id
					}
				})
				contents[i].Comments[j].dataValues.username = writer.dataValues.username;
				contents[i].Comments[j].dataValues.profileimg_path = writer.dataValues.profileimg_path;
				contents[i].Comments[j].dataValues.kakao_id = writer.dataValues.kakao_id;
			}
		}
	} catch (e) {
		logger.error("[getRelevantContents] : " + JSON.stringify(e));
		if (e == errorMsg.notEnoughReq)
			return (res.status(400).send(errorMsg.notEnoughReq));
		else if (e == errorMsg.noUser)
			return (res.status(400).send(errorMsg.noUser));
		else
			return (res.status(400).send(errorMsg.readFail));
	}
	return (res.status(200).send({ result: contents }));
}
